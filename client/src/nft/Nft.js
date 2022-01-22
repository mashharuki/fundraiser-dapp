/**
 * NFTコンポーネントファイル
 */

// 必要なモジュールをインポートする。
import '../App.css';
import React, { useState, useEffect } from "react";
import NFTFactoryContract from '../contracts/NFTFactory.json';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import getWeb3 from '../getWeb3';

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

// Nftコンポーネントを用意する。
const Nft = () => {
    // ステート変数を用意
    const [ name, setName ] = useState (null);
    const [ symbol, setSymbol ] = useState (null);
    const [ url, setUrl ] = useState (null);
    const [ contract, setContract ] = useState (null);
    const [ accounts, setAccounts ] = useState (null);
    const [ address, setAddress ] = useState (null);
    const [ netID, setNetID ] = useState (null);
    const [ web3, setWeb3 ] = useState(null);
    const [ tokenId , setTokenId] = useState(null);
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
            const deployedNetwork = NFTFactoryContract.networks[networkId];
            const accounts = await web3.eth.getAccounts();
            const instance = new web3.eth.Contract(NFTFactoryContract.abi, deployedNetwork && deployedNetwork.address,);
            // Web3を設定する。
            setWeb3(web3);
            // コントラクトをセットする。
            setContract(instance);
            // アカウントをセットする。
            setAccounts(accounts);
            // ネットワークIDをセットする。
            setNetID(networkId);
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
            console.error(error);
        }
    }

    /**
     * 「NFTデプロイ」ボタンを押した時の処理
     */
    const buttonDeploy = async() => {
        // NFTコントラクトの情報を読み取る
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = NFTFactoryContract.networks[networkId];
        const instance = new web3.eth.Contract(NFTFactoryContract.abi, deployedNetwork && deployedNetwork.address,);
        console.log(accounts[0])
        // コントラクトをデプロイする。
        await instance.methods.createNFT(name, symbol, url).send({ 
            from: accounts[0],
            gas: 65000
        });
    } 
  
    // 戻り値を設定する。
    return (
        <div className="main-container">
            <h2>
                NFT用トップページ
            </h2>
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
                id="symbol" 
                className={classes.textField} 
                placeholder="NFT Symbol" 
                margin="normal" 
                onChange={ (e) => setSymbol(e.target.value) } 
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
            <Button onClick={buttonDeploy} variant="contained" color="primary" className={classes.button}>
                NFTデプロイ
            </Button>
            <br/>
        </div>
    );
}

// コンポーネントを外部に公開する。
export default Nft;