
// 必要なモジュールをインポートする。
import '../App.css';
import React, { useState, useEffect } from "react";
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import useStyles from '../common/useStyles';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

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
      const [ web3, setWeb3 ] = useState(null);
      // スタイル用のクラス
      const classes = useStyles();

      return (
            <div className="main-container">
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
                              <StyledPaper sx={{my: 1, mx: "auto", p: 0, borderRadius: 4}}>
                                    <div className="swap">
                                          テスト
                                    </div>
                              </StyledPaper>
                        </Box>
                  </Grid>
                <br/>
            </div>
        );
}

// コンポーネントを外部に公開する。
export default Swap;