/**
 * トランザクションハッシュ値取得コンポーネント
 */

// 必要なコンポーネントをインポートする。
import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Web3 from 'web3';
import GnosisSafeContract from '../contracts/GnosisSafe.json';
import detectEthereumProvider from '@metamask/detect-provider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

// スタイルを使うための定数
const useStyles = makeStyles (theme => ({
    card: {
        maxWidth: 600,
        height: 300
    },
    media: {
        height: 140,
    },
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        display: 'table-cell'
    },
    paper: {
        position: 'absolute',
        width: 600,
        backgroundColor: theme.palette.secondary.light,
        boxShadow: 'none',
        padding: 4,
    },
}));

/**
 * GetTxHashコンポーネント
 */
 const GetTxHash = (props) => {
    // ステート変数を定義する。
    const [ gonosisSafe, setGonosisSafe ] = useState(null);
    const [ web3, setWeb3 ] = useState(null);
    const [ walletName, setWalletName ] = useState(null);
    const [ address, setAddress ] = useState(null);
    const [ version, setVersion ] = useState(null);
    const [ chainId, setChainId ] = useState(null);
    const [ threshold, setThreshold ] = useState(null);
    const [ nonce, setNonce ] = useState(null);
    const [ to, setTo ] = useState(null);
    const [ value, setValue ] = useState(null);
    const [ operation, setOperation ] = useState(null);
    const [ data, setData ] = useState(null);
    const [ safeTxGas, setSafeTxGas ] = useState(null);
    const [ baseGas, setBaseGas ] = useState(null);
    const [ gasPrice, setGasPrice ] = useState(null);
    const [ gasToken, setGasToken ] = useState(null);
    const [ refundReceiver, setRefundReceiver ] = useState(null);
    const [ txHash, setTxHash ] = useState(null);
    // スタイル用のクラス
    const classes = useStyles();

    /**
     * useEffect関数 
     */
    useEffect(() => {
        // 遷移元のウォレットの情報を取得する。
        const { wallet, version, address, nonce, threshold, chainId } = props.location.state;
        // ステート変数をセットする。
        setGonosisSafe(wallet);
        setVersion(version);
        setAddress(address);
        setNonce(nonce);
        setThreshold(threshold);
        setChainId(chainId);
    });

    // アカウントが切り替わったら画面を更新する。
    window.ethereum.on('accountsChanged', function (accounts) {
        window.location.reload()
    });

    /**
     * 「トランザクションハッシュ値取得」ボタンを押した時の処理
     */
    const buttonGetTxHash = async() => {
        try {
            // コントラクトを使うための設定
            const provider = await detectEthereumProvider();
            const web3 = new Web3(provider);
            const instance = new web3.eth.Contract(GnosisSafeContract.abi, gonosisSafe);
            // setup関数の呼び出し。
            const transactionHash = instance.methods.getTransactionHash(to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, nonce).call();
            setTxHash(transactionHash);
            alert(`Successfully get a Transaction's hash.`);
        } catch (error) {
            alert(`Failed to get a Transaction's hash.`);
            console.error(error);
        }
    }

    // 戻り値
    return (
        <div className="getTxHash-container">
            <div className="getTxHash-header">
                <h2>
                    トランザクションハッシュ値取得画面
                </h2>
            </div>
            <div className="getTxHash-info">
                <div>
                    version : {version}
                    <br/>
                    Wallet Address : {address}
                    <br/>
                    Current Nonce : {nonce}
                    <br/>
                    Currnet Threshold : {threshold}
                    <br/>
                    ChainId : {chainId}
                </div>
                <div>
                    <label>To</label>
                    <TextField 
                        id="to" 
                        className={classes.textField} 
                        placeholder="Destination address" 
                        margin="normal" 
                        onChange={ (e) => setTo(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                    />
                    <label>Value</label>
                    <TextField 
                        id="value" 
                        className={classes.textField} 
                        placeholder="Ether value" 
                        margin="normal" 
                        onChange={ (e) => setValue(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                    />
                    <label>Data</label>
                    <TextField 
                        id="data" 
                        className={classes.textField} 
                        placeholder="Data payload" 
                        margin="normal" 
                        onChange={ (e) => setData(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                    />
                    <label>Operation</label>
                    <TextField 
                        id="operation" 
                        className={classes.textField} 
                        placeholder="Call or DelegateCall" 
                        margin="normal" 
                        onChange={ (e) => setOperation(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                    />
                    <label>SafeTxGas</label>
                    <TextField 
                        id="safeTxGas" 
                        className={classes.textField} 
                        placeholder="Fas that should be used for the safe transaction" 
                        margin="normal" 
                        onChange={ (e) => setSafeTxGas(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                    />
                    <label>BaseGas</label>
                    <TextField 
                        id="baseGas" 
                        className={classes.textField} 
                        placeholder="Gas costs for data used to trigger the safe transaction" 
                        margin="normal" 
                        onChange={ (e) => setBaseGas(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                    />
                    <label>GasPrice</label>
                    <TextField 
                        id="gasPrice" 
                        className={classes.textField} 
                        placeholder="Maximum gas price that should be used for this transaction" 
                        margin="normal" 
                        onChange={ (e) => setGasPrice(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                    />
                    <label>GasToken</label>
                    <TextField 
                        id="gasToken" 
                        className={classes.textField} 
                        placeholder="Token address (or 0 if ETH) that is used for the payment" 
                        margin="normal" 
                        onChange={ (e) => setGasToken(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                    />
                    <label>RefundReceiver</label>
                    <TextField 
                        id="refundReceiver" 
                        className={classes.textField} 
                        placeholder="Address of receiver of gas payment (or 0 if tx.origin)" 
                        margin="normal" 
                        onChange={ (e) => setRefundReceiver(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                    />
                    <label>Nonce</label>
                    <TextField 
                        id="nonce" 
                        className={classes.textField} 
                        placeholder="Transaction nonce" 
                        margin="normal" 
                        onChange={ (e) => setNonce(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                    />
                </div>
                <Button onClick={buttonGetTxHash} color="primary" variant="contained" className={classes.button}>
                    トランザクションハッシュ値取得
                </Button>
            </div>
        </div>
    );
}

// コンポーネントを外部に公開する。
export default GetTxHash;