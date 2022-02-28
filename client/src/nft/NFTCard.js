/**
 * NFTの詳細について表示するコンポーネントファイル
 */

// 必要なモジュールを読み込む
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UseStyles from "./../common/useStyles";
import Web3 from 'web3';
import NFTContract from '../contracts/NFT.json';
import detectEthereumProvider from '@metamask/detect-provider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// ダイアログ関連なモジュールを読み込む
import Dialog from '@material-ui/core/Dialog';
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

/**
 * NFTCardコンポーネント本体
 */
const NFTCard = (props) => {
    // 変数を定義する。
    const { nft } = props; 
    // スタイル用のクラス
    const classes = UseStyles();
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
    const [ mintRole, setMintRole ] = useState("0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6");
    const [ hasMintRole, setHasMintRole ] = useState(false);
    const [ nftTotal, setNftTotal ] = useState(null);
    const [ nftBalance, setNftBalance ] = useState(null);
    const [ owner, setOwner ] = useState(null);
    const [ minter, setMinter ] = useState(null);

    // NFT発行画面に渡す要素
    const toNftMint = {
        nft: nft,
        mintFlg: hasMintRole, 
        account: minter,
    };

    /**
     * useEffect関数
     */
    useEffect (() => {
        // nftが存在する時のみ実行
        if (nft) {
            init (nft);
        }
    }, [nft]);

    /**
     * init関数
     * @param nft NFTコントラクト
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
            // 総供給量を取得する。
            const totalSupply = await instance.methods.totalSupply().call();
            // NFT数を取得する。
            const balanceOf = await instance.methods.balanceOf(accounts[0]).call();
            // NFTをMintする権限があるかどうかをチェックする。
            const mintFlg = await instance.methods.hasRole(mintRole, accounts[0]).call();
            // ステート変数にセットする。
            setNftName(name);
            setNftSymbol(symbol);
            setNftURL(url);
            setNftTotal(totalSupply);
            setNftBalance(balanceOf);
            console.log("mintFlg", mintFlg);
            setHasMintRole(mintFlg);
            setMinter(accounts[0]);
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
    });

    /**
     * ダイアログを開くための関数
     */
    const handleOpen = () => {
        // trueにして開く。
        setOpen(true);
    };

    /**
     * ダイアログを閉じるための関数
     */
    const handleClose = () => {
        // falseにして閉じる。
        setOpen(false);
        setOwner(null);
    };

    /**
     *  「所有者確認」ボタンを押した時の処理
     */
    const buttonOwnerOf = async() => {
        // コントラクトが使えるような設定
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const instance = new web3.eth.Contract(NFTContract.abi, nft);

        try {
            // 所有者アドレスを取得する。
            const ownerAddress = await instance.methods.ownerOf(tokenId).call();
            console.log("所有者アドレス：", ownerAddress);
            setOwner(ownerAddress);
            setTokenId(null);
        } catch(e) {
            alert("このトークンIDをもつNFTは、burnされている可能性があります。");
        }
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
            // 所有者アドレスを取得する。
            const ownerAddress = await instance.methods.ownerOf(tokenId).call();
            // 所有者アドレスと実行者が一致していることを確認する。
            if (accounts[0] === ownerAddress) {
                // 移転実行
                await instance.methods.transferFrom(accounts[0], to, tokenId).send({ 
                    from: accounts[0],
                    gas: 650000
                });
                alert("NFT移転成功！");
                setTo(null);
                setTokenId(null);
            } else {
                alert("あなたはこのNFTの所有者ではないので移転できません。");
            }
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
            // 所有者アドレスを取得する。
            const ownerAddress = await instance.methods.ownerOf(tokenId).call();
            // 所有者アドレスと実行者が一致していることを確認する。
            if (accounts[0] == ownerAddress) {
                // 償却実行
                await instance.methods.burn(tokenId).send({ 
                    from: accounts[0],
                    gas: 650000
                });
            } else {
                alert("あなたはこのNFTの所有者ではないので償却できません。");
            }
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
                            BaseURL : {nftURL}
                        </p>
                        <p>
                            Address : {address} 
                        </p>
                        <p>
                            発行数 : {nftBalance}
                        </p>
                        <p>
                            総供給量 : {nftTotal}
                        </p>
                        <TextField 
                            id="tokenId" 
                            className={classes.textField} 
                            placeholder="TokenId" 
                            margin="normal" 
                            onChange={ (e) => setTokenId(e.target.value) } 
                            variant="outlined" 
                            inputProps={{ 'aria-label': 'bare' }} 
                        />
                        <Button onClick={buttonOwnerOf} variant="contained" color="primary" className={classes.button}>
                            所有者確認
                        </Button>
                        <br/>
                        { owner ? <p>所有者は、{owner}です！</p> : <></> }
                        <Button onClick={buttonBurn} variant="contained" color="primary" className={classes.button}>
                            NFT償却
                        </Button>
                        <br/>
                        <TextField 
                            id="to" 
                            className={classes.textField} 
                            placeholder="To" 
                            margin="normal" 
                            onChange={ (e) => setTo(e.target.value) } 
                            variant="outlined" 
                            inputProps={{ 'aria-label': 'bare' }} 
                        />
                        <Button onClick={buttonTransferFrom} variant="contained" color="primary" className={classes.button}>
                            NFT移転
                        </Button>
                        <br/>
                        <Button variant="contained" color="secondary" >
                            <Link to={"/nftMint"} state={toNftMint}>
                                NFT発行
                            </Link>
                        </Button>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            { !hasMintRole ?
                <Card className={classes.card} onClick={handleOpen}>
                    <CardActionArea>
                        { nftURL ? ( <CardMedia className={classes.media} image={nftURL} title="NFT Image"/> ) : (<></>) }
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
            : <></>}
        </div>
    );
}

// コンポーネントを外部に公開する
export default NFTCard;