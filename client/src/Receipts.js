import React, { useState, useEffect } from "react";

// Receiptsコンポーネントを用意する。
const Receipts = (props) => {
    // ステート変数を用意する。
    const [ donation, setDonation ] = useState(null);
    const [ fundName, setFundName ] = useState(null);
    const [ date, setDate ] = useState(null);
    // useEffect関数
    useEffect(() => {
        const { donation, date, fund } = props.location.state;
        // 日付の書式を設定する。
        const formattedDate = new Date(parseInt(date * 1000));
        // ステート変数をセットする。
        setDonation(donation);
        setDate(formattedDate.toString());
        setFundName(fund);
    }, []);

    return (
        <div className="receipt-container">
            <div className="receipt-header">
                <h3>
                    Thank you for your donation to {fundName}
                </h3>
            </div>
            <div className="receipt-info">
                <div>
                    Date of Donation: {date}
                </div>
                <div>
                    Donation Value: ${donation}
                </div>
            </div>
        </div>
    );
}

export default Receipts;