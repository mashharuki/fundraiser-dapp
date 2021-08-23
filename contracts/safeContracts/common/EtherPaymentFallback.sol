/**
 * 資産を入金するためのコントラクト
 */

pragma solidity >=0.7.0 <0.9.0;

/**
 * EtherPaymentFallbackコントラクト
 * @title EtherPaymentFallback - A contract that has a fallback to accept ether payments
 * @author Richard Meissner - <richard@gnosis.pm>
 */
contract EtherPaymentFallback {
    // 入金したときのイベント定義
    event SafeReceived(address indexed sender, uint256 value);

    /**
     * フォールバック関数
     */
    receive() external payable {
        // イベントの発行
        emit SafeReceived(msg.sender, msg.value);
    }
}