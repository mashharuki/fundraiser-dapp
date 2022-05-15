/**
 * 所有しているNFTを管理する画面のコンポーネントファイル
 */

// 必要なモジュールを読み込む
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import Web3 from 'web3';
import NFTContract from './../contracts/NFT.json';
import detectEthereumProvider from '@metamask/detect-provider';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import UseStyles from "../common/useStyles";
// Cardコンポーネントを読み込む
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import superAgent from 'superagent';
// APIサーバーのURL
const baseUrl = process.env.REACT_APP_API_SERVER_URL;

/**
 * Collectionコンポーネント本体
 */
const Collection = () => {
      // ステート変数を用意する。
      const [ contract, setContract ] = useState (null);
      const [ account, setAccount ] = useState (null);
      const [ ethWeb3, setEthWeb3 ] = useState(null);
      const [ nftName, setNftName ] = useState(null);
      const [ totalSupply, setTotalSupply ] = useState(null);
      const [ metaDatas, setMetaDatas ] = useState([]);
      const [ nftAddress , setNftAddress ] = useState(null);
      // スタイル用のクラス
      const classes = UseStyles();
      const location = useLocation();
      let nft  = "";
      let web3Account = "";
      let NFTname = "";
      let newTokenId = 0;
 
      /**
       * 副作用フック
       */
      useEffect (() => {
            console.log("location:", location);
            // 引数から値を取得する。
            nft  = location.state.nft;
            web3Account = location.state.accounts;
            NFTname = location.state.nftName;
            newTokenId = location.state.newTokenId;
            setAccount(web3Account);
            setNftName(NFTname);
            // setTotalSupply(newTokenId);
            init(nft);    
      }, []);

      // アカウントが切り替わったら画面を更新する。
      window.ethereum.on('accountsChanged', function (accounts) {
            window.location.reload()
      });

      /**
       * init関数(コンポーネントを初期化する。)
       */
      const init = async(nft) => {
            try {
                  // NFTコントラクトの情報を取得する。
                  const NFT = nft;
                  // Web3が使えるように設定する。
                  const provider = await detectEthereumProvider();
                  const web3 = new Web3(provider);
                  const networkId = await web3.eth.net.getId();
                  // コントラクトを読み込む                
                  const instance = new web3.eth.Contract(NFTContract.abi, NFT);
                  setContract(instance);
                  setEthWeb3(web3); 
                  const total = await instance.methods.totalSupply().call();
                  console.log("totalSupply:", total);

                  for(let i = 1; i <= total; i++) {
                        try {
                              const metaData = await instance.methods.getMetaData(i - 1).call();
                              // base64でエンコードされているためデコードする。
                              let jsonData = await base64Decode(metaData);
                              // JSONをJavaScriptオブジェクトに変換する。
                              var jObject = JSON.parse(jsonData);
                              console.log("jObject:", jObject);
                              setMetaDatas([...metaDatas, jObject]);
                        } catch (error) {
                              console.log("このトークンIDのデータは存在しません。:", error);
                        }
                  }
            } catch (error) {
                  alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
                  console.log(error);
            }
      }

      /**
       * Base64をデコードするための関数
       * @param {*} text base64でエンコードされたデータ
       * @returns エンコード前の文字列(ここではJDON形式のデータを想定)
       */
      function base64Decode(text) {
            return fetch(text).then(response => response.text());
      }

      return (
            <div className={classes.main_container}>
                  <h2>
                        {nftName}
                  </h2>
                  <Box sx={{ flexGrow: 1 }}>
                        <Grid
                              container
                              spacing={{ xs: 2, md: 3 }}
                              columns={{ xs: 4, sm: 4, md: 12 }}
                        >
                              {metaDatas.map((metaData, i) => (
                                    <div key={i}>
                                          <Card variant="outlined" className={classes.card}>
                                                <CardContent>
                                                      <Typography color="text.secondary" gutterBottom>
                                                            {metaData.name} # {i}
                                                      </Typography>
                                                      <CardMedia
                                                            component="img"
                                                            className={classes.cardMedia}
                                                            image={metaData.URL}
                                                            title="NFT Image"
                                                      />
                                                      <Typography variant="body2">
                                                            {metaData.description}
                                                      </Typography>
                                                </CardContent>
                                          </Card>
                                    </div>
                              ))}
                        </Grid>
                  </Box>
            </div>
      );
}

export default Collection;