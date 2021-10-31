/**
 * オラクル処理用のサンプルコード
 */

pragma solidity >= 0.8.7;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {

    // AggregatorV3Interface型のオブジェクト
    AggregatorV3Interface internal priceFeed;
    // 取得したい為替レート、実行環境毎に自分で指定する。
    address proxy;

    /**
     * コンストラクター
     * Aggregator: proxyで指定する。
     * Address: デプロイ時に指定する。
     */
    constructor(address _proxy) {
        proxy = _proxy;
        priceFeed = AggregatorV3Interface(proxy); 
    }

    /**
     * 為替情報を取得するための関数
     */
    function getLatestPrice() public view returns (int) {
        // priceFeedのlatestRoundData関数を呼び出して情報を取得する。
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