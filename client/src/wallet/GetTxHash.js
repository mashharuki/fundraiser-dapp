/**
 * トランザクションハッシュ値取得コンポーネント
 */

// 必要なコンポーネントをインポートする。
import React, { useState, useEffect } from "react";

/**
 * GetTxHashコンポーネント
 */
 const GetTxHash = () => {
    // 戻り値
    return (
        <div className="getTxHash-container">
            <div className="getTxHash-header">
                <h3>
                    This is a GetTxHash page.
                </h3>
            </div>
            <div className="getTxHash-info">
                <div>
                    test
                </div>
                <div>
                    test
                </div>
            </div>
        </div>
    );
}

// コンポーネントを外部に公開する。
export default GetTxHash;