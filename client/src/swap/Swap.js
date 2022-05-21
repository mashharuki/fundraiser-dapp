
// 必要なモジュールをインポートする。
import '../App.css';
import React, { useState, useEffect } from "react";
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import useStyles from '../common/useStyles';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import { MenuItem, Select } from "@mui/material";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import eth from './../common/assets/image/eth.png';
import mash from './../common/assets/image/mash.png';

// トークンのアドレス
const tokenItems = [
      //"0x06Dc2032695B30D0166E6f1f21C74Fe804F52553",
      //"0x8dde86fCe1FBE467ec067eF49B2b018AA0D6624d"
      "ETH",
      "MSH"
];

const imageItems = [
      eth,
      mash
];

// StyledPaperコンポーネント
const StyledPaper = styled(Paper)(({ theme }) => ({
      padding: theme.spacing(2),
      maxWidth: 600
}));

/**
 * Swapコンポーネント
 */
const Swap = () => {
      const [ contract, setContract ] = useState (null);
      const [ accounts, setAccounts ] = useState (null);
      const [ tokenA, setTokenA ] = useState(null);
      const [ tokenB, setTokenB ] = useState(null);
      const [ web3, setWeb3 ] = useState(null);
      // スタイル用のクラス
      const classes = useStyles();

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
                                                      width: 450, marginTop: 3
                                                }}
                                          >  
                                                <InputBase
                                                      sx={{ ml: 2 }}
                                                      placeholder="0.0"
                                                      type='number'
                                                      inputProps={{ 'aria-label': 'enter amount!' }}
                                                />
                                                
                                                <Select
                                                      labelId="tokenA"
                                                      id="tokenA2"
                                                      value={tokenA}
                                                      autoWidth
                                                      sx={{ m: 1, maxWidth: 110 }}
                                                      onChange={(e) => { setTokenA(e.target.value) }}
                                                >
                                                      { tokenItems.map((item, index) => (
                                                            <MenuItem key={index} value={item}>    
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
                                          <Grid container justifyContent="center">
                                                <SwapVertIcon/>
                                          </Grid>
                                          <FormControl size="medium" sx={{ m: 1, width: 300 }}>
                                                <InputLabel id="tokenA">tokenA</InputLabel>
                                                <Select
                                                      labelId="tokenA"
                                                      id="tokenA2"
                                                      value={tokenA}
                                                      label="tokenA"
                                                      input={<OutlinedInput id="select-tokenA" label="tokenA" />}
                                                      onChange={(e) => { setTokenA(e.target.value) }}
                                                >
                                                      { tokenItems.map((item, index) => (
                                                            <MenuItem key={index} value={item}>{item}</MenuItem>
                                                      ))}
                                                </Select>
                                          </FormControl><br/>
                                    </Grid>
                              </StyledPaper>
                        </Box>
                  </Grid>
                <br/>
            </div>
        );
}

// コンポーネントを外部に公開する。
export default Swap;