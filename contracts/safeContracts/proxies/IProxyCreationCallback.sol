/**
 * コールバック関数用のインターフェースコントラクト
 */

pragma solidity >=0.7.0 <0.9.0;

import "./GnosisSafeProxy.sol";

/**
 * インターフェースを定義する。
 */
interface IProxyCreationCallback {
    function proxyCreated(
        GnosisSafeProxy proxy,
        address _singleton,
        bytes calldata initializer,
        uint256 saltNonce
    ) external;
}