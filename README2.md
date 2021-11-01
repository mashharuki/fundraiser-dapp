# オラクル処理について
  外部の信頼できる情報リソースからブロックチェーン上にデータを取り込む仕組み。    
  一度取り込んだデータについては後から変更することができないため、  
  いかにして信頼できるリソースを確保するかが重要となる。

## ChainLinkが公表しているスマートコントラクトを利用する。
   各環境毎にデプロイされているproxyコントラクトのアドレス一覧は下記の通り。  
   ここから自分が欲しい為替情報を抜き取ること。  
   <a href="https://docs.chain.link/docs/ethereum-addresses/">proxyアドレス一覧</a>  

### chainlinkのモジュールをインストールするコマンド
  `npm i @chainlink/contracts`

### LINKトークンのテストネット用のFaucetサイト
   <a href="https://faucets.chain.link/kovan">Faucet</a>

## Chainlink VRF Contract Addresses一覧
   <a href="https://docs.chain.link/docs/vrf-contracts/">こちら(自分の環境に合ったものを選ぶこと)</a>

## ソースコード一例(ChainLinkのチュートリアルより)

<code>

    pragma solidity >= 0.8.7;
    import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

    contract PriceConsumerV3 {

        AggregatorV3Interface internal priceFeed;

        /**
        * コンストラクター
        * Network: Kovan
        * Aggregator: ETH/USD
        * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
        */
        constructor() {
            priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
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
</code>


## AggregatorV3Interfaceのソースコード

<code>
   
    pragma solidity ^0.8.0; 

    interface AggregatorV3Interface {
        function decimals() external view returns (uint8);

        function description() external view returns (string memory);

        function version() external view returns (uint256);

        // getRoundData and latestRoundData should both raise "No data present"
        // if they do not have data to report, instead of returning unset values
        // which could be misinterpreted as actual reported values.
        function getRoundData(uint80 _roundId) external view returns(
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
            );

        function latestRoundData() external view returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
            );
        }
</code>