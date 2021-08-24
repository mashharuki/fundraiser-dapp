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
    string name;
    // シンボル名
    string symbol;
    // URL
    string url;

    /**
     * コンストラクター 
     */
    constructor(string memory name_, string memory symbol_, string memory url_) ERC721PresetMinterPauserAutoId(name_, symbol_, url_) {
        // それぞれ値をセットする。
        name = name_;
        symbol = symbol_;
        url = url_;
    }

    /**
     * NFT名を取得する関数
     */
    function getName() view public returns (string memory) {
        return name;
    }

    /**
     * シンボル名を取得する関数
     */
    function getSymbol() view public returns (string memory) {
        return symbol;
    }

    /**
     * NFTに紐づけられているURLを取得する。
     */
    function getURL() view public returns (string memory) { 
        return url;
    }
}