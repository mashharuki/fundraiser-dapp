/**
 * オラクル処理用のサンプルコード
 */

pragma solidity >= 0.8.7;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {

    AggregatorV3Interface internal priceFeed;
    address proxy;

    /**
     * コンストラクター
     * Network: Kovan
     * Aggregator: proxyで指定する。
     * Address: デプロイ時に指定する。
     */
    constructor(address _proxy) {
        proxy = _proxy;
        // priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331); 
        priceFeed = AggregatorV3Interface(proxy); 
    }

    /**
     * 為替情報を取得するための関数
     */
    function getLatestPrice() public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;
    }
}