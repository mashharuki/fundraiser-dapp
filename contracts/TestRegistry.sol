pragma solidity >0.4.23;

// This contract is only used for testing purposes.
contract TestRegistry {
  // アドレスと残高を紐づけるマップ変数
  mapping(address => uint) public registry;

  // 登録処理関数
  function register(uint x) payable public {
    // コントラクト呼び出し元アドレスとxを紐づける。
    registry[msg.sender] = x;
  }

}
