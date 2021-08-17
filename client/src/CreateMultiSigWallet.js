/**
 * マルチシグウォレット生成コンポーネントファイル
 */

// 必要なモジュールをインポートする。
import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import detectEthereumProvider from '@metamask/detect-provider';
import getWeb3 from './getWeb3';
import MultiSigFactoryContract from './contracts/MultiSigFactory.json';
import Web3 from 'web3'

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
const CreateMultiSigWallet = () => {
    // 各種ステート変数を定義する。
    const [labelWidth, setLabelWidth] = React.useState(0);
    const labelRef = React.useRef(null);
    const [ web3, setWeb3 ] = useState(null);
    const [ networkId, setNetworkId ] = useState(null);
    const [ threshold, setThreshold ] = useState(null);
    const [ owner, setOwner ] = useState(null);
    const [ owners, setOwners ] = useState([]);
    const [ contract, setContract] = useState(null);
    const [ accounts, setAccounts ] = useState(null);
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
            const deployedNetwork = MultiSigFactoryContract.networks[networkId];
            const accounts = await web3.eth.getAccounts();
            const instance = new web3.eth.Contract(MultiSigFactoryContract.abi, deployedNetwork && deployedNetwork.address,);
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

    /**
     *  handleSubmit関数
     */
    const handleSubmit = async () => {
        try {
            // コントラクトのcreateMultiSig関数を呼び出す。
            await contract.methods.createMultiSig(threshold, owners, networkId).send({ from: accounts[0] });
            // アラートを出す。
            alert('Successfully created MultiSigWallet');
        } catch (error) {
            alert(`Failed to create MultiSigWallet.`,);
            console.error(error);
        }
    };

    /**
     * +ボタンが押された時の処理
     */
    const addAddress = async () => {
        // 配列にアドレスを追加する。
        owners.push(owner);
        alert(owners);
        // ステート変数を更新する。
        setOwners(owners);
        setOwner('');
    };

    // 戻り値
    return (
        <div className="main-container">
            <h2>
                Create a New MutiSigWallet
            </h2>
            <label>Threshold</label>
            <TextField id="outlined-bare" className={classes.textField} placeholder="Threshold" margin="normal" onChange={ (e) => setThreshold(e.target.value) } variant="outlined" inputProps={{ 'aria-label': 'bare' }} />
            <Button onClick={addAddress} variant="contained" color="info" className={classes.button}> + </Button>
            <label>Owners's addresses</label>
            <TextField id="outlined-bare" className={classes.textField} placeholder="Owners's addresses" margin="normal" onChange={ (e) => setOwner(e.target.value) } variant="outlined" inputProps={{ 'aria-label': 'bare' }} />
            {(
                () => { if(owners.length >= 1) {
                    return (
                        <p>Current Owners's address</p>
                    );
                }}
            )}
            {owners.map((ownerAddress, index) => {
                return (
                    <div key={index}>
                        <input type='text' value={ownerAddress} name='owneraddress' disabled="disabled"/>
                    </div>
                );
            })}
            <Button onClick={handleSubmit} variant="contained" className={classes.button}>create!</Button>
        </div>
    );
}

// CreateMultiSigWalletコンポーネントを外部に公開します。
export default CreateMultiSigWallet;