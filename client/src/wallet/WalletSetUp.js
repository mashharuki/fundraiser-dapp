/**
 * マルチシグウォレット初期設定用コンポーネント
 */

// 必要なコンポーネントをインポートする。
import React, { useState, useEffect } from "react";

/**
 * WalletSetUpコンポーネント
 */
const WalletSetUp = () => {
    // 戻り値
    return (
        <div className="walletSetUp-container">
            <div className="walletSetUp-header">
                <h3>
                    This is a SetUp page.
                </h3>
            </div>
            <div className="walletSetUp-info">
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
export default WalletSetUp;