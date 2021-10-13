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
const CreateSafeContractWallet = () => {
    // 各種ステート変数を定義する。
    const [ web3, setWeb3 ] = useState(null);
    const [ networkId, setNetworkId ] = useState(null);
    const [ threshold, setThreshold ] = useState(null);
    const [ owner, setOwner ] = useState(null);
    const [ owners, setOwners ] = useState([]);
    const [ contract, setContract] = useState(null);
    const [ accounts, setAccounts ] = useState(null);
    const [ walletName, setWalletName ] = useState(null);
    const [ data, setData ] = useState(null);
    const [ fallbackHandler, setFallbackHandler ] = useState(null);
    const [ paymentToken, setPaymentToken ] = useState(null);
    const [ payment, setPayment ] = useState(null);
    const [ paymentReceiver, setPaymentReceiver ] = useState(null);
    const [ to, setTo ] = useState(null);
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

        try {
            // コントラクトのcreateSafeContract関数を呼び出し、まずはロジックコントラクトを作成する。 
            const safeContract = await instance2.methods.createSafeContract(walletName).send({
                from: accounts[0],
                gas: 650000
            });
            // proxyコントラクトを作成する。
            const proxy = await instance.methods.createProxy(safeContract.address, "").send({
                from: accounts[0],
                gas: 650000
            });
            console.log(proxy.address);
            // アラートを出す。
            alert('Successfully created SafeContractWallet');
        } catch (error) {
            alert(`Failed to create SafeContractWallet.`,);
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
            <Button onClick={handleSubmit} variant="contained" className={classes.button}>
                create!
            </Button>
        </div>
    );
}

// CreateSafeContractWalletコンポーネントを外部に公開します。
export default CreateSafeContractWallet;