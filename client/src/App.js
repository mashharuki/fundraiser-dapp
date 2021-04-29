import React, { Component } from "react";
import FundraiserFactoryContract from "./contracts/FundraiserFactory.json";
import getWeb3 from "./getWeb3";
import "./App.css";

// コンポーネントを用意する。
const App = () => {
  // ステート変数を用意する。　
  const [state, setState] = useState({ web3: null, accounts: null, contract: null  });

  // useeffect関数
  useEffect (() => {
    const init = async () => {
      try {
        // 変数を設定
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        // デプロイ済みネットワークを取得する。
        const deployedNetwork = FundraiserFactoryContract.networks[networkId];
        // コントラクトのインスタンスを生成する。
        const instance = new web3.eth.Contract (FundraiserFactoryContract.abi, deployedNetwork && deployedNetwork.address);
        // ステート変数を設定する。
        setState ({ web3, accounts, contract: instance });
      } catch (error) {
        // アラートを出す。
        alert (`App.js: Failed to load web3, accounts, or contract. Check console for details.`,);
        // アラート内容を出力する。
        console.error (error);
      }
    } 
    init();
  }, []);

  // runExample関数
  const runExample = async() => {
    const { accounts, contract } = state;
  };

  return (
    <div>
      <h1>Fundraiser</h1>
    </div>
  );
}

// コンポーネントを外部に公開
export default App;
