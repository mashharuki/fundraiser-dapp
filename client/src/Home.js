import React, { useState, useEffect } from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import FundraiserFactoryContract from './contracts/FundraiserFactory.json';
import NFTFactoryContract from './contracts/NFTFactory.json';
import Web3 from "web3";
import FundraiserCard from './FundraiserCard';
import NFTCard from "./NFTCard";

// コンポーネントを用意する。
const Home = () => {
    // ステート変数を用意
    const [ funds, setFunds ] = useState ([]);
    const [ nfts, setNfts ] = useState ([]);
    const [ contract, setContract ] = useState (null);
    const [ accounts, setAccounts ] = useState (null);
    
    useEffect (() => {
        init();
    }, []);

    // init関数
    const init = async() => {
        try {
            // Web3が使えるように設定する。
            const provider = await detectEthereumProvider();
            const web3 = new Web3(provider);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = FundraiserFactoryContract.networks[networkId];
            const deployedNetwork2 = NFTFactoryContract.networks[networkId];
            const accounts = await web3.eth.getAccounts();
            const instance = new web3.eth.Contract(FundraiserFactoryContract.abi, deployedNetwork && deployedNetwork.address,);
            const instance2 = new web3.eth.Contract(NFTFactoryContract.abi, deployedNetwork2 && deployedNetwork2.address,);
            // コントラクトをセットする。
            setContract (instance);
            // アカウントをセットする。
            setAccounts (accounts);
            // コントラクトのfundraisers()関数を呼び出す。
            const funds = await instance.methods.fundraisers(10, 0).call();
            // コントラクトのnfts()関数を呼びだす。
            const nfts = await instance2.methods.nfts(10, 0).call();
            // ステート変数に設定
            setFunds (funds);
            setNfts (nfts);
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
            console.error(error);
        }
    }

    /**
     * displayFundraisers関数
     * @returns FundraiserCardコンポーネント
     */
    const displayFundraisers = () => {
        return funds.map( (fundraiser) => {
            return (
                <FundraiserCard fundraiser={fundraiser} key={fundraiser}/>
            );
        });
    }
    
    /**
     * displayNfts関数
     * @returns NFTCardコンポーネント
     */
    const displayNfts = () => {
        return nfts.map( (nft) => {
            return (
                <NFTCard nft={nft} key={nft} />
            );
        });
    }

    return (
        <div className="main-container">
            { (funds.length > 0) &&
                <h2>
                    資金調達プロジェクト
                </h2>
            }
            {displayFundraisers()}
            { (nfts.length > 0) &&
                <h2>
                    作成済みNFT
                </h2>
            }
            {displayNfts()}
        </div>
    );
};

export default Home;