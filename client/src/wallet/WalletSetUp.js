/**
 * マルチシグウォレット初期設定用コンポーネント
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
 * WalletSetUpコンポーネント
 */
const WalletSetUp = (props) => {
    // ステート変数を定義する。
    const [ gonosisSafe, setGonosisSafe ] = useState(null);
    const [ web3, setWeb3 ] = useState(null);
    const [ walletName, setWalletName ] = useState(null);
    const [ version, setVersion ] = useState(null);
    const [ chainId, setChainId ] = useState(null);
    const [ nonce, setNonce ] = useState(null);
    const [ threshold, setThreshold ] = useState(null);
    const [ address, setAddress ] = useState(null);
    const [ data, setData ] = useState(null);
    const [ fallbackHandler, setFallbackHandler ] = useState(null);
    const [ paymentToken, setPaymentToken ] = useState(null);
    const [ payment, setPayment ] = useState(null);
    const [ paymentReceiver, setPaymentReceiver ] = useState(null);
    const [ to, setTo ] = useState(null);
    const [ owner, setOwner ] = useState(null);
    const [ owners, setOwners ] = useState([]);
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
    }, []);

    // アカウントが切り替わったら画面を更新する。
    window.ethereum.on('accountsChanged', function (accounts) {
        window.location.reload()
    });

    /**
     * 「初期設定」ボタンを押した時の処理
     */
    const buttonSetUp = async() => {
        try {
            // コントラクトを使うための設定
            const provider = await detectEthereumProvider();
            const web3 = new Web3(provider);
            const accounts = await web3.eth.getAccounts();
            const instance = new web3.eth.Contract(GnosisSafeContract.abi, gonosisSafe);
            // setup関数の呼び出し。
            instance.methods.setup(owners, threshold, to, data, fallbackHandler, paymentToken, payment, paymentReceiver).send({ 
                from: accounts[0],
                gas: 650000 
            });
            alert(`Successfully setup a wallet.`);
        } catch (error) {
            alert(`Failed to setup a wallet.`);
            console.error(error);
        }
    }

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
        <div className="walletSetUp-container">
            <div className="walletSetUp-header">
                <h2>
                    マルチシグウォレット初期設定画面
                </h2>
            </div>
            <div className="walletSetUp-info">
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
                <br/>
                <div>
                    <label>Owners Address</label>
                    <TextField 
                        id="address" 
                        className={classes.textField} 
                        placeholder="address of Safe owner" 
                        margin="normal" 
                        onChange={ (e) => setOwner(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                    />
                    <Button onClick={addAddress} variant="contained" color="inherit" className={classes.button}> 
                        + 
                    </Button>
                    <br/>
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
                    <label>Threshold</label>
                    <TextField 
                        id="threshold" 
                        className={classes.textField} 
                        placeholder="Threshold" 
                        margin="normal" 
                        onChange={ (e) => setThreshold(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                    />
                    <label>To</label>
                    <TextField 
                        id="to" 
                        className={classes.textField} 
                        placeholder="Contract address for optional delegate call" 
                        margin="normal" 
                        onChange={ (e) => setTo(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                    />
                    <label>Data</label>
                    <TextField 
                        id="data" 
                        className={classes.textField} 
                        placeholder="Data payload for optional delegate call" 
                        margin="normal" 
                        onChange={ (e) => setData(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                    />
                    <label>FallbackHandler</label>
                    <TextField 
                        id="fallbackHandler" 
                        className={classes.textField} 
                        placeholder="Handler for fallback calls to this contract" 
                        margin="normal" 
                        onChange={ (e) => setFallbackHandler(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                    />
                    <label>PaymentToken</label>
                    <TextField 
                        id="paymentToken" 
                        className={classes.textField} 
                        placeholder="Token that should be used for the payment (0x0 is ETH)" 
                        margin="normal" 
                        onChange={ (e) => setPaymentToken(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                    />
                    <label>Payment</label>
                    <TextField 
                        id="payment" 
                        className={classes.textField} 
                        placeholder="Value that should be paid" 
                        margin="normal" 
                        onChange={ (e) => setPayment(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                    />
                    <label>PaymentReceiver</label>
                    <TextField 
                        id="paymentReceiver" 
                        className={classes.textField} 
                        placeholder="Address that should receive the payment (or 0 if tx.origin)" 
                        margin="normal" 
                        onChange={ (e) => setPaymentReceiver(e.target.value) } 
                        variant="outlined" 
                        inputProps={{ 'aria-label': 'bare' }} 
                    />
                </div>
                <Button onClick={buttonSetUp} color="primary" variant="contained" className={classes.button}>
                    初期設定
                </Button>
            </div>
        </div>
    );
}

// コンポーネントを外部に公開する。
export default WalletSetUp;