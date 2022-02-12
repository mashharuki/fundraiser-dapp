/**
 * Webサーバー用の設定ファイル
 */

// Webサーバーの起動
const express = require('express');
const fs = require('fs');
const app = express();
// ポート番号
const portNo = 3001;

// HTTPS通信に対応するための設定
const server = require('https').createServer({
      key: fs.readFileSync('./server/tls/privatekey.pem'),
      cert: fs.readFileSync('./server/tls/cert.pem'),
  }, app);

// 起動
server.listen(portNo, () => {
      console.log('起動しました', `https://localhost:${portNo}`)
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
