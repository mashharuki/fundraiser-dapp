/**
 * NFTの詳細について表示するコンポーネントファイル
 */

// 必要なモジュールを読み込む
import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Web3 from 'web3';
import NFTContract from './contracts/NFT.json';
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
        maxWidth: 450,
        height: 200
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
            // ステート変数にセットする。
            setNftName(name);
            setNftSymbol(symbol);
            setNftURL(url);
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
        // NFTコントラクトのmint関数を実行する。
        const { hash } = await instance.methods.mint(accounts[0]).send({ 
            from: accounts[0],
            gas: 650000
        });
        // ネットワーク情報を取得する。
        const net = NFTContract.networks[networkId];
        // rinkebyだった場合出力する。
        if( net.chainId == 4) {
            alert("https://rinkeby.etherscan.io/tx/" + hash);
        }
    }
  
    /**
     * 「NFT総供給量取得」ボタンを押した時の処理
     */
    const buttonSupply = async() => {
        // コントラクトが使えるような設定
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = NFTContract.networks[networkId];
        const instance = new web3.eth.Contract(NFTContract.abi, nft);
        // 総供給量を取得する。
        const totalSupply = await instance.methods.totalSupply().call();
        // totalSupply関数を呼び出す。
        alert("総供給量：", totalSupply);
    }

    /**
     * 「NFT数取得」ボタンを押した時の処理
     */
    const buttonBalanceOf = async() => {
        // コントラクトが使えるような設定
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = NFTContract.networks[networkId];
        const instance = new web3.eth.Contract(NFTContract.abi, nft);
        // 接続中のアカウントに紐づくNFT数を取得する
        const balanceOf = await instance.methods.balanceOf(accounts[0]).call();
        // totalSupply関数を呼び出す。
        alert("NFT数：", balanceOf);
    }

    /**
     *  「所有者確認」ボタンを押した時の処理
     */
    const buttonOwnerOf = async() => {
        // コントラクトが使えるような設定
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = NFTContract.networks[networkId];
        const instance = new web3.eth.Contract(NFTContract.abi, nft);
        // 所有者アドレスを取得する。
        const ownerAddress = await instance.methods.ownerOf(tokenId).call();
        alert("所有者アドレス：", ownerAddress);
    }

    /**
     * 「NFT移転」ボタンを押した時の処理
     */
    const buttonTransferFrom = async() => {
        // コントラクトが使えるような設定
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = NFTContract.networks[networkId];
        const instance = new web3.eth.Contract(NFTContract.abi, nft);
        // 移転実行
        instance.methods.transferFrom(accounts[0], to, tokenId).send({ 
            from: accounts[0],
            gas: 650000
        });
    }

    /**
     * 「NFT償却」
     */
    const buttonBurn = async() => {
        // コントラクトが使えるような設定
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = NFTContract.networks[networkId];
        const instance = new web3.eth.Contract(NFTContract.abi, nft);
        // 償却実行
        instance.methods.burn(tokenId).call();
    }

    // 戻り値
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
                        <Button onClick={buttonBalanceOf} variant="contained" color="primary" className={classes.button}>
                            発行数取得
                        </Button>
                        <br/>
                        <Button onClick={buttonSupply} variant="contained" color="primary" className={classes.button}>
                            総供給量取得
                        </Button>
                        <br/>
                        <TextField id="outlined-bare4" className={classes.textField} placeholder="TokenId" margin="normal" onChange={ (e) => setTokenId(e.target.value) } variant="outlined" inputProps={{ 'aria-label': 'bare' }} />
                        <Button onClick={buttonOwnerOf} variant="contained" color="primary" className={classes.button}>
                            所有者確認
                        </Button>
                        <TextField id="outlined-bare5" className={classes.textField} placeholder="To" margin="normal" onChange={ (e) => setTo(e.target.value) } variant="outlined" inputProps={{ 'aria-label': 'bare' }} />
                        <Button onClick={buttonTransferFrom} variant="contained" color="primary" className={classes.button}>
                            NFT移転
                        </Button>
                        <br/>
                        <Button onClick={buttonBurn} variant="contained" color="primary" className={classes.button}>
                            NFT償却
                        </Button>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={buttonMint} variant="contained" color="primary" className={classes.button}>
                        発行
                    </Button>
                </DialogActions>
            </Dialog>
            <Card className={classes.card} onClick={handleOpen}>
                <CardActionArea>
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