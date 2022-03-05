/**
 * NFTを発行するためのコントラクトを実装したファイル
 */

pragma solidity >0.4.23;

// 必要なモジュールをインポートする。
import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
import "./common/Base64.sol";

/**
 * NFTコントラクトを定義する。
 * (ERC721PresetMinterPauserAutoIdを継承して実装)
 */
contract NFT is ERC721PresetMinterPauserAutoId {

    // NFT名
    string nftName;
    // シンボル名
    string nftSymbol;
    // URL
    string nftUrl;

    // NFTトークンIDと紐付けて保存するデータ
    // 名前、説明、URL
    string[] private _names;
    string[] private _descriptions;
    string[] private _urls;

    /**
     * コンストラクター 
     */
    constructor(string memory name_, string memory symbol_, string memory url_) ERC721PresetMinterPauserAutoId(name_, symbol_, url_) {
        // それぞれ値をセットする。
        nftName = name_;
        nftSymbol = symbol_;
        nftUrl = url_;
    }

    /**
     * NFT名を取得する関数
     */
    function getNftName() view public returns (string memory) {
        return nftName;
    }

    /**
     * シンボル名を取得する関数
     */
    function getNftSymbol() view public returns (string memory) {
        return nftSymbol;
    }

    /**
     * NFTに紐づけられているURLを取得する。
     */
    function getNftURL() view public returns (string memory) { 
        return nftUrl;
    }
    
    /**
     * アドレスに対してNFTを発行する関数
     * @param to 発行先アドレス
     * @param tokenName_ トークンIDに割り振られる名前
     * @param description_ 説明
     * @param tokenUrl_ トークンIDに紐づけるURL
     */
    function mintNft(address to, string memory tokenName_, string memory description_, string memory tokenUrl_) public payable {
        // 名前、説明、URLをそれぞれセット
        _names.push(tokenName_);
        _descriptions.push(description_ );
        _urls.push(tokenUrl_ );
        // mint関数の呼び出し
        mint(to);
    }

    /**
     * トークンIDに紐づくメタデータを取得する関数
     * @param tokenId トークンID
     * @return bytesMetadata メタデータを格納したJSONオブジェクト
     */
    function getMetaData(uint256 tokenId) public view returns (string memory) {
        require( _exists( tokenId ), "nonexsitent token" );

        // トークンIDからデータを取得する。
        // 名前
        bytes memory bytesName = abi.encodePacked('"name":"', _names[tokenId], '"');
        // 説明
        bytes memory bytesDesc = abi.encodePacked('"description":"', _descriptions[tokenId], '"');
        // URL
        bytes memory bytesUrl = abi.encodePacked('"URL":"', _urls[tokenId], '"');
        // 取得した要素を結合する。
        bytes memory bytesObject = abi.encodePacked(
            '{',
                bytesName, ',',
                bytesDesc, ',',
                bytesUrl,
            '}'
        );
        // jsonオブジェクトをBase64エンコードしてコンテンツタイプをする。
        bytes memory bytesMetadata = abi.encodePacked('data:application/json;base64,', Base64.encode( bytesObject ));
        // 文字列として返却する。
        return (string( bytesMetadata ));
    }
}