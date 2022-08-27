/**
 * 列挙型Enum用のコントラクト
 */

pragma solidity >=0.7.0 <0.9.0;

/**
 * Enumコントラクト
 * @title Enum - Collection of enums
 * @author Richard Meissner - <richard@gnosis.pm>
 */
contract Enum {
    // 列挙型変数Operationを定義
    enum Operation {Call, DelegateCall}
}