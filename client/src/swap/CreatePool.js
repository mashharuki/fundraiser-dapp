// 必要なモジュールをインポートする。
import '../App.css';
import React, { useState, useEffect } from "react";
import Web3 from 'web3';
import { Link } from "react-router-dom";
import detectEthereumProvider from '@metamask/detect-provider';
import useStyles from '../common/useStyles';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import { MenuItem, Select } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import InputBase from '@mui/material/InputBase';
import mash from './../common/assets/image/mash.png';
import mash2 from './../common/assets/image/mash2.png';
import DEXContract from './../contracts/DEX.json';
import MyTokenContract from './../contracts/MyToken.json';

// トークンのシンボル情報
const MSH = "MSH";
const MCH2 = "MCH2";
// トークンのアドレス情報
const MSHAddress = "0x06Dc2032695B30D0166E6f1f21C74Fe804F52553";
const MCH2Address = "0x8dde86fCe1FBE467ec067eF49B2b018AA0D6624d"; 

// トークンのシンボル、アドレス、アイコン画像用の配列の定義
const tokenItems = [
      MSH,
      MCH2
];

const tokenAddrs = [
      MSHAddress,
      MCH2Address,
];

const imageItems = [
      mash,
      mash2
];

// StyledPaperコンポーネント
const StyledPaper = styled(Paper)(({ theme }) => ({
      padding: theme.spacing(2),
      maxWidth: 600,
      backgroundColor: '#fde9e8'
}));

/**
 * CreatePoolコンポーネント
 */
