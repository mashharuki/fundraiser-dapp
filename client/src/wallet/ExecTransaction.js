/**
 * トランザクション実行コンポーネント
 */

// 必要なコンポーネントをインポートする。
import React, { useState, useEffect } from "react";

/**
 * ExecTransactionコンポーネント
 */
 const ExecTransaction = () => {
    // 戻り値
    return (
        <div className="execTransaction-container">
            <div className="execTransaction-header">
                <h3>
                    This is a ExecTransaction page.
                </h3>
            </div>
            <div className="execTransaction-info">
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
export default ExecTransaction;