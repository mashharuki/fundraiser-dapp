/**
 * Webサーバー用の設定ファイル
 */

// Webサーバーの起動
const express = require('express');
const app = express();
// ポート番号
const portNo = 3001;

// 起動
app.listen(portNo, () => {
      console.log('起動しました', `http://localhost:${portNo}`)
});

// 静的ファイルを自動的に返すようルーティングする。
app.use('/', express.static('./../client/build'));
app.use('/new/', express.static('./../client/build'));
app.use('/createSafeWallet', express.static('./../client/build'));
app.use('/receipts', express.static('./../client/build'));
app.use('/sign/', express.static('./../client/build'));
app.use('/ecrecover/', express.static('./../client/build'));
app.use('/nft/', express.static('./../client/build'));
app.use('/walletSetUp', express.static('./../client/build'));
app.use('/execTransaction', express.static('./../client/build'));
app.use('/getTxHash', express.static('./../client/build'));
