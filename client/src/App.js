import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Link } from "react-router-dom";
import FundraiserFactoryContract from "./contracts/FundraiserFactory.json";
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
import MyToken from "./mytoken/MyToken";
import CreateSafeContractWallet from "./wallet/CreateSafeContractWallet";
import WalletSetUp from "./wallet/WalletSetUp";
import ExecTransaction from "./wallet/ExecTransaction";
import GetTxHash from "./wallet/GetTxHash";
import Collection from "./nft/Collection";
// material-ui関連をインポートする。
import AppBar  from '@mui/material/AppBar';
import Toolbar  from '@mui/material/Toolbar';
import Typography  from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// Menu用の配列
const options = [
  'Home',
  'New',
  'CreateSafeWallet',
  'Sign',
  'Ecrecover',
  'Nft',
  'Collection',
  'MyToken',
];
// Menuコンポーネント用の定数
const ITEM_HEIGHT = 48;

/**
 * Appコンポーネント
 */
const App = () => {
  // ステート変数を用意する。　
  const [ state, setState ] = useState({ web3: null, accounts: null, contract: null  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  // メニュー用の変数
  const open = Boolean(anchorEl);
  // スタイルシートを適用するためのコンポーネント読み込み
  const classes = UseStyles();

  /**
   * 副作用フック
   */
  useEffect (() => {

    /**
     * init関数
     */
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

  /**
   * メニューアイコンをクリックした時の処理
   * @param {*} event イベントハンドラ
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * メニューバーを閉じる時の処理
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  // レンダリングする内容
  return (
    <Router>
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Toolbar className={classes.toolbar}>
            <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
              <strong>Web3.0 App</strong>
            </Typography>
            <Typography variant="h6" color="inherit">
              <IconButton 
                aria-label="more"
                id="home-menu-button"
                aria-controls={open ? 'home-menu-button' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="web3.0-menu"
                MenuListProps={{
                  'aria-labelledby': 'home-menu-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '20ch',
                  },
                }}
              >
                {options.map((option) => (
                  <MenuItem key={option} selected={option === 'Home'} onClick={handleClose}>
                    <NavLink className={classes.navLink} to={{ pathname: `/${option}` }}>{option}</NavLink>
                  </MenuItem>
                ))}
            </Menu>
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
          <Route path="/myToken" element={ <MyToken/> } />
          <Route path="/walletSetUp" element={ <WalletSetUp/> } />
          <Route path="/execTransaction" element={ <ExecTransaction/> } />
          <Route path="/getTxHash" element={ <GetTxHash/> } />
          <Route path="/collection" element={ <Collection/> } />
        </Routes>
      </div>
    </Router>
  );
}

// コンポーネントを外部に公開
export default App;
