/**
 * 権限周りのコントラクト
 */

pragma solidity >=0.7.0 <0.9.0;

/**
 * SelfAuthorizedコントラクト
 * @title SelfAuthorized - authorizes current contract to perform actions
 * @author Richard Meissner - <richard@gnosis.pm>
 */
contract SelfAuthorized {

    /**
     * コントラクトの所有者であるか確認するための関数
     */
    function requireSelfCall() private view {
        require(msg.sender == address(this), "GS031");
    }

    /**
     * 修飾子の定義
     */
    modifier authorized() {
        // This is a function call as it minimized the bytecode size
        requireSelfCall();
        _;
    }
}