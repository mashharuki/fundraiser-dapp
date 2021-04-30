import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import FundraiserFactoryContract from "./contracts/FundraiserFactory.json";
import getWeb3 from "./getWeb3";
import "./App.css";
// コンポーネントを読み込む
import NewFundraiser from './NewFundraiser';
import Home from "./Home";
import Receipts from './Receipts';
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
    }
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

  return (
    <Router>
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              <NavLink to="/">Home</NavLink>
            </Typography>
            <NavLink to="/new">New</NavLink>
          </Toolbar>
        </AppBar>
        <Route path="/" exact component={Home} />
        <Route path="/new/" exact component={NewFundraiser} />
        <Route path="/receipts" component={Receipts} />
      </div>
    </Router>
  );
}

// コンポーネントを外部に公開
export default App;
