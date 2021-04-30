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

// スタイルを使うための定数
const useStyles = makeStyles (theme => ({
    card: {
        maxWidth: 450,
        height: 400
    },
    media: {
        height: 140,
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

            // 各コントラクトに関する情報を取得する。
            const name = await instance.methods.name().call();
            const description = await instance.methods.description().call();
            const totalDonations = await instance.methods.totalDonations().call();
            const imageURL = await instance.methods.imageURL().call();
            const url = await instance.methods.url().call();
            // ステート変数にセットする。
            setFundName(name);
            setDescription(description);
            setImageURL(imageURL);
            setTotalDonations(totalDonations);
            setURL(url);
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
            console.error(error);
        }
    }

    return (
        <div className="fundraiser-card-content">
            <Card className={classes.card}>
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
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
}

export default FundraiserCard;