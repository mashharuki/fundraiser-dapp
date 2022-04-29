/**
 * Webサーバー用の設定ファイル
 */

// Webサーバーの起動
const express = require('express');
const fs = require('fs');
var log4js = require('log4js');
const app = express();
// ポート番号
const portNo = 3001;
// DB接続用のモジュールを読みこむ
const pgHelper = require('./server/db/pgHelper');
// 設定ファイルの読み込み
const ConfigFile = require('config');
// データベースを指定
const database = ConfigFile.config.db_name;

// log4jsの設定
log4js.configure('./server/log/log4js_setting.json');
const logger = log4js.getLogger("server");

// HTTPS通信に対応するための設定
const server = require('https').createServer({
      key: fs.readFileSync('./server/tls/privatekey.pem'),
      cert: fs.readFileSync('./server/tls/cert.pem'),
}, app);

// 起動
server.listen(portNo, () => {
      logger.debug('起動しました', `https://localhost:${portNo}`)
});

/**
 * NFTの情報をDBから取得するためのAPI
 * @param リクエストパラメータ1 所有者のアドレス
 * @param リクエストパラメータ2 チェーンID
 */
app.get('/api/getTokenIds', (req, res) => {
      // パラメータから値を取得する。
      let owner = req.query.owner;
      let chainId = req.query.chainId;
      let contract = req.query.contract;
      // 実行するSQL
      const query = 'select ni.tokenid from nft.nftinfo ni where ni."owner"  = $1 and ni."chainid" = $2 and ni."contract" = $3';
      // パラメータ用の配列を作成する。
      const values = [ owner, chainId, contract ];
      // DBの実行
      pgHelper.execute(database, query, values, (err, docs) => {
            if (err) {
                  logger.error(err.toString());
                  res.status(501).send("DB接続中にエラーが発生しました");
                  return;
            }
            logger.debug('tokenIds:', docs.rows);
            res.json({ tokenIds: docs.rows });
      });
});

/**
 * NFTのowner情報を変更するためのAPI
 * @param リクエストパラメータ1 更新後の所有者のアドレス
 * @param リクエストパラメータ2 更新前の所有者のアドレス
 * @param リクエストパラメータ3 トークンID
 * @param リクエストパラメータ4 チェーンID
 * @param リクエストパラメータ5 コントラクトのアドレス
 */
app.post('/api/update', (req, res) => {
      // パラメータから値を取得する。
      let receipt = req.query.receipt;
      let owner = req.query.owner;
      let tokenId = req.query.tokenId;
      let chainId = req.query.chainId;
      let contract = req.query.contract;
      // 実行するSQL
      const query = 'update nft.nftinfo set owner = $1 where owner = $2 and tokenid = $3 and chainid = $4 and contract = $5';
      // パラメータ用の配列を作成する。
      const values = [ receipt, owner, tokenId, chainId, contract ];
      // DBの実行
      pgHelper.execute(database, query, values, (err, docs) => {
            if (err) {
                  logger.error(err.toString());
                  res.status(501).send("DB接続中にエラーが発生しました");
                  return;
            }
            logger.debug('DB情報の更新が完了しました。');
      });
});

/**
 * NFTの情報をDBに格納するためのAPI
 * @param リクエストパラメータ1 所有者のアドレス
 * @param リクエストパラメータ2 トークンID
 * @param リクエストパラメータ3 チェーンID
 * @param リクエストパラメータ4 コントラクトのアドレス
 */
app.post('/api/input', (req, res) => {
      // パラメータから値を取得する。
      let owner = req.query.owner;
      let tokenId = req.query.tokenId;
      let chainId = req.query.chainId;
      let contract = req.query.contract;
      // 実行するSQL
      const query = 'insert into nft.nftinfo(owner, tokenid , chainid, contract) VALUES ($1, $2, $3, $4)';
      // パラメータ用の配列を作成する。
      const values = [ owner, tokenId, chainId, contract ];
      // DBの実行
      pgHelper.execute(database, query, values, (err, docs) => {
            if (err) {
                  logger.error(err.toString());
                  res.status(501).send("DB接続中にエラーが発生しました");
                  return;
            }
            logger.debug('DB情報の新規登録が完了しました。');
      });
});

/**
 * NFTの情報をDBから削除するためのAPI
 * @param リクエストパラメータ1 所有者のアドレス
 * @param リクエストパラメータ2 トークンID
 * @param リクエストパラメータ3 チェーンID
 * @param リクエストパラメータ4 コントラクトのアドレス
 */
 app.post('/api/delete', (req, res) => {
      // パラメータから値を取得する。
      let owner = req.query.owner;
      let tokenId = req.query.tokenId;
      let chainId = req.query.chainId;
      let contract = req.query.contract;
      // 実行するSQL
      const query = 'delete from nft.nftinfo ni where ni."owner"  = $1 and ni."contract" = $2 and ni."chainid" = $3 and ni."tokenid" = $4';
      // パラメータ用の配列を作成する。
      const values = [ owner, contract, chainId, tokenId];
      // DBの実行
      pgHelper.execute(database, query, values, (err, docs) => {
            if (err) {
                  logger.error(err.toString());
                  res.status(501).send("DB接続中にエラーが発生しました");
                  return;
            }
            logger.debug('DB情報の削除が完了しました。');
      });
});


// 静的ファイルを自動的に返すようルーティングする。
app.use('/', express.static('./../client/build'));
app.use('/new', express.static('./../client/build'));
app.use('/createSafeWallet', express.static('./../client/build'));
app.use('/receipts', express.static('./../client/build'));
app.use('/sign', express.static('./../client/build'));
app.use('/ecrecover', express.static('./../client/build'));
app.use('/nft', express.static('./../client/build'));
app.use('/walletSetUp', express.static('./../client/build'));
app.use('/execTransaction', express.static('./../client/build'));
app.use('/getTxHash', express.static('./../client/build'));
app.use('/collection', express.static('./../client/build'));

