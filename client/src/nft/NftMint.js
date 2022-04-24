/**
 * NFTを発行するコンポーネントファイル
 */

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; 
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import UseStyles from "./../common/useStyles";
import Web3 from 'web3';
import NFTContract from '../contracts/NFT.json';
import detectEthereumProvider from '@metamask/detect-provider';
import superAgent from 'superagent';
// APIサーバーのURL
const baseUrl = process.env.REACT_APP_API_SERVER_URL;

/**
 * NftMintコンポーネント
 * @param {*} props NFTコントラクト
 */
const NftMint = (props) => {
      // ステート変数
      const [ name, setName ] = useState(null);
      const [ description, setDescription ] = useState(null);
      const [ url, setUrl ] = useState(null);
      const [ to, setTo ] = useState(null);
      const [ nftAddress , setNftAddress ] = useState(null);
      const [ contract, setContract ] = useState(null);
      const [ account, setAccount ] = useState(null);
      const [ hasMintRole, setHasMintRole ] = useState(false);
      const [ chainId, setChainId ] = useState(null);
      const [ tokenId, setTokenId ] = useState(null);
      // スタイルシートを使うための変数
      const classes = UseStyles();
      const location = useLocation();
      let nft  = "";
      let web3Account = "";
      let mintFlg = "";
      let networkId = "";
      let newTokenId = "";
 
      /**
       * 副作用フック
       */
      useEffect(() => {
            let unmounted = true
            if (unmounted) {
                  console.log("location:", location);
                  // 引数から値を取得する。
                  nft  = location.state.nft;
                  web3Account = location.state.accounts;
                  mintFlg = location.state.mintFlg;
                  networkId = location.state.networkId;
                  newTokenId = location.state.newTokenId;
                  setNftAddress(nft);
                  setAccount(web3Account);
                  setHasMintRole(mintFlg);
                  setChainId(networkId);
                  setTokenId(newTokenId);
            }
            return () => {
                  unmounted = false;
            }
      }, [location]);

      /**
       * アカウントが切り替わったら画面を更新する。
       */
      window.ethereum.on('accountsChanged', function (accounts) {
            window.location.reload()
      });

      /**
       * 「NFT発行」ボタンを押した時の処理
       */
      const buttonMint = async () => {
            // mint関数とinsert関数を実行する。
            Promise.all([mint, insert])
                  .then((result) => {
                       console.log("NFT発行処理が正常に成功！")
                  })
                  .catch((result) => {
                        console.log("NFT発行処理中にエラーが発生")
                        console.error("error:", result);
                  });
      }

      /**
       * NFT発行を実行する関数
       */
      const mint = async () => {
            try {
                  // Mintする権限があるかどうかチェックする。
                  if (hasMintRole){
                        // Web3が使えるように設定する。
                        const provider = await detectEthereumProvider();
                        const web3 = new Web3(provider);
                        const accounts = await web3.eth.getAccounts();
                        const instance = new web3.eth.Contract(NFTContract.abi, nftAddress);
                        // NFTコントラクトのmintNft関数を実行する。
                        await instance.methods.mintNft(to, name, description, url).send({ 
                              from: accounts[0],
                              gas: 650000
                        });
                        alert("NFT発行成功！");
                  } else {
                        alert("あなたには、このNFT発行する権限がありません。");
                  }
            } catch (e) {
                  console.log(e);
                  alert("mint NFT failed");
            }
      }

      /**
       * NFT発行情報をDBに挿入するための関数
       */
      const insert = async () => {
            // API用のパラメータ変数
            const params = { 
                  owner: to,
                  tokenId: tokenId,
                  chainId: chainId,
            };

            // 登録用のAPIを呼び出す。
            superAgent
                  .get(baseUrl + '/api/input')
                  .query(params) 
                  .end((err, res) => {
                  if (err) {
                        console.log("DB登録API実行中にエラー発生", err)
                        return err;
                  }
                  console.log("DB登録処理成功！：", res);
                  });
      }

      return (
            <div className="main-container">
                  <h2>
                        NFT発行ページ
                  </h2>
                  <TextField 
                        id="to" 
                        className={classes.textField} 
                        placeholder="To" 
                        margin="normal" 
                        onChange={ (e) => setTo(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                  />
                  <TextField 
                        id="name" 
                        className={classes.textField} 
                        placeholder="NFT Name" 
                        margin="normal" 
                        onChange={ (e) => setName(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                  />
                  <TextField 
                        id="description" 
                        className={classes.textField} 
                        placeholder="NFT description" 
                        margin="normal" 
                        onChange={ (e) => setDescription(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                  />
                  <TextField 
                        id="url" 
                        lassName={classes.textField} 
                        placeholder="NFT URL" 
                        margin="normal" 
                        onChange={ (e) => setUrl(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                  />
                  <br/>
                  <Button onClick={buttonMint} variant="contained" color="secondary" className={classes.button}>
                        NFT新規発行
                  </Button>
            </div>
      );
}
   
export default NftMint;