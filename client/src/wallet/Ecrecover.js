import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import detectEthereumProvider from '@metamask/detect-provider';
import SimpleMultiSigContract from '../contracts/SimpleMultiSig.json';
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
const Ecrecover = () => {
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
    const [ sigR, setSigR ] = useState([]);
    const [ sigS, setSigS ] = useState([]);
    const [ sigV, setSigV ] = useState([]);
    const [ salt, setSalt ] = useState("0x251543af6a222378665a76fe38dbceae4871a070b7fdaf5c6c30cf758dc33cc0");

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
        // コントラクト
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleMultiSigContract.networks[networkId];
        const instance = new web3.eth.Contract(SimpleMultiSigContract.abi, deployedNetwork && deployedNetwork.address,);
        // 必要なデータをセットする。
        alert('r' + sigR);
        alert('s' + sigS);
        alert('v' + sigV);
        // コントラクトのexecuteを呼び出す。
        await instance.methods.execute(sigV, sigR, sigS, destination, value, data, executor, gasLimit).send({ from: accounts[0] });
        // アラートを出す。
        alert('Successfully ecrecovered data')
    }

    // 戻り値
    return (
        <div className="main-container">
            <h2>
                署名実行アドレス復元画面
            </h2>
            <label>SigR</label>
            <TextField id="outlined-bare" className={classes.textField} placeholder="SigR" margin="normal" onChange={ (e) => setSigR(e.target.value) } variant="outlined" inputProps={{ 'aria-label': 'bare' }} />
            <label>SigS</label>
            <TextField id="outlined-bare2" className={classes.textField} placeholder="SigS" margin="normal" onChange={ (e) => setSigS(e.target.value) } variant="outlined" inputProps={{ 'aria-label': 'bare' }} />
            <label>SigV</label>
            <TextField id="outlined-bare3" className={classes.textField} placeholder="SigV" margin="normal" onChange={ (e) => setSigV(e.target.value) } variant="outlined" inputProps={{ 'aria-label': 'bare' }} />
           
            <Button onClick={handleSign} variant="contained" className={classes.button}>
                ecrecover
            </Button>
            <div>
                <textarea id='ecrecoveredData' rows={8} cols={40}></textarea>
            </div>
        </div>
    );
}

// Ecrecoverコンポーネントを外部に公開しました。
export default Ecrecover;