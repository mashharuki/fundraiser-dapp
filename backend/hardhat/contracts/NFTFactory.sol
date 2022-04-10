/**
 * NFTコントラクトをデプロイするためのコントラクトファイル
 */

pragma solidity >0.4.23;

// NFTコントラクトファイルをインポートする。
import './NFT.sol';

/**
 * NFTFactoryコントラクト
 */
contract NFTFactory {
    // NFTコントラクト用の配列
    NFT[] private _NFTs;
    // nfts関数から返すことのできる最大値
    uint256 constant maxLimit = 20;
    // MINTER_ROLEのkeccak256の値
    bytes32 minter_role = 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6;
    // PAUSER_ROLEのkecak256の値
    bytes32 pauser_role = 0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a;
    // NFT作成時に呼び出すイベント
    event NFTCreated (NFT indexed nft,string name, string symbol, string url);

    /**
     * NFT数を取得する関数
     */
    function NFTsCount () public view returns (uint256) {
        return _NFTs.length;
    }

    /**
     * NFTを作成するイベント
     */
    function createNFT (string memory name, string memory symbol, string memory url) public {
        // インスタンスを生成
        NFT nft = new NFT (name, symbol, url);
        // MINTER権限とPAUSER権限を付与する。
        nft.grantRole(minter_role, msg.sender);
        nft.grantRole(pauser_role, msg.sender);
        // 配列に格納する。
        _NFTs.push(nft);
        // イベントの発行
        emit NFTCreated(nft, name, symbol, url);
    }

    /**
     * NFTコントラクトを配列に詰めて返す関数
     */
    function nfts (uint256 limit, uint256 offset) public view returns (NFT[] memory coll) {
        // offset数以上になっているかチェックする。
        require (offset <= NFTsCount(), "offset out of bounds");
        // 最大値を上回っている場合は、limitを格納する。
        uint256 size = NFTsCount() - offset;
        size = size < limit ? size : limit;
        // sizeは、maxLimitを超えてはならない。
        size = size < maxLimit ? size : maxLimit;
        // 配列を作成する。
        coll = new NFT[](size);
        // すでに作成済みのインスタンスを配列に格納する。
        for (uint256 i = 0; i < size; i++) {
            coll[i] = _NFTs[offset + i];
        }

        return coll;    
    }
}