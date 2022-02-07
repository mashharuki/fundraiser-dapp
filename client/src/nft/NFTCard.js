/**
 * NFTの詳細について表示するコンポーネントファイル
 */

// 必要なモジュールを読み込む
import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Web3 from 'web3';
import NFTContract from '../contracts/NFT.json';
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
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

// スタイルを使うための定数
const useStyles = makeStyles (theme => ({
    card: {
        maxWidth: 600,
        height: 600
    },
    media: {
        height: 400,
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
        backgroundColor: theme.palette.primary.light,
        boxShadow: 'none',
        padding: 4,
    },
}));

/**
 * NFTCardコンポーネント本体
 */
const NFTCard = (props) => {
    // 変数を定義する。
    const { nft } = props; 
    // スタイル用のクラス
    const classes = useStyles();
    // ステート変数を用意する。
    const [ web3, setWeb3 ] = useState(null);
    const [ nftName, setNftName ] = useState(null);
    const [ nftSymbol, setNftSymbol ] = useState(null);
    const [ nftURL, setNftURL ] = useState(null);
    const [ contract, setContract] = useState(null);
    const [ accounts, setAccounts ] = useState(null);
    const [ tokenId , setTokenId] = useState(null);
    const [ address, setAddress ] = useState(null);
    const [ to, setTo ] = useState(null);
    const [ open, setOpen ] = useState(false);
    const [ mintRole, setMintRole ] = useState(null);
    const [ nftTotal, setNftTotal ] = useState(null);
    const [ nftBalance, setNftBalance ] = useState(null);

    /**
     * useEffect関数
     */
    useEffect (() => {
        // fundraiserが存在する時のみinit関数を実行する。
        if (nft) {
            init (nft);
        }
    }, [nft]);

    /**
     * init関数
     */
    const init = async (nft) => {
        try {
            // NFTコントラクトの情報を取得する。
            const NFT = nft;
            // Web3が使えるように設定する。
            const provider = await detectEthereumProvider();
            const web3 = new Web3(provider);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = NFTContract.networks[networkId];
            const accounts = await web3.eth.getAccounts();
            const instance = new web3.eth.Contract(NFTContract.abi, NFT);
            // Web3をセットする。
            setWeb3 (web3);
            // コントラクトをセットする。
            setContract (instance);
            // アカウントをセットする。
            setAccounts (accounts);
            // コントラクトの情報を格納する。
            setAddress(instance.options.address);
            // NFTの名前、シンボル、URLを取得する。
            const name = await instance.methods.getNftName().call();
            const symbol = await instance.methods.getNftSymbol().call();
            const url = await instance.methods.getNftURL().call();
            // minterRoleを取得する。
            const minterRole = await instance.methods.MINTER_ROLE().call();
            // 総供給量を取得する。
            const totalSupply = await instance.methods.totalSupply().call();
            // NFT数を取得する。
            const balanceOf = await instance.methods.balanceOf(accounts[0]).call()
            // ステート変数にセットする。
            setNftName(name);
            setNftSymbol(symbol);
            setNftURL(url);
            setMintRole(minterRole);
            setNftTotal(totalSupply);
            setNftBalance(balanceOf);
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
     * 「NFT発行」ボタンを押した時の処理
     */
    const buttonMint = async() => {
        // コントラクトが使えるような設定
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = NFTContract.networks[networkId];
        const instance = new web3.eth.Contract(NFTContract.abi, nft);
        console.log(accounts[0]);

        try {
            // NFTコントラクトのmint関数を実行する。
            const { hash } = await instance.methods.mint(to).send({ 
                from: accounts[0],
                gas: 650000
            });
            alert("NFT発行成功！");
        } catch (e) {
            console.log(e);
            alert("mint NFT failed");
        }
       
    }

    /**
     *  「所有者確認」ボタンを押した時の処理
     */
    const buttonOwnerOf = async() => {
        // コントラクトが使えるような設定
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const instance = new web3.eth.Contract(NFTContract.abi, nft);
        // 所有者アドレスを取得する。
        const ownerAddress = await instance.methods.ownerOf(tokenId).call().then(
            alert("所有者アドレス：", ownerAddress)
        );
        console.log("所有者アドレス：", ownerAddress);
    }

    /**
     * 「NFT移転」ボタンを押した時の処理
     */
    const buttonTransferFrom = async() => {
        // コントラクトが使えるような設定
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const instance = new web3.eth.Contract(NFTContract.abi, nft);

        try {
            // 移転実行
            await instance.methods.transferFrom(accounts[0], to, tokenId).send({ 
                from: accounts[0],
                gas: 650000
            });
            alert("NFT移転成功！");
        } catch (e) {
            alert("NFT移転失敗");
        }
    }

    /**
     * 「NFT償却」
     */
    const buttonBurn = async() => {
        // コントラクトが使えるような設定
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const instance = new web3.eth.Contract(NFTContract.abi, nft);

        try {
            // 償却実行
            await instance.methods.burn(tokenId).call();
            alert("NFT償却成功！");
        } catch (e) {
            alert("NFT償却失敗");
        }
    }

    // レンダリング内容
    return (
        <div className="nft-card-content">
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    NAME : {nftName}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <p>
                            Symbol : {nftSymbol}
                        </p>
                        <p>
                            URL : {nftURL}
                        </p>
                        <p>
                            Address : {address} 
                        </p>
                        <p>
                            Minter権限確認 : {mintRole}
                        </p>
                        <p>
                            発行数 : {nftBalance}
                        </p>
                        <p>
                            総供給量取得 : {nftTotal}
                        </p>
                        <br/>
                        <TextField id="outlined-bare4" className={classes.textField} placeholder="TokenId" margin="normal" onChange={ (e) => setTokenId(e.target.value) } variant="outlined" inputProps={{ 'aria-label': 'bare' }} />
                        <Button onClick={buttonOwnerOf} variant="contained" color="primary" className={classes.button}>
                            所有者確認
                        </Button>
                        <br/>
                        <Button onClick={buttonBurn} variant="contained" color="primary" className={classes.button}>
                            NFT償却
                        </Button>
                        <br/>
                        <TextField id="outlined-bare5" className={classes.textField} placeholder="To" margin="normal" onChange={ (e) => setTo(e.target.value) } variant="outlined" inputProps={{ 'aria-label': 'bare' }} />
                        <Button onClick={buttonMint} variant="contained" color="primary" className={classes.button}>
                            NFT発行
                        </Button>
                        <br/>
                        <Button onClick={buttonTransferFrom} variant="contained" color="primary" className={classes.button}>
                            NFT移転
                        </Button>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            <Card className={classes.card} onClick={handleOpen}>
                <CardActionArea>
                    {nftURL ? (
                        <CardMedia className={classes.media} image={nftURL} title="NFT Image"/>
                        ) : (<></>) 
                    };
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {nftName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="div">
                            <p>
                                {nftURL}
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
export default NFTCard;