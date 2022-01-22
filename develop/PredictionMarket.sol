// 市場予測スマートコントラクト
// コンパイラーバージョンを指定
pragma solidity >= 0.4.15;

contract PredictionMarket {
    // 注文種類を表す列挙型変数を定義
    enum OrderType { Buy, Sell }
    // 市場の決定を表す列挙型変数を定義
    enum Result { Open, Yes, No }
    // 構造体Orderを定義
    struct Order {
        address user;
        OrderType orderType;
        uint amount;
        uint price;
    }
    // トランザクション手数料の分子
    uint public constant TX_FEE_NUMERATOR = 1;
    // トランザクション手数料の分母
    uint public constant TX_FEE_DENOMINATOR = 500;
    
    // コントラクト所有者
    address public owner;
    // コントラクトの結果
    Result public result;
    // 市場取引可能期限
    uint public deadline;
    // 注文IDの割り当てに利用するカウンター
    uint public counter;
    // 担保額
    uint public collateral;
    // 注文IDとその注文内容
    mapping(uint => Order) public orders;
    // ユーザーが保持する株数を表すマップ変数
    mapping(address => uint) public shares;
    // コントラクトの内部台帳を表すマップ変数
    mapping(address => uint) public balances;
    // 各種イベントを定義
    // 注文が追加された時のイベント
    event OrderPlaced(uint orderId, address user, OrderType orderType, uint amount, uint price);
    // 取引が成立した時のイベント
    event TradeMatched(uint orderId, address user, uint amount);
    // 注文がキャンセルされた時のイベント
    event OrderCanceled(uint orderId);
    // 残高を引き出した時のイベント
    event Payout(address user, uint amount);

    // コンストラクター
    // duration：期間
    function PredictionMarket (uint duration) public payable {
        // 0イーサ以上であることをチェックする。
        require(msg.value > 0);
        // コントラクト作成者のアドレスを格納する。
        owner = msg.sender;
         //期限を設定する。
        deadline =  block.timestamp + duration;
        // 持株数を設定する。
        shares[msg.sender] = msg.value / 100;
        collateral = msg.value;
    }

    // 買い注文の発注用関数
    // price：株価
    function orderBuy (uint price) public payable {
        // 注文の前に条件を満たしているかチェックする。
        require(block.timestamp < deadline);
        require(msg.value > 0);
        require(price >= 0);
        require(price <= 100);
        // 注文する株数を決定する。
        uint amount = msg.value / price;
        // 注文IDを増加させる。
        counter++;
        // 注文台帳に情報を追記する。
        orders[counter] = Order(msg.sender, OrderType.Buy, amount, price);
        // イベントを呼び出す。
        OrderPlaced(counter, msg.sender, OrderType.Buy, amount, price);
    }

    // 売り注文の発注用関数
    // price：株価
    // amount：持株数
    function orderSell (uint price, uint amount) public {
        // 注文の前に条件を満たしているかチェックする。
        require(block.timestamp < deadline);
        // 現在持っている株数以下であることをチェックする。
        require(shares[msg.sender] >= amount);
        require(price >= 0);
        require(price <= 100);
        // 持株数を減らす。
        shares[msg.sender] -= amount;
        // 注文IDを増加させる。
        counter++;
        // 注文台帳に追加する。
        orders[counter] = Order(msg.sender, OrderType.Sell, amount, price);
        // イベントを呼び出す。
        OrderPlaced(counter, msg.sender, OrderType.Sell, amount, price);
    }

    // 買い注文に応じた売り用の関数
    // orderId：注文ID
    function tradeBuy (uint orderId) public payable {
        // 注文台帳のデータを引っ張ってくる。
        Order storage order = orders[orderId];

        require(block.timestamp < deadline);
        require(order.user != msg.sender); 
        require(order.orderType == OrderType.Sell);
        require(order.amount > 0);
        require(msg.value > 0);
        require(msg.value <= order.amount * order.price);
        // 株数を格納する。
        uint amount = msg.value / order.price;
        // 買い手と売り手の手数料を算出する。
        uint fee = (amount * order.price) * TX_FEE_NUMERATOR / TX_FEE_DENOMINATOR;
        uint feeShares = amount * TX_FEE_NUMERATOR / TX_FEE_DENOMINATOR;
        // 売り手は持株数が減る、買い手は増える。
        shares[msg.sender] += (amount - feeShares);
        shares[owner] += feeShares;
        // 売り手はイーサを受け取り、買い手は持株数を増やす。
        balances[order.user] += (amount * order.price) - fee;
        balances[owner] += fee;
        // 持株数が引かれる。
        order.amount -= amount;
        // 未約定株が残っていない場合は注文台帳を削除する。
        if (order.amount == 0) 
            delete orders[orderId];
        // イベントの呼び出し
        TradeMatched(orderId, msg.sender, amount);
    }

    // 売り注文に応じた買い用の関数
    // orderId：注文ID
    // amount：持株数
    function tradeSell (uint orderId, uint amount) public {
        // 注文台帳のデータを引っ張ってくる。
        Order storage order = orders[orderId];

        require(block.timestamp < deadline);
        // 自分自身の売り注文には応じられないようにする。
        require(order.user != msg.sender); 
        require(order.orderType == OrderType.Buy);
        require(order.amount > 0);
        require(amount <= order.amount);
        require(shares[msg.sender] >= amount);
        // 買い手と売り手の手数料を算出する。
        uint fee = (amount * order.price) * TX_FEE_NUMERATOR / TX_FEE_DENOMINATOR;
        uint feeShares = amount * TX_FEE_NUMERATOR / TX_FEE_DENOMINATOR;

        shares[msg.sender] -= amount;
        shares[order.user] += (amount - feeShares);
        shares[owner] += feeShares;

        balances[msg.sender] += (amount * order.price) - fee;
        balances[owner] += fee;
        // 持株数が引かれる。
        order.amount -= amount;
        // 未約定株が残っていない場合は注文台帳を削除する。
        if (order.amount == 0) 
            delete orders[orderId];
        // イベントの呼び出し
        TradeMatched(orderId, msg.sender, amount);
    }

    // 注文をキャンセルするための関数
    // orderId：注文ID
    function cancelOrder (uint orderId) public {
        // 注文台帳のデータを引っ張ってくる。
        Order storage order = orders[orderId];
        // 注文した本人であることをチェックする。
        require(order.user == msg.sender);
        // 買いをキャンセルする場合は残高を、売りをキャンセルする場合は持株数を元に戻す。
        if (order.orderType == OrderType.Buy)
            balances[msg.sender] += order.amount * order.price;
        else
            shares[msg.sender] += order.amount;
        // 注文台帳から削除する。
        delete orders[orderId];
        // イベントの呼び出し
        OrderCanceled(orderId);
    }

    // 市場を決定する関数
    // _result：結果
    function resolve (bool _result) public {
        require(block.timestamp > deadline);
        // コントラクトの作成者であること
        require(msg.sender == owner);
        // 取引中であること
        require(result == Result.Open);
        // 市場の結果をコントラクトにアップロードする。(オラクル処理)
        result = _result ? Result.Yes : Result.No;
        // 複数オラクル処理を実装する(予定)
        // Noの場合は担保額がコントラクト作成者の残高に加算される。
        if (result == Result.No)
            balances[owner] += collateral;
    }

    // 引き出し関数
    function withdraw () public {
        // 払い出し額
        uint payout = balances[msg.sender];
        // 内部台帳の残高を0にする。
        balances[msg.sender] = 0;
        // 取引結果がYESであれば払い出し額を設定する。
        if (result == Result.Yes) {
            payout += shares[msg.sender] * 100;
            // 持株を0にする。
            shares[msg.sender] = 0;
        }
        // イーサを送金する。
        msg.sender.transfer(payout);
        // Payoutイベントを呼び出す。
        Payout(msg.sender, payout);
    }

}