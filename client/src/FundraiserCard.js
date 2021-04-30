import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Card  from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Web3 from 'web3';
import FundraiserFactoryContract from './contracts/FundraiserFactory.json';
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
    // スタイル用のクラス
    const classes = useStyles();
    // ステート変数を用意する。
    const [ web3, setWeb3 ] = useState(null);
    const [ url, setURL ] = useState(null);
    const [ description, setFundraiserDescription ] = useState(null);
    const [ imageURL, setImageURL ] = useState(null);
    const [ fundName, setFundName ] = useState(null);
    const [ totalDonations, setTotalDonations ] = useState(null);
    const [ donationDount, setDonationCount ] = useState(null);
    const [ contract, setContract] = useState(null);
    const [ accounts, setAccounts ] = useState(null);

    // useEffect関数
    useEffect (() => {

    }, []);

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