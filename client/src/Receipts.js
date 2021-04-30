import React, { useState, useEffect } from "react";

// Receiptsコンポーネントを用意する。
const Receipts = (props) => {
    // useEffect関数
    useEffect(() => {
        const { donation, date, fund } = props.location.state;
        debugger
    }, []);

    return (
        <div>
            <h1>
                Receipts
            </h1>
        </div>
    );
}

export default Receipts;