/**
 * 所有しているNFTを管理する画面のコンポーネントファイル
 */

// 必要なモジュールを読み込む
import React, { useState, useEffect } from "react";
import Web3 from 'web3';
import NFTContract from './../contracts/NFT.json';
import NFTFactoryContract from './../contracts/NFTFactory.json';
import detectEthereumProvider from '@metamask/detect-provider';
import CollectionCard from './CollectionCard';
// Cardコンポーネントを読み込む
import Card  from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import UseStyles from "../common/useStyles";

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
                  // ステート変数に設定
                  setNfts(nftContracts);
                  // 配列情報を取得する。
                  const tokenIdArray = await displayCollection(nftContracts);
                  displayTest(tokenIdArray);
                  setIdArray(tokenIdArray);
                  console.log("tokenIdArray:", idArray);
            } catch (error) {
                  alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
                  console.log(error);
            }
      }

      /**
       * displayCollection関数
       * @param nfts NFTコントラクト
       */
      const displayCollection = async (nfts) => {
            // tokenIds用の配列
            const tokenIdArray = [];
            // トークンID用の配列
            const tokenIds = [];
            // 条件に合致したNFTのみCollectionCardコンポーネントを使って表示する。
            await nfts.map(async (nft) => {
                  const provider = await detectEthereumProvider();
                  const web3 = new Web3(provider);
                  // NFTコントラクトを読み取る。
                  const nftInstance = new web3.eth.Contract(NFTContract.abi, nft);
                  const accounts = await web3.eth.getAccounts(); 
                  // 総供給量を取得する。
                  const total = await nftInstance.methods.totalSupply().call();

                  // トークンIDを格納した配列を作成する。
                  [...Array(total)].map(async (_, i) => {
                        try {    
                              // 所有者アドレスとインデックスからトークンIDを取得する。
                              let tokenId = await nftInstance.methods.tokenOfOwnerByIndex(accounts[0], i).call();
                              // トークンIDを取得できた場合のみ出力する。
                              if (tokenId != null) {
                                    tokenIds.push(tokenId);
                              }      
                        } catch (e) {
                              console.error(e);
                        } 
                  });
                  // console.log("nft:", nft);
                  // console.log("トークンIDs:", tokenIds);
                  tokenIdArray.push(tokenIds);
                  tokenIds.splice(0); 
            });
            return tokenIdArray;
      }

      const displayTest = (idArray) => {
            return <p>配列の中身：{idArray}</p>;
      }

      /**
       * displayCollectionCard関数
       * @param nftURL NFTに紐づくURL
       * @param nftName NFT名
       * @param tokenId トークンID
       * @return CollectionCardコンポーネント
       */
      const displayCollectionCard = (nftURL, nftName, tokenId) => {
            console.log("CollectionCardを描画する。");
            return (
                  <Card className={classes.card} variant="outlined">
                        <CardActionArea>
                              { nftURL ? ( <CardMedia className={classes.media} image={nftURL} title="NFT Image"/> ) : (<></>) }
                              <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                          {nftName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="div">
                                          <p>
                                                ID：{tokenId}
                                          </p>
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="div">
                                          <p>
                                                URI：{nftURL}
                                          </p>
                                    </Typography>
                              </CardContent>
                        </CardActionArea>
                  </Card>
            );
      };

      return (
            <div className="collection-container">
                  <h2>
                        My Collections
                  </h2>
                  {displayTest(idArray)}
            </div>
      );
}

export default Collection;