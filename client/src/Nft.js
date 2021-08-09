/**
 * NFTコンポーネントファイル
 */

// 必要なモジュールをインポートする。
import './App.css';
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import NFTContract from './contracts/NFT.json';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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
    const [ contract, setContract ] = useState (null);
    const [ accounts, setAccounts ] = useState (null);
    const [ address, setAddress ] = useState (null);
    // スタイル用のクラス
    const classes = useStyles();

    // useEffect関数
    useEffect (() => {
        init();
    }, []);

    // init関数
    const init = async() => {
        try {
            // Web3が使えるように設定する。
            const provider = await detectEthereumProvider();
            const web3 = new Web3(provider);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = NFTContract.networks[networkId];
            const accounts = await web3.eth.getAccounts();
            const instance = new web3.eth.Contract(NFTContract.abi, deployedNetwork && deployedNetwork.address,);
            // コントラクトをセットする。
            setContract (instance);
            // アカウントをセットする。
            setAccounts (accounts);
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
            console.error(error);
        }
    }

    /**
     * 「NFTデプロイ」ボタンを押した時の処理
     */
    const buttonDeploy = async() => {
        // プロバイダーから署名者の情報を取得する。
        const signer = provider.getSigner();
        // コントラクト用のファクトリーを生成
        const factory = new ethers.ContractFactory(abi,bytecode,signer);
        // コントラクトをデプロイする。
        const contract = await factory.deploy();
        // deployしたアドレスを取得する。
        address = contract.address;
        // addressをセットする。
        setAddress(address);
        alert(contract);
        alert("コントラクトアドレス：", address);
        // ネットワーク情報を取得する。
        const net = await signer.provider.getNetwork();
        // rinkebyだった場合出力する。
        if( net.chainId == 4) {
            alert("https://rinkeby.etherscan.io/tx/" + contract.deployTransaction.hash);
        }
    } 
  
    /**
     * 「NFT名取得」ボタンを押した時の処理
     */
    const buttonGetName = async() => {
        // コントラクト用のファクトリーを生成
        const contract = new ethers.Contract(address, abi, provider);
        // NFT名とアドレスを出力する。
        alert("NFT名：", await contract.name());
        alert("コントラクトアドレス：", address);
    }
  
    /**
     * 「NFT発行」ボタンを押した時の処理
     */
    const buttonMint = async() => {
        // プロバイダーから署名者の情報を取得する。
        const signer = provider.getSigner();
        // コントラクト用の変数を生成する。
        const contract = new ethers.Contract(address, abi, provider);
        // NFTコントラクトのmint関数を実行する。
        const { hash } = await contract.connect(signer).mint(signer.getAddress());
        alert(contract);
        alert("コントラクトアドレス：", address);
        // ネットワーク情報を取得する。
        const net = await signer.provider.getNetwork();
        // rinkebyだった場合出力する。
        if( net.chainId == 4) {
            alert("https://rinkeby.etherscan.io/tx/" + hash);
        }
    }
  
    /**
     * 「NFT総供給量」ボタンを押した時の処理
     */
    const buttonSupply = async() => {
        // コントラクト用の変数を生成する。
        const contract = new ethers.Contract(address, abi, provider);
        // アドレスを出力する。
        alert("コントラクトアドレス：", address);
        // totalSupply関数を呼び出す。
        alert("総供給量：", await contract.totalSupply());
    }
  
    // 戻り値を設定する。
    return (
        <div className="main-container">
            <p>NFT用トップページ</p>
            <Button onClick={buttonDeploy} variant="contained" color="primary" className={classes.button}>NFTデプロイ</Button><br/>
            <Button onClick={buttonGetName} variant="contained" color="primary" className={classes.button}>NFT名取得</Button><br/>
            <Button onClick={buttonMint} variant="contained" color="primary" className={classes.button}>NFT発行</Button><br/>
            <Button onClick={buttonSupply} variant="contained" color="primary" className={classes.button}>NFT総供給量</Button>
        </div>
    );
}

// コンポーネントを外部に公開する。
export default Nft;