import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Card  from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Web3 from 'web3';
import FundraiserContract from './contracts/Fundraiser.json';
import detectEthereumProvider from '@metamask/detect-provider';
import Button from '@material-ui/core/Button';
// ダイアログ関連おモジュールを読み込む
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// フォーム関連のコンポーネントを読み込む
import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
// cryptocompareを読み込む
const cc = require('cryptocompare');

// スタイルを使うための定数
const useStyles = makeStyles (theme => ({
    card: {
        maxWidth: 450,
        height: 400
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
        width: 400,
        backgroundColor: theme.palette.background.paper,
        boxShadow: 'none',
        padding: 4,
    },
}));

// FundraiserCard関数
const FundraiserCard = (props) => {
    // 変数を定義する。
    const { fundraiser } = props; 
    // スタイル用のクラス
    const classes = useStyles();
    // ステート変数を用意する。
    const [ web3, setWeb3 ] = useState(null);
    const [ url, setURL ] = useState(null);
    const [ description, setDescription ] = useState(null);
    const [ imageURL, setImageURL ] = useState(null);
    const [ fundName, setFundName ] = useState(null);
    const [ totalDonations, setTotalDonations ] = useState(null);
    const [ donationCount, setDonationCount ] = useState(null);
    const [ contract, setContract] = useState(null);
    const [ accounts, setAccounts ] = useState(null);
    const [ open, setOpen ] = useState(false);
    const [ donationAmount, setDonationAmount ] = useState(null);
    const [ exchangeRate, setExchangeRate ] = useState(null);
    //ETH変換用変数
    const ethAmount =  donationAmount / exchangeRate || 0;

    // useEffect関数
    useEffect (() => {
        // fundraiserが存在する時のみinit関数を実行する。
        if (fundraiser) {
            init (fundraiser);
        }
    }, [fundraiser]);

    // init関数
    const init = async (fundraiser) => {
        try {
            // Web3が使えるように設定する。
            const fund = fundraiser;
            const provider = await detectEthereumProvider();
            const web3 = new Web3(provider);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = FundraiserContract.networks[networkId];
            const accounts = await web3.eth.getAccounts();
            const instance = new web3.eth.Contract(FundraiserContract.abi, fund);
            // Web3をセットする。
            setWeb3 (web3);
            // コントラクトをセットする。
            setContract (instance);
            // アカウントをセットする。
            setAccounts (accounts);

            // 各コントラクトに関する情報を取得する。(インスタンスのゲッターメソッドを呼び出して取得する。)
            const name = await instance.methods.name().call();
            const description = await instance.methods.description().call();
            const totalDonations = await instance.methods.totalDonations().call();
            const imageURL = await instance.methods.imageURL().call();
            const url = await instance.methods.url().call();
            // ステート変数にセットする。
            setFundName(name);
            setDescription(description);
            setImageURL(imageURL);
            setURL(url);
            // 現在の為替レートを取得する。
            const exchangeRate = await cc.price('ETH', ['USD']);
            setExchangeRate(exchangeRate);
            // 金額と通貨を渡す。
            const eth = web3.utils.fromWei(totalDonations, 'ether');
            const dollarDonationAmount = exchangeRate.USD * eth;
            // 合計寄付額のステート変数をセットする。
            setTotalDonations(dollarDonationAmount);
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
            console.error(error);
        }
    }

    // handleOpen関数
    const handleOpen = () => {
        // trueにして開く。
        setOpen(true);
    };

    // handleClose関数
    const handleClose = () => {
        // falseにして閉じる。
        setOpen(false);
    };

    // submitFunds関数(寄付をブロックチェーンに送信するための関数)
    const submitFunds = async() => {
        const ethtotal = donationAmount / exchangeRate;
        // 寄付額をweiに変換する
        const donation = web3.eth.toWei(ethtotal.toString());
        // donate()関数を呼び出す。
        await contract.methods.donate().send({
            from: accounts[0],
            value: donation,
            gas: 650000
        });
        // ダイアログを閉じる。
        setOpen(false);
    }

    return (
        <div className="fundraiser-card-content">
            <Dialog opne={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Donate to {fundName}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <img src={imageURL} width='200px' height='130px' />
                        <p>
                            {description}
                        </p>
                        <FormControl className={classes.formControl}>
                            $
                            <Input id="component-simple" value={donationAmount} onChange={ (e) => setDonationAmount(e.target.value)} placeholder="0.00" />
                        </FormControl>
                        <p>ETH: {ethAmount}</p>
                        <Button onClick={submitFunds} variant="contained" color="primary">
                            Donate
                        </Button>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Card className={classes.card} onClick={handleOpen}>
                <CardActionArea>
                    <CardMedia className={classes.media} image={imageURL} title="Fundraiser Image" />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {fundName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            <p>
                                {description}
                            </p>
                            <p>
                                Total Donations: ${totalDonations}
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

export default FundraiserCard;