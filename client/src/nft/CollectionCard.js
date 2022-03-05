/**
 * NFTとトークンIDを個別に描画するためのコンポーネント
 */

// 必要なモジュールを読み込む
import React, { useState, useEffect } from "react";
import UseStyles from "./../common/useStyles";
import Web3 from 'web3';
import NFTContract from './../contracts/NFT.json';
import detectEthereumProvider from '@metamask/detect-provider';
import MetaData from "./MetaData";

/**
 * CollectionCardコンポーネント
 * @param {*} props 引数(NFTコントラクト)
 */
const CollectionCard = (props) => {
      // 引数から値を取得する。
      const { nft } = props;
      // スタイル用のクラス
      const classes = UseStyles();
      // ステート変数を用意する。
      const [ nftName, setNftName ] = useState(null);
      const [ nftSymbol, setNftSymbol ] = useState(null);
      const [ nftURL, setNftURL ] = useState(null);
      const [ contract, setContract] = useState(null);
      const [ owners, setOwners ] = useState([]);
      const [ totalSupply, setTotalSupply ] = useState(null);
      const [ metaDatas, setMetaDatas ] = useState([]);

      /**
       * useEffect関数
       */
      useEffect (() => {
            // nftが存在する時のみ実行
            if (nft) {
                  init(nft);
            }
      }, []);

      /**
       * コンポーネントを初期化するための関数
       * @param nft NFTコントラクト
       * @param tokenId トークンID
       */
      const init = async (nft) => {
            try {
                  // NFTコントラクトの情報を取得する。
                  const NFT = nft;
                  // Web3が使えるように設定する。
                  const provider = await detectEthereumProvider();
                  const web3 = new Web3(provider);
                  const accounts = await web3.eth.getAccounts(); 
                  const instance = new web3.eth.Contract(NFTContract.abi, NFT);
                  // コントラクトをセットする。
                  setContract(instance);
                  // NFTの発行総数を取得する。
                  const total = await instance.methods.totalSupply().call();
                  
                  var ownerList = [];
                  var metaDataList = [];
                  [...Array(total)].map(async (_, id) => {
                        try {
                              // トークンIDごとのOwnerアドレスとメタデータを取得する。
                              let address = await instance.methods.ownerOf(id).call();
                              let metaData = await instance.methods.getMetaData(id).call();
                              // base64でエンコードされているためデコードする。
                              let jsonData = await base64Decode(metaData);
                              // JSONをJavaScriptオブジェクトに変換する。
                              let jObject = JSON.parse(jsonData)
                              console.log("jObject:", jObject);
                              ownerList.push(address);
                              metaDataList.push(jObject);
                        } catch (e) {
                              console.error(e);
                        }
                  });
                  // ステート変数に値を詰める。
                  setTotalSupply(total);
                  setOwners(ownerList);
                  setMetaDatas(metaDataList);
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
       * Base64をデコードするための関数
       * @param {*} text base64でエンコードされたデータ
       * @returns エンコード前の文字列(ここではJDON形式のデータを想定)
       */
      function base64Decode(text) {
            return fetch(text).then(response => response.text());
      }

      /**
       * displayCard関数
       */
      const displayCard = () => {
            console.log("metaDatasのレンダリング開始")
            return metaDatas.map((metaData, i) => (
                  <MetaData key={metaData} metaData={metaData} owner={owners[i]} />
            ));
      };    

      return (<div>{displayCard()}</div>);
}

export default CollectionCard;