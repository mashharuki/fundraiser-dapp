import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import getWeb3 from "./getWeb3";
import "./App.css";
import UseStyles from "./common/useStyles";
// 各ページ用のコンポーネントを読み込む
import NewFundraiser from './fundraiser/NewFundraiser';
import Home from "./Home";
import Receipts from './fundraiser/Receipts';
import Sign from "./wallet/Sign";
import Ecrecover from "./wallet/Ecrecover";
import Nft from "./nft/Nft";
import NftMint from "./nft/NftMint";
import MyToken from "./mytoken/MyToken";
import CreateSafeContractWallet from "./wallet/CreateSafeContractWallet";
import WalletSetUp from "./wallet/WalletSetUp";
import ExecTransaction from "./wallet/ExecTransaction";
import GetTxHash from "./wallet/GetTxHash";
import Collection from "./nft/Collection";
import Web3Menu from "./common/Web3Menu";
import Swap from "./swap/Swap";
import CreatePool from "./swap/CreatePool";
import FundraiserFactoryContract from "./contracts/FundraiserFactory.json";
// material-ui関連をインポートする。
import AppBar  from '@mui/material/AppBar';
import Toolbar  from '@mui/material/Toolbar';
import Typography  from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';

/**
 * Appコンポーネント
 */
const App = () => {
  // ステート変数を用意する。　
  const [ state, setState ] = useState({ web3: null, accounts: null, contract: null  });
  // スタイルシートを適用するためのコンポーネント読み込み
  const classes = UseStyles();

  /**
   * 副作用フック
   */
  useEffect (() => {
    let isMounted = true
    init();
    return () => {
      isMounted = false
    }
  }, []);

  /**
   * init関数
   * @param isMounted マウント状態を表すフラグ
   */
  const init = async (isMounted) => {
    try {
      // 変数を設定
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      // デプロイ済みネットワークを取得する。
      const deployedNetwork = FundraiserFactoryContract.networks[networkId];
      // コントラクトのインスタンスを生成する。
      const instance = new web3.eth.Contract (FundraiserFactoryContract.abi, deployedNetwork && deployedNetwork.address);
      // ステート変数を設定する。
      if (isMounted) { 
        setState ({ web3, accounts, contract: instance });
      }
    } catch (error) {
      // アラートを出す。
      alert (`App.js: Failed to load web3, accounts, or contract. Check console for details.`,);
      // アラート内容を出力する。
      console.error (error);
    }
  } 

  // レンダリングする内容
  return (
    <>
      <GlobalStyles styles={{ body: { margin: 0, padding: 0 } }} />
      <Router>
        <div className={classes.root}>
          <AppBar position="static" color="default">
            <Toolbar className={classes.toolbar}>
              <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
                <strong>Web3.0 App</strong>
              </Typography>
              <Typography variant="h6" color="inherit">
                <Web3Menu/>
              </Typography>
            </Toolbar>
          </AppBar>
          <Routes>
            <Route path="/" exact element={ <Home/> } />
            <Route path="/home" exact element={ <Home/> } />
            <Route path="/new" element={ <NewFundraiser/> } />
            <Route path="/createSafeWallet" element={ <CreateSafeContractWallet/>} />
            <Route path="/receipts" element={ <Receipts/> } />
            <Route path="/sign" element={ <Sign/> } />
            <Route path="/ecrecover" element={ <Ecrecover/> } />
            <Route path="/nft" element={ <Nft/> } />
            <Route path="/nftMint" element={ <NftMint/> } />
            <Route path="/myToken" element={ <MyToken/> } />
            <Route path="/walletSetUp" element={ <WalletSetUp/> } />
            <Route path="/execTransaction" element={ <ExecTransaction/> } />
            <Route path="/getTxHash" element={ <GetTxHash/> } />
            <Route path="/collection" element={ <Collection/> } />
            <Route path="/swap" element={ <Swap/> } />
            <Route path="/createPool" element={ <CreatePool/> } />
          </Routes>
        </div>
      </Router>
    </>
  );
}

// コンポーネントを外部に公開
export default App;
