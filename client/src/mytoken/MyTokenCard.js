/**
 * ERC20標準のトークンの詳細について表示するコンポーネントファイル
 */

// 必要なモジュールを読み込む
import React, { useState, useEffect } from "react";
import UseStyles from "./../common/useStyles";
import Web3 from 'web3';
import MyTokenContract from '../contracts/MyToken.json';
import detectEthereumProvider from '@metamask/detect-provider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// ダイアログ関連なモジュールを読み込む
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// Cardコンポーネントを読み込む
import Card  from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

/**
 * MyTokenCardコンポーネント本体
 * @param props tokenのコントラクトアドレス
 */
const MyTokenCard = (props) => {
      // 引数からMyTokenアドレスを取得する。
      const { token } = props; 
      // スタイル用のクラス
      const classes = UseStyles();
      // ステート変数を用意する。
      const [ ethWeb3, setEthWeb3 ] = useState(null);
      const [ tokenName, setTokenName ] = useState(null);
      const [ tokenSymbol, setTokenSymbol ] = useState(null);
      const [ contract, setContract] = useState(null);
      const [ accounts, setAccounts ] = useState(null);
      const [ balance, setBalance ] = useState(0);
      const [ owner, setOwner ] = useState(null);
      const [ totalSupply, setTotalSupply ] = useState(0);
      const [ nonce, setNonce ] = useState(0);
      const [ to, setTo ] = useState(null);
      const [ open, setOpen ] = useState(false);
      const [ amount, setAmount ] = useState(0);
      const [ isOwner, setIsOwner ] = useState(false);
      const [ pauseFlg, setPauseFlg ] = useState(false);

      /**
       * useEffect関数
       */
      useEffect (() => {
            // tokenが存在する時のみ実行
            if (token) {
                  init (token);
            }
      }, [token]);

      /**
       * init関数
       * @param token MyTokenコントラクトアドレス
       */
      const init = async (token) => {
            try {
                  // MyTokenコントラクトの情報を取得する。
                  const MyToken = token;
                  // Web3が使えるように設定する。
                  const provider = await detectEthereumProvider();
                  const web3 = new Web3(provider);
                  const web3Accounts = await web3.eth.getAccounts();
                  const instance = new web3.eth.Contract(MyTokenContract.abi, MyToken);
                  // コントラクトより名前、シンボル、所有者、総発行数、残高、pause状態を取得する。
                  const name = await instance.methods.name().call();
                  const symbol = await instance.methods.symbol().call();
                  const owner = await instance.methods.owner().call();
                  const total = await instance.methods.totalSupply().call();
                  // const balanceOf = await instance.methods.allowance(owner, web3Accounts[0]).call();
                  const balanceOf = await instance.methods.balanceOf(web3Accounts[0]).call();
                  const nonces = await instance.methods.nonces(web3Accounts[0]).call();
                  const paused = await instance.methods.paused().call();
                  // Ownerかどうかチェックする。
                  if (owner === web3Accounts[0]) {
                        setIsOwner(true);
                  }
                  // ステート変数に値を詰める。
                  setEthWeb3(ethWeb3);
                  setAccounts(web3Accounts);
                  setContract(instance);
                  setTokenName(name);
                  setTokenSymbol(symbol);
                  setOwner(owner);
                  setTotalSupply(total);
                  setBalance(balanceOf);
                  setNonce(nonces);
                  setPauseFlg(paused);
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
       * ダイアログを開くための関数
       */
      const handleOpen = () => {
            // trueにして開く。
            setOpen(true);
      };

      /**
       * ダイアログを閉じるための関数
       */
      const handleClose = () => {
            // falseにして閉じる。
            setOpen(false);
      };

      /**
       * 「発行」ボタンを押した時の関数
       */
      const buttonMint = async () => {
            try {
                  // pause関数の呼び出し。
                  await contract.methods.mint(to, amount).send({ 
                        from: accounts[0],
                        gas: 6500000
                    });
            } catch (error) {
                  alert(`発行に失敗しました。`,);
                  console.error(error);
            }
      };

      /**
       * 「移転」ボタンを押した時の関数
       */
      const buttonTransfer = async () => {
            try {
                  // pause関数の呼び出し。
                  await contract.methods.transfer(to, amount).send({ 
                        from: accounts[0],
                        gas: 6500000
                    });
            } catch (error) {
                  alert(`移転に失敗しました。`,);
                  console.error(error);
            }
      };
      
      /**
       * 「Pause」ボタンを押した時の関数
       */
      const buttonPause = async () => {
            try {
                  // pause関数の呼び出し。
                  await contract.methods.pause().send({ 
                        from: accounts[0],
                        gas: 6500000
                    });
            } catch (error) {
                  alert(`Pauseに失敗しました。`,);
                  console.error(error);
            }
      };

      /**
       * 「unPause」ボタンを押した時の関数
       */
       const buttonUnPause = async () => {
            try {
                  // unpause関数の呼び出し。
                  await contract.methods.unpause().send({ 
                        from: accounts[0],
                        gas: 6500000
                    });
            } catch (error) {
                  alert(`Pauseに失敗しました。`,);
                  console.error(error);
            }
      };

      return (
            <div className="mytoken-card-content">
                  <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">
                              NAME : {tokenName}
                        </DialogTitle>
                        <DialogContent>
                              <DialogContentText>
                                    <p>
                                          Symbol : {tokenSymbol}
                                    </p>
                                    <p>
                                          残高 : {balance}
                                    </p>
                                    <p>
                                          総供給量 : {totalSupply}
                                    </p>
                                    <p>
                                          ナンス : {nonce}
                                    </p>
                                    <TextField 
                                          id="to" 
                                          className={classes.textField} 
                                          placeholder="To" 
                                          margin="normal" 
                                          onChange={ (e) => setTo(e.target.value) } 
                                          variant="outlined" 
                                          inputProps={{ 'aria-label': 'bare' }} />
                                    <TextField 
                                          id="amount" 
                                          className={classes.textField} 
                                          placeholder="Amount" 
                                          margin="normal" 
                                          onChange={ (e) => setAmount(e.target.value) } 
                                          variant="outlined" 
                                          inputProps={{ 'aria-label': 'bare' }} />
                                    <Button onClick={buttonMint} variant="contained" color="primary" className={classes.button}>
                                          発行
                                    </Button>
                                    <br/>
                                    <Button onClick={buttonTransfer} variant="contained" color="primary" className={classes.button}>
                                          移転
                                    </Button>
                                    <br/>
                                    { isOwner ? 
                                          <Button onClick={buttonPause} variant="contained" color="primary" className={classes.button}>
                                                Pause
                                          </Button> 
                                    : <></>}
                                    { isOwner ? 
                                          <Button onClick={buttonUnPause} variant="contained" color="primary" className={classes.button}>
                                                UnPause
                                          </Button> 
                                    : <></>}
                              </DialogContentText>
                        </DialogContent>
                  </Dialog>
                  <Card className={classes.card} onClick={handleOpen}>
                        <CardActionArea>
                              <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                          {tokenName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="div">
                                          <p>
                                                {tokenSymbol}
                                          </p>
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="div">
                                          <p>
                                                {balance}
                                          </p>
                                    </Typography>
                              </CardContent>
                        </CardActionArea>
                        <CardActions>
                              <Button onClick={handleOpen} variant="contained" className={classes.button}>
                                    View More
                              </Button>
                        </CardActions>
                  </Card>
            </div>
      );
}

// コンポーネントを外部に公開する
export default MyTokenCard;