pragma solidity >=0.8.0;

import './MyToken.sol';

/**
 * MyTokenFactoryコントラクト
 */
contract MyTokenFactory {
    // MyToken型の配列
    MyToken[] private _myTokens;
    // myTokens関数から返すことのできる最大値
    uint256 constant maxLimit = 20;

    // インスタンスが生成された時のイベント
    event MyTokenCreated (MyToken indexed myToken, address indexed owner);

    /**
     * インスタンス数を取得する関数
     */
    function myTokensCount () public view returns (uint256) {
        return _myTokens.length;
    }

    /**
     * MyTokenコントラクト生成関数
     * @param name トークン名
     * @param symbol シンボル名
     */
    function createMyToken (string memory name, string memory symbol) public {
        // インスタンスを生成
        MyToken myToken = new MyToken(name, symbol);
        // 配列に格納する。
        _myTokens.push(myToken);
        // イベントの発行
        emit MyTokenCreated(myToken, msg.sender);
    }

    /**
     * MyTokenコントラクト群を取得する関数
     * @param limit 上限取得値
     * @param offset 取得数
     * @return coll MyTokenコントラクトの配列 
     */
    function myTokens (uint256 limit, uint256 offset) public view returns (MyToken[] memory coll) {
        // 取得前に確認
        require (offset <= myTokensCount(), "offset out of bounds");
        // 最大値を上回っている場合は、limitを格納する。
        uint256 size = myTokensCount() - offset;
        size = size < limit ? size : limit;
        // sizeは、maxLimitを超えてはならない。
        size = size < maxLimit ? size : maxLimit;
        // コントラクト用の配列
        coll = new MyToken[](size);

        for (uint256 i = 0; i < size; i++) {
            coll[i] = _myTokens[offset + i];
        }

        return coll;    
    }
}