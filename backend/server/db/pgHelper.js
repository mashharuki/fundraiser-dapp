/**
 * DB接続用のモジュール
 */

/**
 * DB接続＆SQL実行関数
 * @param {*} database 接続先DB
 * @param {*} query SQL文
 * @param {*} values パラメータ
 * @param {*} callback コールバック関数
 */
 const execute = function (database, query, values, callback) {

      const { Client } = require('pg');
      // 設定ファイルの読み込み
      const ConfigFile = require('config');
      console.log("接続先DBのIPアドレス：", ConfigFile.config.db_host);
      // DB接続用の初期設定
      const client = new Client({
          user: ConfigFile.config.db_user,
          host: ConfigFile.config.db_host,
          database: database,
          password: ConfigFile.config.db_password,
          port: ConfigFile.config.db_port,
      });
      
      client.connect();
  
      console.log('SQL文：', query);
      console.log('パラメータの中身：', values);
  
      // パラメータの変数の有無で処理を分岐する。
      if (typeof values === "undefined") {
          client.query(query)
              .then((res) => {
                  callback(null, res)
              })
              .catch((e) => {
                  callback(e.stack, null);
              }).finally( () => {
                  client.end();
              });
      } else {
          client.query(query, values)
              .then((res) => {
                  callback(null, res)
              })
              .catch((e) => {          
                  callback(e.stack, null);
              }).finally( () => {
                  client.end();
              });
      }
  }
  
  module.exports = { execute };