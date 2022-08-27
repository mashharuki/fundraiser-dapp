import React, { useState, useEffect } from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import FundraiserFactoryContract from './contracts/FundraiserFactory.json';
import NFTFactoryContract from './contracts/NFTFactory.json';
import GnosisSafeProxyFactoryContract from './contracts/GnosisSafeProxyFactory.json';
import MyTokenFactoryContract from "./contracts/MyTokenFactory.json";
import Web3 from "web3";
import FundraiserCard from './fundraiser/FundraiserCard';
import NFTCard from "./nft/NFTCard";
import WalletCard from "./wallet/WalletCard";
import MyTokenCard from "./mytoken/MyTokenCard";
import UseStyles from "./common/useStyles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

// コンポーネントを用意する。
const Home = () => {
    // ステート変数を用意
    const [ funds, setFunds ] = useState ([]);
    const [ nfts, setNfts ] = useState ([]);
    const [ wallets, setWallets ] = useState ([]);
    const [ myTokens, setMyTokens ] = useState ([]);
    const [ contract, setContract ] = useState (null);
    const [ accounts, setAccounts ] = useState (null);
    const classes = UseStyles();
    
    useEffect (() => {
        init();
    }, []);

    // アカウントが切り替わったら画面を更新する。
    window.ethereum.on('accountsChanged', function (accounts) {
        window.location.reload()
    });

    // init関数
    const init = async() => {
        try {
            // Web3が使えるように設定する。
            const provider = await detectEthereumProvider();
            const web3 = new Web3(provider);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = FundraiserFactoryContract.networks[networkId];
            const deployedNetwork2 = NFTFactoryContract.networks[networkId];
            const deployedNetwork3 = GnosisSafeProxyFactoryContract.networks[networkId];
            const deployedNetwork4 = MyTokenFactoryContract.networks[networkId];
            const accounts = await web3.eth.getAccounts();
            const instance = new web3.eth.Contract(FundraiserFactoryContract.abi, deployedNetwork && deployedNetwork.address,);
            const instance2 = new web3.eth.Contract(NFTFactoryContract.abi, deployedNetwork2 && deployedNetwork2.address,);
            const instance3 = new web3.eth.Contract(GnosisSafeProxyFactoryContract.abi, deployedNetwork3 && deployedNetwork3.address,);
            const instance4 = new web3.eth.Contract(MyTokenFactoryContract.abi, deployedNetwork4 && deployedNetwork4.address,);
            // コントラクトをセットする。
            setContract (instance);
            // アカウントをセットする。
            setAccounts (accounts);
            // コントラクトのfundraisers()関数を呼び出す。
            const funds = await instance.methods.fundraisers(10, 0).call();
            // コントラクトのnfts()関数を呼びだす。
            const nfts = await instance2.methods.nfts(10, 0).call();
            // コントラクトのproxys()関数を呼び出す。
            const wallets = await instance3.methods.proxys(10, 0).call();
            // コントラクトのmyTokens()関数を呼び出す。
            const tokens = await instance4.methods.myTokens(10, 0).call();
            // ステート変数に設定
            setFunds (funds);
            setNfts (nfts);
            setWallets (wallets);
            setMyTokens(tokens);
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
            console.log(error);
        }
    }

    /**
     * displayFundraisers関数
     * @returns FundraiserCardコンポーネント
     */
    const displayFundraisers = () => {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <Grid
                        container
                        spacing={{ xs: 2, md: 3 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                >
                    {funds.map( (fundraiser) => {
                        return (
                            <Grid item xs={1} sm={2} md={4} key={fundraiser}>
                                <FundraiserCard fundraiser={fundraiser} key={fundraiser}/>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        );
    }
    
    /**
     * displayNfts関数
     * @returns NFTCardコンポーネント
     */
    const displayNfts = () => {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <Grid
                        container
                        spacing={{ xs: 2, md: 3 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                >
                    {nfts.map( (nft) => {
                        return (
                            <Grid item xs={1} sm={2} md={4} key={nft}>
                                <NFTCard nft={nft} key={nft} />
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        );
    }

    /**
     * displayMyTokens関数
     * @returns MyTokenCardコンポーネント
     */
     const displayMyTokens = () => {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <Grid
                        container
                        spacing={{ xs: 2, md: 4 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                >
                    {myTokens.map( (token) => {
                        return (
                            <Grid item xs={1} sm={2} md={4} key={token}>
                                <MyTokenCard token={token} key={token} />
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        );
    }

    /**
     * displayWallets関数
     * @returns WalletCardコンポーネント
     */
    const displayWallets = () => {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <Grid
                        container
                        spacing={{ xs: 2, md: 3 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                >
                    {wallets.map( (wallet) => {
                        return (
                            <Grid item xs={1} sm={2} md={4} key={wallet}>
                                <WalletCard wallet={wallet} key={wallet} />
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        );
    }

    return (
        <div className={classes.main_container}>
            { (funds.length > 0) &&
                <h2>
                    資金調達プロジェクト
                </h2>
            }
            {displayFundraisers()}
            { (nfts.length > 0) &&
                <h2>
                    作成済みNFTコントラクト
                </h2>
            }
            {displayNfts()}
            { (myTokens.length > 0) &&
                <h2>
                    作成済みERC20トークン
                </h2>
            }
            {displayMyTokens()}
            { (wallets.length > 0) &&
                <h2>
                    マルチシグウォレット
                </h2>
            }
            {displayWallets()}
        </div>
    );
};

export default Home;