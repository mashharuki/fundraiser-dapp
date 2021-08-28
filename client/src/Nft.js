/**
 * NFTコンポーネントファイル
 */

// 必要なモジュールをインポートする。
import './App.css';
import React, { useState, useEffect } from "react";
import NFTFactoryContract from './contracts/NFTFactory.json';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import getWeb3 from './getWeb3';

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
        // コントラクトをデプロイする。
        await instance.methods.createNFT(name, symbol, url).send({ from: accounts[0] });
        // ネットワーク情報を取得する。
        const net = NFTFactoryContract.networks[netID];
        // rinkebyだった場合出力する。
        if( net.chainId == 4) {
            alert("https://rinkeby.etherscan.io/tx/" + instance.deployTransaction.hash);
        }
    } 
  
    /**
     * 「NFT名取得」ボタンを押した時の処理
     */
    const buttonGetName = async() => {
        // コントラクト
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = NFTFactoryContract.networks[networkId];
        const instance = new web3.eth.Contract(NFTFactoryContract.abi, deployedNetwork && deployedNetwork.address,);
        // 名前とシンボル名を取得する。
        const name = await instance.methods.name().call();
        const symbol = await instance.methods.symbol().call();
        // NFT名とアドレスを出力する。
        alert("NFT名：", name);
        alert("シンボル名：", symbol);
    }
  
    /**
     * 「NFT発行」ボタンを押した時の処理
     */
    const buttonMint = async() => {
        // プロバイダーから署名者の情報を取得する。
        const signer = accounts[0];
        // コントラクト
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = NFTFactoryContract.networks[networkId];
        const instance = new web3.eth.Contract(NFTFactoryContract.abi, deployedNetwork && deployedNetwork.address,);
        // NFTコントラクトのmint関数を実行する。
        const { hash } = await instance.methods.mint(signer).send({ from: signer });
        // ネットワーク情報を取得する。
        const net = NFTFactoryContract.networks[netID];
        // rinkebyだった場合出力する。
        if( net.chainId == 4) {
            alert("https://rinkeby.etherscan.io/tx/" + hash);
        }
    }
  
    /**
     * 「NFT総供給量取得」ボタンを押した時の処理
     */
    const buttonSupply = async() => {
        // コントラクト
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = NFTFactoryContract.networks[networkId];
        const instance = new web3.eth.Contract(NFTFactoryContract.abi, deployedNetwork && deployedNetwork.address,);
        // 総供給量を取得する。
        const totalSupply = await instance.methods.totalSupply().call();
        // totalSupply関数を呼び出す。
        alert("総供給量：", totalSupply);
    }

    /**
     * 「NFT数取得」ボタンを押した時の処理
     */
    const buttonBalanceOf = async() => {
        // コントラクト
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = NFTFactoryContract.networks[networkId];
        const instance = new web3.eth.Contract(NFTFactoryContract.abi, deployedNetwork && deployedNetwork.address,);
        // 接続中のアカウントに紐づくNFT数を取得する
        const balanceOf = await instance.methods.balanceOf(accounts[0]).call();
        // totalSupply関数を呼び出す。
        alert("NFT数：", balanceOf);
    }

    /**
     *  「所有者確認」ボタンを押した時の処理
     */
    const buttonOwnerOf = async() => {
        // コントラクト
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = NFTFactoryContract.networks[networkId];
        const instance = new web3.eth.Contract(NFTFactoryContract.abi, deployedNetwork && deployedNetwork.address,);
        // 所有者アドレスを取得する。
        const ownerAddress = await instance.methods.ownerOf(tokenId).call();
        alert("所有者アドレス：", ownerAddress);
    }
  
    // 戻り値を設定する。
    return (
        <div className="main-container">
            <h2>
                NFT用トップページ
            </h2>
            <TextField id="outlined-bare" className={classes.textField} placeholder="NFT Name" margin="normal" onChange={ (e) => setName(e.target.value) } variant="outlined" inputProps={{ 'aria-label': 'bare' }} />
            <TextField id="outlined-bare2" className={classes.textField} placeholder="NFT Symbol" margin="normal" onChange={ (e) => setSymbol(e.target.value) } variant="outlined" inputProps={{ 'aria-label': 'bare' }} />
            <TextField id="outlined-bare3" className={classes.textField} placeholder="NFT URL" margin="normal" onChange={ (e) => setUrl(e.target.value) } variant="outlined" inputProps={{ 'aria-label': 'bare' }} />
            <Button onClick={buttonDeploy} variant="contained" color="primary" className={classes.button}>NFTデプロイ</Button><br/>
            <Button onClick={buttonGetName} variant="contained" color="primary" className={classes.button}>NFT名取得</Button><br/>
            <Button onClick={buttonMint} variant="contained" color="primary" className={classes.button}>NFT発行</Button><br/>
            <Button onClick={buttonBalanceOf} variant="contained" color="primary" className={classes.button}>NFT数取得</Button><br/>
            <Button onClick={buttonSupply} variant="contained" color="primary" className={classes.button}>NFT総供給量取得</Button>
            <TextField id="outlined-bare4" className={classes.textField} placeholder="TokenId" margin="normal" onChange={ (e) => setTokenId(e.target.value) } variant="outlined" inputProps={{ 'aria-label': 'bare' }} />
            <Button onClick={buttonOwnerOf} variant="contained" color="primary" className={classes.button}>所有者確認</Button>
        </div>
    );
}

// コンポーネントを外部に公開する。
export default Nft;