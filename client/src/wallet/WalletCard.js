/**
 * マルチシグウォレットの詳細について表示するコンポーネントファイル
 */

// 必要なモジュールを読み込む
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Web3 from 'web3';
import GnosisSafeContract from '../contracts/GnosisSafe.json';
import detectEthereumProvider from '@metamask/detect-provider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// ダイアログ関連なモジュールを読み込む
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// Cardコンポーネントを読み込む
import Card  from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

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
 * WalletCardコンポーネント本体
 */
const WalletCard = (props) => {
    // 変数を定義する。
    const { wallet } = props; 
    // スタイル用のクラス
    const classes = useStyles();
    // ステート変数を用意する。
    const [ web3, setWeb3 ] = useState(null);
    const [ walletName, setWalletName ] = useState(null);
    const [ version, setVersion ] = useState(null);
    const [ chainId, setChainId ] = useState(null);
    const [ nonce, setNonce ] = useState(null);
    const [ threshold, setThreshold ] = useState(null);
    const [ address, setAddress ] = useState(null);
    const [ data, setData ] = useState(null);
    const [ fallbackHandler, setFallbackHandler ] = useState(null);
    const [ paymentToken, setpaymentToken ] = useState(null);
    const [ payment, setPayment ] = useState(null);
    const [ paymentReceiver, PaymentReceiver ] = useState(null);
    const [ to, setTo ] = useState(null);
    const [ owner, setOwner ] = useState(null);
    const [ owners, setOwners ] = useState([]);
    const [ contract, setContract] = useState(null);
    const [ accounts, setAccounts ] = useState(null);
    const [ open, setOpen ] = useState(false);

    /**
     * useEffect関数
     */
     useEffect (() => {
        // fundraiserが存在する時のみinit関数を実行する。
        if (wallet) {
            init (wallet);
        }
    }, [wallet]);

    /**
     * init関数
     */
     const init = async (wallet) => {
        try {
            // GonosisSafeコントラクトの情報を取得する。
            const gonosisSafe = wallet;
            // Web3が使えるように設定する。
            const provider = await detectEthereumProvider();
            const web3 = new Web3(provider);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = GnosisSafeContract.networks[networkId];
            const accounts = await web3.eth.getAccounts();
            const instance = new web3.eth.Contract(GnosisSafeContract.abi, gonosisSafe);
            // Web3をセットする。
            setWeb3 (web3);
            // コントラクトをセットする。
            setContract (instance);
            // アカウントをセットする。
            setAccounts (accounts);
            // コントラクトの情報を格納する。
            setAddress(instance.options.address);
            // ウォレット名を取得する。
            const walletName = await instance.methods.getWalletName().call();
            // 必要な情報をコントラクトから取得する。
            const version = await instance.methods.VERSION().call();
            const threshold = await instance.methods.getThreshold().call();
            const nonce = await instance.methods.nonce().call();
            const chainId = await instance.methods.getChainId().call();
            // ステート変数にセットする。
            setWalletName(walletName);
            setVersion(version);
            setThreshold(threshold);
            setNonce(nonce);
            setChainId(chainId);
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
            console.error(error);
        }
    }

    /**
     * アカウントが切り替わったら画面を更新する。
     */
     window.ethereum.on('accountsChanged', function (accounts) {
        window.location.reload()
    })

    /**
     * handleOpen関数
     */
    const handleOpen = () => {
        // trueにして開く。
        setOpen(true);
    };

    /**
     * handleClose関数
     */
    const handleClose = () => {
        // falseにして閉じる。
        setOpen(false);
    };

    /**
     * 「ウォレット所有者確認」ボタンを押した時の処理
     */
    const buttonOwners = async() => {
        // コントラクトが使えるような設定
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const instance = new web3.eth.Contract(GnosisSafeContract.abi, wallet);
        // 所有者リストを取得する。
        const walletOwners = instance.methods.getOwners().call();
        alert("Owners Addresses : ", walletOwners);
    }

    // 戻り値
    return (
        <div className="wallet-card-content">
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    NAME : {walletName}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        version : {version}
                        <br/>
                        Wallet Address : {address}
                        <br/>
                        Current Nonce : {nonce}
                        <br/>
                        Currnet Threshold : {threshold}
                        <br/>
                        ChainId : {chainId}
                    </DialogContentText>
                        <Button variant="contained" className={classes.button}>
                            <Link to={{ pathname: '/walletSetUp'}}>
                                初期設定
                            </Link>
                        </Button>
                        <br/>
                        <Button onClick={buttonOwners} variant="contained" color="primary" className={classes.button}>
                            ウォレット所有者確認
                        </Button>
                        <br/>
                        <Button variant="contained" className={classes.button}>
                            <Link to={{ pathname: '/execTransaction'}}>
                                送金
                            </Link>
                        </Button>
                        <br/>
                        <Button onClick={buttonTransactionHash} variant="contained" className={classes.button}>
                            <Link to={{ pathname: '/getTxHash' }}>
                                Txハッシュ取得
                            </Link>
                        </Button>
                    </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
            <Card className={classes.card} onClick={handleOpen}>
                <CardActionArea>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {walletName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="div">
                            <p>
                                {walletName}
                            </p>
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button onClick={handleOpen} variant="contained" className={classes.button}>
                        View More
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
}

// コンポーネントを外部に公開する
export default WalletCard;