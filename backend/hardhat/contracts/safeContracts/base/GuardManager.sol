/**
 * Guardを管理するためのコントラクト
 */

pragma solidity >=0.7.0 <0.9.0;
// インポートする。
import "../common/Enum.sol";
import "../common/SelfAuthorized.sol";
import "../interfaces/IERC165.sol";

/**
 * Guardコントラクト
 * IERC165を継承 
 */
interface Guard is IERC165 {

    /**
     * トランザクションをチェックする関数 
     */
    function checkTransaction(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address payable refundReceiver,
        bytes memory signatures,
        address msgSender
    ) external;

    /**
     * トランザクション実行御の結果を確認する関数
     */
    function checkAfterExecution(bytes32 txHash, bool success) external;
}

/**
 * BaseGuardコントラクト
 * Guradコントラクトを継承する。
 */
abstract contract BaseGuard is Guard {

    /**
     * インターフェースをサポートするための関数
     */
    function supportsInterface(bytes4 interfaceId) external view virtual override returns (bool) {
        return
            interfaceId == type(Guard).interfaceId || // 0xe6d7a83a
            interfaceId == type(IERC165).interfaceId; // 0x01ffc9a7
    }
}


/**
 * GuardManager コントラクト
 * @title Fallback Manager - A contract that manages fallback calls made to this contract
 * @author Richard Meissner - <richard@gnosis.pm>
 */
contract GuardManager is SelfAuthorized {
    // イベントの定義
    event ChangedGuard(address guard);
    // keccak256("guard_manager.guard.address")
    bytes32 internal constant GUARD_STORAGE_SLOT = 0x4a204f620c8c5ccdca3fd54d003badd85ba500436a431f0cbda4f558c93c34c8;

    /**
     * Guardのアドレスを設定する関数
     * @dev Set a guard that checks transactions before execution
     * @param guard The address of the guard to be used or the 0 address to disable the guard
     */
    function setGuard(address guard) external authorized {
        if (guard != address(0)) {
            require(Guard(guard).supportsInterface(type(Guard).interfaceId), "GS300");
        }
        bytes32 slot = GUARD_STORAGE_SLOT;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            sstore(slot, guard)
        }
        emit ChangedGuard(guard);
    }

    /**
     * Guardのアドレスを取得するための関数
     */
    function getGuard() internal view returns (address guard) {
        bytes32 slot = GUARD_STORAGE_SLOT;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            guard := sload(slot)
        }
    }
}