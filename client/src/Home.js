import React, { useState, useEffect } from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import FundraiserFactoryContract from './contracts/FundraiserFactory.json';
import Web3 from "web3";
import FundraiserCard from './FundraiserCard';


// コンポーネントを用意する。
const Home = () => {
    // ステート変数を用意
    const [ contract, setContract ] = useState (null);
    const [ accounts, setAccounts ] = useState (null);
    const [ funds, setFunds ] = useState ([]);

    useEffect (() => {
        init();
    }, []);

    // displayFundraisers関数
    const displayFundraisers = () => {
        return funds.map((fundraiser) => {
            return (
                <FundraiserCard fundraiser={fundraiser} key={fundraiser}/>
            );
        });
    }

    // init関数
    const init = async() => {
        try {
            // Web3が使えるように設定する。
            const provider = await detectEthereumProvider();
            const web3 = new Web3(provider);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = FundraiserFactoryContract.networks[networkId];
            const accounts = await web3.eth.getAccounts();
            const instance = new web3.eth.Contract(FundraiserFactoryContract.abi, deployedNetwork && deployedNetwork.address,);
            // コントラクトをセットする。
            setContract (instance);
            // アカウントをセットする。
            setAccounts (accounts);
            // コントラクトのfundraisers()関数を呼び出す。
            const funds = instance.methods.fundraisers(10, 0).call();
            // ステート変数に設定
            setFunds (funds);
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
            console.error(error);
        }
    }

    return (
        <div className="main-container">
            {displayFundraisers()}
        </div>
    );
};

export default Home;