import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import detectEthereumProvider from '@metamask/detect-provider';
import SimpleMultiSigContract from './contracts/SimpleMultiSig.json';
import Web3 from "web3";

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

// コンポーネントを用意する。
const Sign = () => {
    // ステート変数を用意
    const [ web3, setWeb3 ] = useState(null);
    const classes = useStyles();
    const [ walletAddress, setWalletAddress ] = useState(null);
    const [ destination, setDestination ] = useState(null);
    const [ value, setValue ] = useState(null);
    const [ data, setData ] = useState(null);
    const [ nonce, setNonce ] = useState(null);
    const [ executor, setExecutor ] = useState(null);
    const [ gasLimit, setGasLimit ] = useState(null);
    const [ contract, setContract] = useState(null);
    const [ accounts, setAccounts ] = useState(null);
    const [sigR, setSigR ] = useState([]);
    const [sigS, setSigS ] = useState([]);
    const [sigV, setSigV ] = useState([]);

    // コンポーネントを用意する。
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
            const deployedNetwork = SimpleMultiSigContract.networks[networkId];
            const accounts = await web3.eth.getAccounts();
            const instance = new web3.eth.Contract(SimpleMultiSigContract.abi, deployedNetwork && deployedNetwork.address,);
            // Web3を設定する。
            setWeb3(web3);
            // コントラクトをセットする。
            setContract(instance);
            // アカウントをセットする。
            setAccounts(accounts);
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
            console.error(error);
        }
    }

    // handleSign関数(署名実行)
    const handleSign = async () => {
        // コントラクトのexecuteを呼び出す。
        await contract.methods.execute(sigV, sigR, sigS, destination, value, data, executor, gasLimit).send({ from: accounts[0] });
        // アラートを出す。
        alert('Successfully signed data')
    }

    // 署名内容を解析するための関数
    // signature：書名済みデータ
    function parseSignature(signature) {
        // 0~64番目を変数rに格納する
        var r = signature.substring(0, 64);
        // 64~128番目を変数sに格納する
        var s = signature.substring(64, 128);
        // 128~130番目を変数vに格納する
        var v = signature.substring(128, 130);
        // 戻り値を返す。
        return {
            r: "0x" + r,
            s: "0x" + s,
            v: parseInt(v, 16)
        }
    }

    // 戻り値
    return (
        <div className="main-container">
            <h2>
                Sign Page
            </h2>
            <label>Wallet address</label>
            <TextField id="outlined-bare" className={classes.textField} placeholder="Wallet address" margin="normal" onChange={ (e) => setWalletAddress(e.target.value) } variant="outlined" inputProps={{ 'aria-label': 'bare' }} />
            <label>Destination</label>
            <TextField id="outlined-bare" className={classes.textField} placeholder="Destination" margin="normal" onChange={ (e) => setDestination(e.target.value) } variant="outlined" inputProps={{ 'aria-label': 'bare' }} />
            <label>Value</label>
            <TextField id="outlined-bare" className={classes.textField} placeholder="Value" margin="normal" onChange={ (e) => setValue(e.target.value) } variant="outlined" inputProps={{ 'aria-label': 'bare' }} />
            <label>Data</label>
            <TextField id="outlined-bare" className={classes.textField} placeholder="Data" margin="normal" onChange={ (e) => setData(e.target.value) } variant="outlined" inputProps={{ 'aria-label': 'bare' }} />
            <label>Nonce</label>
            <TextField id="outlined-bare" className={classes.textField} placeholder="Nonce" margin="normal" onChange={ (e) => setNonce(e.target.value) } variant="outlined" inputProps={{ 'aria-label': 'bare' }} />
            <label>Executor</label>
            <TextField id="outlined-bare" className={classes.textField} placeholder="Executor" margin="normal" onChange={ (e) => setExecutor(e.target.value) } variant="outlined" inputProps={{ 'aria-label': 'bare' }} />
            <label>GasLimit</label>
            <TextField id="outlined-bare" className={classes.textField} placeholder="GasLimit" margin="normal" onChange={ (e) => setGasLimit(e.target.value) } variant="outlined" inputProps={{ 'aria-label': 'bare' }} />
            
            <Button onClick={handleSign} variant="contained" className={classes.button}>
                Sign execute
            </Button>
            <div>
                <textarea id='signedData' rows={8} cols={40}></textarea>
            </div>
        </div>
    );
}

// Signコンポーネントを外部に公開しました。
export default Sign;