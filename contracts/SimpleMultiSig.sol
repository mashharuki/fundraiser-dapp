// コンパイラーバージョンを指定
pragma solidity >0.4.23;

// solidityによるシンプルなマルチシグコードコントラクト
contract SimpleMultiSig {
 
  // EIP712は、データ署名の標準
  // EIP712 Precomputed hashes:
  // keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract,bytes32 salt)")
  bytes32 constant EIP712DOMAINTYPE_HASH = 0xd87cd6ef79d4e2b95e15ce8abf732db51ec771f1ca2edccf22a46c729ac56472;
  // keccak256("Simple MultiSig")
  bytes32 constant NAME_HASH = 0xb7a0bfa1b79f2443f4d73ebb9259cddbcd510b18be6fc4da7d1aa7b1786e73e6;
  // keccak256("1")
  bytes32 constant VERSION_HASH = 0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6;
  // keccak256("MultiSigTransaction(address destination,uint256 value,bytes data,uint256 nonce,address executor,uint256 gasLimit)")
  bytes32 constant TXTYPE_HASH = 0x3ee892349ae4bbe61dce18f95115b5dc02daf49204cc602458cd4c1f540d56d7;
  // ハッシュ値生成用のソルト
  bytes32 constant SALT = 0x251543af6a222378665a76fe38dbceae4871a070b7fdaf5c6c30cf758dc33cc0;

  // ナンス
  uint public nonce;
  // しきい値(要求署名回数)
  uint public threshold;
  // コントラクト所有者であるかどうかを紐づけるマップ変数
  mapping (address => bool) isOwner;
  // コントラクト所有者アドレスリスト
  address[] public ownersArr;
  // hash for EIP712, computed from contract address
  bytes32 DOMAIN_SEPARATOR;
  
  // コンストラクター (デプロイしたときに一度だけ呼ばれる。)
  constructor(uint threshold_, address[] owners_, uint chainId) public {
    // 処理を行う前に、コントラクト所有者の数など、問題ないかチェックする。
    require(owners_.length <= 10 && threshold_ <= owners_.length && threshold_ > 0);
    // デプロイ用の新しいアドレスを生成する。
    address lastAdd = address(0);
    // コントラクト所有者についてループ処理を実施する。
    for (uint i = 0; i < owners_.length; i++) {
      // lastAdd以上であることを確認する。
      require(owners_[i] > lastAdd);
      // 所有者であることを保存する。
      isOwner[owners_[i]] = true;
      // lastAddの値を更新する。
      lastAdd = owners_[i];
    }
    ownersArr = owners_;
    threshold = threshold_;
    // EIP712のためのハッシュ値を生成する。
    DOMAIN_SEPARATOR = keccak256(abi.encode(EIP712DOMAINTYPE_HASH, NAME_HASH, VERSION_HASH, chainId, this, SALT));
  }

  // マルチ署名を実行するための関数
  function execute(uint8[] sigV, bytes32[] sigR, bytes32[] sigS, address destination, uint value, bytes data, address executor, uint gasLimit) public {
    // 必要な条件を満たしているかをチェックする。
    require(sigR.length == threshold);
    // それぞれ個数が合致しているか確認する。
    require(sigR.length == sigS.length && sigR.length == sigV.length);
    require(executor == msg.sender || executor == address(0));

    // EIP712 scheme: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md
    // インプット用ハッシュ値を生成
    bytes32 txInputHash = keccak256(abi.encode(TXTYPE_HASH, destination, value, keccak256(data), nonce, executor, gasLimit));
    // インプット用ハッシュを用いて、さらにハッシュを生成
    bytes32 totalHash = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, txInputHash));
    // cannot have address(0) as an owner
    address lastAdd = address(0);
    // 閾値分までループ処理を行う。(署名の確認)
    for (uint i = 0; i < threshold; i++) {
      // 楕円曲線署名から公開鍵に関連付けられたアドレスを取得する。(エラーなら0を返す。)
      address recovered = ecrecover(totalHash, sigV[i], sigR[i], sigS[i]);
      // 取得したアドレスがコントラクト所有者のものであり、閾値を上回っていることチェックする。
      require(recovered > lastAdd && isOwner[recovered]);
      lastAdd = recovered;
    }

    // If we make it here all signatures are accounted for.
    // The address.call() syntax is no longer recommended, see:
    // https://github.com/ethereum/solidity/issues/2884
    // ナンスの値を更新する。
    nonce = nonce + 1;
    bool success = false;
    // 呼び出し関数の結果が、成功したかチェックする。
    assembly { success := call(gasLimit, destination, value, add(data, 0x20), mload(data), 0, 0) }
    // 成功していなければ処理を終了する。
    require(success);
  }

  // フォールバック関数
  fallback () payable external {}
}