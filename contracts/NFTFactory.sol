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
        // 配列に格納する。
        _NFTs.push(nft);
        // イベントの発行
        emit NFTCreated(nft, name, symbol, url);
    }
}