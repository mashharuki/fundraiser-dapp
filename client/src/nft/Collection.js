/**
 * 所有しているNFTを管理する画面のコンポーネントファイル
 */

// 必要なモジュールを読み込む
import React, { useState, useEffect } from "react";
import Web3 from 'web3';
import NFTContract from './../contracts/NFT.json';
import NFTFactoryContract from './../contracts/NFTFactory.json';
import detectEthereumProvider from '@metamask/detect-provider';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import UseStyles from "../common/useStyles";
import CollectionCard from "./CollectionCard";

/**
 * Collectionコンポーネント本体
 */
const Collection = () => {
      // ステート変数を用意する。
      const [ nfts, setNfts ] = useState ([]);
      const [ contract, setContract ] = useState (null);
      const [ accounts, setAccounts ] = useState (null);
      const [ ethWeb3, setEthWeb3 ] = useState(null);
      const [ ids, setIds ] = useState([]);
      const [ idArray, setIdArray ] = useState([]);
      const [ chain, setChain ] = useState("local");
      // スタイル用のクラス
      const classes = UseStyles();

      /**
       * 副作用フック
       */
      useEffect (() => {
            init();
      }, []);

      // アカウントが切り替わったら画面を更新する。
      window.ethereum.on('accountsChanged', function (accounts) {
            window.location.reload()
      });

      /**
       * init関数(コンポーネントを初期化する。)
       */
      const init = async() => {
            try {
                  // Web3が使えるように設定する。
                  const provider = await detectEthereumProvider();
                  const web3 = new Web3(provider);
                  const networkId = await web3.eth.net.getId();
                  const deployedNetwork = NFTFactoryContract.networks[networkId];
                  const web3Accounts = await web3.eth.getAccounts(); 
                  // コントラクトを読み込む                
                  const instance = new web3.eth.Contract(NFTFactoryContract.abi, deployedNetwork && deployedNetwork.address,);
                  // コントラクトのnfts()関数を呼びだす。
                  const nftContracts = await instance.methods.nfts(100, 0).call(); 
                  // コントラクトをセットする。
                  setContract(instance);
                  // アカウントをセットする。
                  setAccounts(web3Accounts);
                  setEthWeb3(web3); 
                  setNfts(nftContracts);
            } catch (error) {
                  alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
                  console.log(error);
            }
      }

      /**
       * displayCollection関数
       * @param {*} nfts NFTコントラクトアドレスの配列
       * @returns CollectionCardコンポーネント群
       */
      const displayCollection = async (nfts) => {
            return (
                  <Box sx={{ flexGrow: 1 }}>
                        <Grid
                              container
                              spacing={{ xs: 2, md: 3 }}
                              columns={{ xs: 4, sm: 8, md: 12 }}
                        >
                              {nfts.map((_, nft) => {
                                    return (
                                          <Grid item xs={1} sm={2} md={4} key={nft}>
                                                <CollectionCard nft={nft} key={nft} />
                                          </Grid>
                                    )
                              })}
                        </Grid>
                  </Box>
            );
      }

      return (
            <div className="collection-container">
                  <h2>
                        My Collections
                  </h2>
                  {displayCollection(nfts)}
            </div>
      );
}

export default Collection;