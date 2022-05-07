/**
 * NFTとトークンIDを個別に描画するためのコンポーネント
 */

// 必要なモジュールを読み込む
import React, { useState, useEffect } from "react";
import UseStyles from "./../common/useStyles";
import Web3 from 'web3';
import NFTContract from './../contracts/NFT.json';
import detectEthereumProvider from '@metamask/detect-provider';
// Cardコンポーネントを読み込む
import Card  from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import superAgent from 'superagent';
// APIサーバーのURL
const baseUrl = process.env.REACT_APP_API_SERVER_URL;

/**
 * CollectionCardコンポーネント
 * @param {*} props 引数(NFTコントラクト)
 */
const CollectionCard = (props) => {
      // 引数から値を取得する。
      const { nft } = props;
      // スタイル用のクラス
      const classes = UseStyles();
      // ステート変数を用意する。
      const [ contract, setContract] = useState(null);
      const [ owners, setOwners ] = useState([]);
      const [ totalSupply, setTotalSupply ] = useState(null);
      const [ metaDatas, setMetaDatas ] = useState([]);

      /**
       * useEffect関数
       */
      useEffect (() => {
            // nftが存在する時のみ実行
            if (nft) {
                  init(nft);
            }
      }, [nft]);

      /**
       * コンポーネントを初期化するための関数
       * @param nft NFTコントラクト
       */
      const init = async (nft) => {
            try {
                  // NFTコントラクトの情報を取得する。
                  const NFT = nft;
                  // Web3が使えるように設定する。
                  const provider = await detectEthereumProvider();
                  const web3 = new Web3(provider);
                  const accounts = await web3.eth.getAccounts(); 
                  const networkId = await web3.eth.net.getId();
                  const instance = new web3.eth.Contract(NFTContract.abi, NFT);
                  // コントラクトをセットする。
                  setContract(instance);
                  // NFTの発行総数を取得する。
                  const total = await instance.methods.totalSupply().call();
                  // ステート変数に値を詰める。
                  setTotalSupply(total);

                  // API用のパラメータ変数
                  const params = { 
                        owner: accounts[0],
                        chainId: networkId,
                        contract: NFT,
                  };

                  // 登録用のAPIを呼び出す。
                  // let res = await superAgent.get(baseUrl + '/api/getTokenIds').query(params);
                  // let tokenIds = res.body.tokenIds;
                  // console.log("tokenIds:", tokenIds);

                  // 発行数が1以上の場合のみ実行
                  if (total > 0) {
                        // 所有者アドレスとメタデータの配列を作成する。
                        for(let i = 1; i <= totalSupply; i++) {
                              try {
                                    // トークンIDごとのOwnerアドレスを取得する。
                                    let address = await instance.methods.ownerOf(i - 1).call();
                                    setOwners([...owners, address]);
                                    // トークンIDごとのメタデータを取得する。
                                    let metaData = await instance.methods.getMetaData(i - 1).call();
                                    // base64でエンコードされているためデコードする。
                                    let jsonData = await base64Decode(metaData);
                                    // JSONをJavaScriptオブジェクトに変換する。
                                    var jObject = JSON.parse(jsonData);
                                    console.log("jObject:", jObject);
                                    setMetaDatas([...metaDatas, jObject]);
                              } catch (e) {
                                    console.error("このIDに紐づく所有者は見つかりませんでした。", e);
                              }
                        }
                  };
            } catch (error) {
                  alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
                  console.error(error);
            }
      }

      /**
       * アカウントが切り替わったら画面を更新する。
       */
      window.ethereum.on('accountsChanged', function (accounts) {
            window.location.reload()
      });

      /**
       * Base64をデコードするための関数
       * @param {*} text base64でエンコードされたデータ
       * @returns エンコード前の文字列(ここではJDON形式のデータを想定)
       */
      function base64Decode(text) {
            return fetch(text).then(response => response.text());
      }

      /**
       * トークンIDに紐づく所有者アドレスを取得して設定する関数
       * @param instance NFTコントラクト
       * @param id トークンID
       */
      const getAddress = async (instance, id) => {
            try {
                  // トークンIDごとのOwnerアドレスを取得する。
                  let address = await instance.methods.ownerOf(id).call();
                  setOwners([...owners, address]);
            } catch (e) {
                  console.error("このIDに紐づく所有者は見つかりませんでした。", e);
            }
      }

      /**
       * トークンIDに紐づくメタデータを取得して設定する関数
       * @param instance NFTコントラクト
       * @param id トークンID
       */
      const getMetaData = async (instance, id) => {
            try {
                  // トークンIDごとのメタデータを取得する。
                  let metaData = await instance.methods.getMetaData(id).call();
                  // base64でエンコードされているためデコードする。
                  let jsonData = await base64Decode(metaData);
                  // JSONをJavaScriptオブジェクトに変換する。
                  var jObject = JSON.parse(jsonData);
                  console.log("jObject:", jObject);
                  setMetaDatas([...metaDatas, jObject]);
            } catch (e) {
                  console.error("このIDに紐づくメタデータは見つかりませんでした。", e);
            }
      }
  
      return (
            <div>
                  {console.log("metaDatas:", metaDatas)}
                  {metaDatas.map((metaData, i) => (
                        <Card className={classes.card} variant="outlined" key={i}>
                              <CardActionArea>
                                    { metaData.URL ? ( <CardMedia className={classes.media} image={metaData.URL} title="NFT Image"/> ) : (<></>) }
                                    <CardContent>
                                          <Typography gutterBottom variant="h5" component="h2">
                                                {metaData.name}
                                          </Typography>
                                          <Typography variant="body2" color="textSecondary" component="div">
                                                <p>
                                                      owner：{owners[i]}
                                                </p>
                                          </Typography>
                                          <Typography variant="body2" color="textSecondary" component="div">
                                                <p>
                                                      description：{metaData.description}
                                                </p>
                                          </Typography>
                                    </CardContent>
                              </CardActionArea>
                        </Card>
                  ))}
            </div>
      );
}

export default CollectionCard;