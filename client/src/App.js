import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import FundraiserFactoryContract from "./contracts/FundraiserFactory.json";
import getWeb3 from "./getWeb3";
import "./App.css";
// 各ページ用のコンポーネントを読み込む
import NewFundraiser from './fundraiser/NewFundraiser';
import Home from "./Home";
import Receipts from './fundraiser/Receipts';
import Sign from "./wallet/Sign";
import Ecrecover from "./wallet/Ecrecover";
import Nft from "./nft/Nft";
import CreateSafeContractWallet from "./wallet/CreateSafeContractWallet";
import WalletSetUp from "./wallet/WalletSetUp";
import ExecTransaction from "./wallet/ExecTransaction";
import GetTxHash from "./wallet/GetTxHash";
// material-ui関連をインポートする。
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// コンポーネントを用意する。
const App = () => {
  // ステート変数を用意する。　
  const [state, setState] = useState({ web3: null, accounts: null, contract: null  });
  // スタイルを使うための定数
  const useStyles = makeStyles (theme => ({
    root: {
      flexGrow: 1
    },
    navLink: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  }));

  const classes = useStyles();

  // useeffect関数
  useEffect (() => {
    const init = async () => {
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
        setState ({ web3, accounts, contract: instance });
      } catch (error) {
        // アラートを出す。
        alert (`App.js: Failed to load web3, accounts, or contract. Check console for details.`,);
        // アラート内容を出力する。
        console.error (error);
      }
    } 
    init();
  }, []);

  // runExample関数
  const runExample = async() => {
    const { accounts, contract } = state;
  };

  // レンダリングする内容
  return (
    <Router>
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              <NavLink className={classes.navLink} to="/">Home</NavLink>
              <NavLink className={classes.navLink} to="/new">New</NavLink>
              <NavLink className={classes.navLink} to="/createSafeWallet">CreateSafeWallet</NavLink>
              <NavLink className={classes.navLink} to="/sign">Sign</NavLink>
              <NavLink className={classes.navLink} to="/ecrecover">Ecrecover</NavLink>
              <NavLink className={classes.navLink} to="/nft">Nft</NavLink>
            </Typography>
          </Toolbar>
        </AppBar>
        <Route path="/" exact component={Home} />
        <Route path="/new/" component={NewFundraiser} />
        <Route path="/createSafeWallet" component={CreateSafeContractWallet} />
        <Route path="/receipts" component={Receipts} />
        <Route path="/sign/" component={Sign} />
        <Route path="/ecrecover/" component={Ecrecover} />
        <Route path="/nft/" component={Nft} />
        <Route path="/walletSetUp" component={WalletSetUp} />
        <Route path="/execTransaction" component={ExecTransaction} />
        <Route path="/getTxHash" component={GetTxHash} />
      </div>
    </Router>
  );
}

// コンポーネントを外部に公開
export default App;
