pragma solidity >0.4.23;

import "./Fundraiser.sol";

contract FundraiserFactory {
    // Fundraiser型の配列
    Fundraiser[] private _fundraisers;
    // fundraisers関数から返すことのできる最大値
    uint256 constant maxLimit = 20;

    // インスタンスが生成された時のイベント
    event FundraiserCreated (Fundraiser indexed fundraiser, address indexed owner);

    /**
     * インスタンス数を取得する関数
     */
    function fundraisersCount () public view returns (uint256) {
        return _fundraisers.length;
    }

    /**
     * インスタンス生成関数
     */
    function createFundraiser (string memory name, string memory url, string memory imageURL, string memory description, address payable beneficiary) public {
        // インスタンスを生成
        Fundraiser fundraiser = new Fundraiser (name, url, imageURL, description, beneficiary, msg.sender);
        // 配列に格納する。
        _fundraisers.push(fundraiser);
        // イベントの発行
        emit FundraiserCreated(fundraiser, msg.sender);
    }

    /**
     * 空のコレクションを返す関数
     */
    function fundraisers (uint256 limit, uint256 offset) public view returns (Fundraiser[] memory coll) {
        
        require (offset <= fundraisersCount(), "offset out of bounds");
        // 最大値を上回っている場合は、limitを格納する。
        uint256 size = fundraisersCount() - offset;
        size = size < limit ? size : limit;
        // sizeは、maxLimitを超えてはならない。
        size = size < maxLimit ? size : maxLimit;
        coll = new Fundraiser[](size);

        for (uint256 i = 0; i < size; i++) {
            coll[i] = _fundraisers[offset + i];
        }

        return coll;    
    }
}