const CreatePool = () => {
      const [ dexContract, setDexContract ] = useState (null);
      const [ accounts, setAccounts ] = useState (null);
      const [ tokenA, setTokenA ] = useState(null);
      const [ tokenAAmount, setTokenAAmount ] = useState(0);
      const [ tokenB, setTokenB ] = useState(null);
      const [ tokenBAmount, setTokenBAmount ] = useState(0);
      const [ dexAddress, setDexAddress ] = useState(null);
      const [ web3, setWeb3 ] = useState(null);
      // スタイル用のクラス
      const classes = useStyles();

      /**
       * useEffect関数 
       */ 
      useEffect (() => {
            init();
      }, []);

      // 初期化関数
      const init = async() => {
            try {
                  // Web3が使えるように設定する。
                  const provider = await detectEthereumProvider();
                  const ethWeb3 = new Web3(provider);
                  const web3Accounts = await ethWeb3.eth.getAccounts();
                  const networkId = await ethWeb3.eth.net.getId();
                  const deployedNetwork = DEXContract.networks[networkId];
                  const instance = new ethWeb3.eth.Contract(DEXContract.abi, deployedNetwork && deployedNetwork.address,);
                  setDexContract(instance);
                  setWeb3(ethWeb3);
                  setAccounts(web3Accounts);
                  setDexAddress(deployedNetwork.address);
            } catch (error) {
                  alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
                  console.error(error);
            }
      };

      /**
       * 「Create Pool」ボタンを押した時の処理
       */
      const createPoolAction = async () => {
            // approveメソッドの後にswapTokenメソッドを呼び出す。
            try {
                  const provider = await detectEthereumProvider();
                  const ethWeb3 = new Web3(provider);
                  const tokenAContract = new ethWeb3.eth.Contract(MyTokenContract.abi, tokenA);
                  const tokenBContract = new ethWeb3.eth.Contract(MyTokenContract.abi, tokenB);
                  // まずpoolに提供するトークンそれぞれに対してapproveを実行する。
                  await tokenAContract.methods.approve(dexAddress, tokenAAmount).send({
                        from: accounts[0],
                        gas: 6500000
                  });
                  await tokenBContract.methods.approve(dexAddress, tokenAAmount).send({
                        from: accounts[0],
                        gas: 6500000
                  });
                  // poolの作成
                  await dexContract.methods.createLiquidityPool(tokenA, tokenB, tokenAAmount, tokenBAmount).send({ 
                        from: accounts[0],
                        gas: 6500000
                  });
                  alert("create pool success！");
            } catch(e) {
                  console.error("create pool err:", e);
                  alert("create pool failed");
            }
      };

      return (
            <div className={classes.main_container}>
                  <h2>
                        Swap
                  </h2>
                  <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                  >
                        <Box sx={{ flexGrow: 1, overflow: "hidden", px: 3, mt: 10}}>
                              <StyledPaper sx={{my: 1, mx: "auto", p: 0, borderRadius: 4, marginTop: 4}}>
                                    <Grid container justifyContent="center">
                                          <Paper
                                                component="form"
                                                sx={{ 
                                                      p: '2px 4px', 
                                                      display: 'flex', 
                                                      alignItems: 'center', 
                                                      width: 450, 
                                                      marginTop: 4,
                                                      marginBottom: 2
                                                }}
                                          >  
                                                <InputBase
                                                      sx={{ ml: 2 }}
                                                      placeholder="0.0"
                                                      type='number'
                                                      onChange={(e) => { setTokenAAmount(e.target.value) }}
                                                      inputProps={{ 'aria-label': 'enter amount!' }}
                                                />
                                                <Select
                                                      labelId="tokenA"
                                                      id="tokenA"
                                                      value={tokenA}
                                                      autoWidth
                                                      sx={{ m: 1, maxWidth: 120 }}
                                                      onChange={(e) => { setTokenA(e.target.value) }}
                                                >
                                                      { tokenItems.map((item, index) => (
                                                            <MenuItem key={index} value={tokenAddrs[index]}>    
                                                                  <Grid 
                                                                        container 
                                                                        sx={{ 
                                                                              display: 'flex', 
                                                                              alignItems: 'center'      
                                                                        }}
                                                                  >
                                                                        {item}
                                                                        <img src={imageItems[index]} height="20px" />
                                                                  </Grid>
                                                            </MenuItem>
                                                      ))}
                                                </Select>
                                          </Paper>     
                                          <br/>
                                          <Paper
                                                component="form"
                                                sx={{ 
                                                      p: '2px 4px', 
                                                      display: 'flex', 
                                                      alignItems: 'center', 
                                                      width: 450, 
                                                      marginBottom: 3
                                                }}
                                          >  
                                                <InputBase
                                                      sx={{ ml: 2 }}
                                                      placeholder="0.0"
                                                      type='number'
                                                      onChange={(e) => { setTokenBAmount(e.target.value) }}
                                                      inputProps={{ 'aria-label': 'enter amount!' }}
                                                />
                                                
                                                <Select
                                                      labelId="tokenB"
                                                      id="tokenB"
                                                      value={tokenB}
                                                      autoWidth
                                                      sx={{ m: 1, maxWidth: 120 }}
                                                      onChange={(e) => { setTokenB(e.target.value) }}
                                                >
                                                      { tokenItems.map((item, index) => (
                                                            <MenuItem key={index} value={tokenAddrs[index]}>    
                                                                  <Grid 
                                                                        container 
                                                                        sx={{ 
                                                                              display: 'flex', 
                                                                              alignItems: 'center',       
                                                                        }}
                                                                  >
                                                                        {item}
                                                                        <img src={imageItems[index]} height="20px" />
                                                                  </Grid>
                                                            </MenuItem>
                                                      ))}
                                                </Select>
                                          </Paper>     
                                    </Grid>
                                    <Grid 
                                          container 
                                          justifyContent="center"
                                          sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                m: 1
                                          }}
                                    >
                                          <Grid sx={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 3}}>
                                                <Button 
                                                      variant="outlined" 
                                                      component={Link}
                                                      to="/swap"
                                                      sx={{borderRadius: 4}} 
                                                >
                                                      Return Swap
                                                </Button>
                                          </Grid>
                                          <Grid sx={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 3}}>
                                                <Button variant="outlined" onClick={createPoolAction} color="secondary" sx={{borderRadius: 4}}>
                                                      Create Pool
                                                </Button>
                                          </Grid>
                                    </Grid>
                              </StyledPaper>
                        </Box>
                  </Grid>
                  <br/>
            </div>
      );
};

export default CreatePool;