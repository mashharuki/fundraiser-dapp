/**
 * マルチシグウォレット生成コンポーネントファイル
 */

// 必要なモジュールをインポートする。
import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import detectEthereumProvider from '@metamask/detect-provider';
import getWeb3 from '../getWeb3';
import SafeContractFactoryContract from '../contracts/SafeContractFactory.json';
import GnosisSafeProxyFactoryContract from '../contracts/GnosisSafeProxyFactory.json';
import Web3 from 'web3';

// useStyles関数
const useStyles = makeStyles (theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(1),
    },
})); 

/**
 * コンポーネントを定義する。
 */
const CreateSafeContractWallet = () => {
    // 各種ステート変数を定義する。
    const [ web3, setWeb3 ] = useState(null);
    const [ networkId, setNetworkId ] = useState(null);
    const [ contract, setContract] = useState(null);
    const [ accounts, setAccounts ] = useState(null);
    const [ walletName, setWalletName ] = useState(null);
    const [ message, setMessage ] = useState(null);
    const [ data, setData ] = useState(null);
    // スタイルクラス用の変数を定義する。
    const classes = useStyles();

    // useEffect関数
    useEffect (() => {
        init();
    }, []);

    /**
     * 初期化関数
     */
    const init = async() => {
        try {
            // Web3が使えるように設定する。
            const provider = await detectEthereumProvider();
            const web3 = new Web3(provider);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = GnosisSafeProxyFactoryContract.networks[networkId];
            const accounts = await web3.eth.getAccounts();
            const instance = new web3.eth.Contract(GnosisSafeProxyFactoryContract.abi, deployedNetwork && deployedNetwork.address,);
            // Web3を設定する。
            setWeb3(web3);
            // コントラクトをセットする。
            setContract(instance);
            // アカウントをセットする。
            setAccounts(accounts);
            // ネットワークIDをセットする。
            setNetworkId(networkId);
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
            console.error(error);
        }
    }

    // アカウントが切り替わったら画面を更新する。
    window.ethereum.on('accountsChanged', function (accounts) {
        window.location.reload()
    });

    /**
     *  handleSubmit関数
     */
    const handleSubmit = async () => {
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const networkId = await web3.eth.net.getId()
        const deployedNetwork = GnosisSafeProxyFactoryContract.networks[networkId];
        const deployedNetwork2 = SafeContractFactoryContract.networks[networkId];
        const instance = new web3.eth.Contract(GnosisSafeProxyFactoryContract.abi, deployedNetwork && deployedNetwork.address,);
        const instance2 = new web3.eth.Contract(SafeContractFactoryContract.abi, deployedNetwork2 && deployedNetwork2.address,);
        // Messageを32バイトデータに変換する。
        const data = string2hexs(message);

        try {
            // コントラクトのcreateSafeContract関数を呼び出し、まずはロジックコントラクトを作成する。 
            const safeContract = await instance2.methods.createSafeContract(walletName).send({
                from: accounts[0],
                gas: 650000
            });
            // proxyコントラクトを作成する。
            const proxy = await instance.methods.createProxy(safeContract.to, data).send({
                from: accounts[0],
                gas: 650000
            });
            // アラートを出す。
            alert('Successfully created SafeContractWallet');
        } catch (error) {
            alert(`Failed to create SafeContractWallet.`,);
            console.error(error);
        }
    };

    /**
     * 文字列を16進数の文字列に変換する関数
     */
    function string2hexs (text) {
        var bytes = text.split('').map(char => char.charCodeAt(0));
        var hexs = bytes.map(byte => byte.toString(16));
        var hex = hexs.join('');
        var result = "0x" + hex;
        console.log(result);
        return result;
    }

    // 描画する内容
    return (
        <div className="main-container">
            <h2>
                Create a New MutiSigWallet
            </h2>
            <label>Wallet Name</label>
            <TextField 
                id="walletName" 
                className={classes.textField} 
                placeholder="Wallet Name" 
                margin="normal" 
                onChange={ (e) => setWalletName(e.target.value) } 
                variant="outlined" 
                inputProps={{ 'aria-label': 'bare' }} />
            <label>Message</label>
            <TextField 
                id="message" 
                className={classes.textField} 
                placeholder="address of Safe owner" 
                margin="normal" 
                onChange={ (e) => setMessage(e.target.value) } 
                variant="outlined" 
                inputProps={{ 'aria-label': 'bare' }} 
            />
            <Button onClick={handleSubmit} variant="contained" className={classes.button}>
                create!
            </Button>
        </div>
    );
}

// CreateSafeContractWalletコンポーネントを外部に公開します。
export default CreateSafeContractWallet;