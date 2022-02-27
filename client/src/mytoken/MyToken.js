/**
 * ERC20トークンを新しく生成するための画面のコンポーネントファイル
 */

// 必要なモジュールをインポートする。
import '../App.css';
import React, { useState, useEffect } from "react";
import MyTokenFactoryContract from '../contracts/MyTokenFactory.json';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Select, MenuItem } from '@material-ui/core';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@material-ui/core/TextField';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

// Decimal選択肢用の配列
const Decimals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

// useStyles関数
const useStyles = makeStyles (theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    button: {
        margin: theme.spacing(1),
    },
})); 

/**
 * MyTokenコンポーネント
 */
const MyToken = () => {
      // ステート変数を用意
      const [ name, setName ] = useState (null);
      const [ symbol, setSymbol ] = useState (null);
      const [ decimal, setDecimal ] = useState (null);
      const [ contract, setContract ] = useState (null);
      const [ accounts, setAccounts ] = useState (null);
      const [ netID, setNetID ] = useState (null);
      const [ ethWeb3, setEthWeb3 ] = useState(null);
      // スタイル用のクラス
      const classes = useStyles();
  
      /**
       * useEffect関数 
       */ 
      useEffect (() => {
          init();
      }, []);

      /**
       * init関数
       */
      const init = async() => {
            try {
                  // Web3が使えるように設定する。
                  const provider = await detectEthereumProvider();
                  const web3 = new Web3(provider);
                  const networkId = await web3.eth.net.getId();
                  const deployedNetwork = MyTokenFactoryContract.networks[networkId];
                  const web3Accounts = await web3.eth.getAccounts();
                  const instance = new web3.eth.Contract(MyTokenFactoryContract.abi, deployedNetwork && deployedNetwork.address,);
                  // Web3を設定する。
                  setEthWeb3(web3);
                  // コントラクトをセットする。
                  setContract(instance);
                  // アカウントをセットする。
                  setAccounts(web3Accounts);
                  // ネットワークIDをセットする。
                  setNetID(networkId);
              } catch (error) {
                  alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
                  console.error(error);
              }
      };

      /**
       * buttonDeploy関数
       */
      const buttonDeploy = async() => {
            try {
                  // コントラクトをデプロイする。
                  await contract.methods.createMyToken(name, symbol, decimal).send({ 
                      from: accounts[0],
                      gas: 6500000
                  });
                  alert("MyTokenコントラクトデプロイ成功！");
              } catch (e) {
                  alert("MyTokenコントラクトデプロイ失敗");
                  console.error(e);
              }
      };

      return (
            <div className="main-container">
                  <h2>
                        独自ERC20トークン作成画面
                  </h2>
                  <TextField 
                        id="name" 
                        className={classes.textField} 
                        placeholder="Token Name" 
                        margin="normal" 
                        onChange={ (e) => setName(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                        required={true}
                  />
                  <TextField 
                        id="symbol" 
                        className={classes.textField} 
                        placeholder="Token Symbol" 
                        margin="normal" 
                        onChange={ (e) => setSymbol(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                        required={true}
                        />
                  <FormControl sx={{ width: 300 }}>
                        <InputLabel id="token-Decimal">Token Decimal</InputLabel>
                        <Select
                            labelId="decimal"
                            id="decimal"
                            value={decimal}
                            label="Token Decimal"
                            input={<OutlinedInput id="select-decimlal" label="token-Decimal" />}
                            onChange={(e) => { setDecimal(e.target.value) }}
                        >
                            { Decimals.map((item, index) => (
                                <MenuItem key={index} value={item}>{item}</MenuItem>
                            ))}
                        </Select>
                  </FormControl>
                  <br/>
                  <Button onClick={buttonDeploy} variant="contained" color="primary" className={classes.button}>
                        MyTokenデプロイ
                  </Button>
                  <br/>
            </div>
      );
};

export default MyToken;
  