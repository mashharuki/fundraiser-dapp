/**
 * NFTとトークンIDを個別に描画するためのコンポーネント
 */

// 必要なモジュールを読み込む
import React, { useState, useEffect } from "react";
import UseStyles from "./../common/useStyles";
import Web3 from 'web3';
import NFTContract from './../contracts/NFT.json';
import detectEthereumProvider from '@metamask/detect-provider';
// Cardコンポーネントを読み込む
import Card  from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

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

      /**
       * useEffect関数
       */
      useEffect (() => {
            // nftが存在する時のみ実行
            if (nft) {
                  init(nft);
            }
      }, [nft]);

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
                  // NFTの名前、シンボル、URL、発行総数を取得する。
                  const name = await instance.methods.getNftName().call();
                  const symbol = await instance.methods.getNftSymbol().call();
                  const url = await instance.methods.getNftURL().call();
                  const total = await instance.methods.totalSupply().call();
                  // トークンIDごとのOwnerアドレスを取得する。
                  const ownerList = [];
                  [...Array(total)].map(async (_, id) => {
                        try {
                              let address = await instance.methods.ownerOf(id).call();
                              ownerList.push(address);
                        } catch (e) {
                              console.error(e);
                        }
                  });
                  // ステート変数に値を詰める。
                  setNftName(name);
                  setNftSymbol(symbol);
                  setNftURL(url);
                  setTotalSupply(total);
                  setOwners(ownerList);
            } catch (error) {
                  alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
                  console.error(error);
            }
      }

      /**
       * displayCard関数
       */
      const displayCard = () => {
            console.log("owners：", owners);
            console.log("owners：", totalSupply);
            return [...Array(totalSupply)].map((_, tokenId) => {
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
                                                      owner：{owners[0]}
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
            });
      };
      return (<>{displayCard()}</>);
}

export default CollectionCard;