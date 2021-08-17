pragma solidity >= 0.5.13;

// 送金用コントラクト
contract DumbTransfer {
    // 送金用関数
    // @_to 送金先アドレス
    function transfer(address payable _to) public payable {
        //@msg.value 送金額
        _to.transfer(msg.value);
    }
}