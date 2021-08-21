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