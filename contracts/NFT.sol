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

    /**
     * コンストラクター 
     */
    constructor(string memory name, string memory symbol, string memory url) ERC721PresetMinterPauserAutoId(name, symbol, url) {}

}