/**
 * NFTを発行するためのコントラクトを実装したファイル
 */

pragma solidity >0.4.23;

// 必要なモジュールをインポートする。
import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";

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
    // MINTER権限を持つアドレス
    address msgsender;

    /**
     * コンストラクター 
     */
    constructor(string memory name_, string memory symbol_, string memory url_) ERC721PresetMinterPauserAutoId(name_, symbol_, url_) {
        // それぞれ値をセットする。
        nftName = name_;
        nftSymbol = symbol_;
        nftUrl = url_;
        msgsender = _msgSender();
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
}