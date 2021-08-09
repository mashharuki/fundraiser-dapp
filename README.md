# 資金調達Web3.0アプリケーションリポジトリ(Dapp用のフレームワークアプリ)

MetaMaskとWeb3.js、スマートコントラクトとReact.jsから構築されています。

土台部分については、下記コマンドにより生成

 truffle unbox react
 
solcのバージョン情報等については、truffle-config.jsを参照ください。

## clientフォルダ直下で実行するコマンド
   npm i   
   npm install -g mocha  
   npm install -g chai   
   npm install @openzeppelin/contracts  
   npm install --save react-router-dom  

## テストコードを実行するコマンド(fundraiser-dappフォルダ直下で実行する)

truffle test

## コントラクトのコンパイルとデプロイ用のコマンド(ローカルチェーンの場合)
   truffle compile  
   truffle migrate  
   (client/contracts/ 配下に「コントラクト名.json」ができていれば成功。) 

## コントラクトのコンパイルとデプロイ用のコマンド(Rinkebyの場合)
   truffle compile --network rinkeby
   truffle migrate --network rinkeby
   (client/contracts/ 配下に「コントラクト名.json」ができていれば成功。) 

## 事前にやっておくこと

1. node.jsをインストールしておくこと  
2. ganacheをインストールして事前に起動しておくこと  
3. ganacheを使ってプライベートネット上にスマートコントラクトをデプロイすること  
4. デプロイしたコントラクトの情報が記載されているJSONファイルをclient/contractsフォルダ内にコピペする。(※重要)  
5. MetaMaskをインストールしておくこと  
6. プライベートネットの秘密鍵をMetaMaskにインポートしておくこと  

## 動かし方

準備ができたら、clientフォルダで下記コマンドを実行する。

npm run start  

http:localhost:3000/ にアクセスすると最初のページが表示されている。  

buildしたい場合は、次のコマンドを打つこと！  
npm run build 

## 参考書籍&参考ページ

<a href="https://www.amazon.co.jp/Solidity%E3%81%A8Ethereum%E3%81%AB%E3%82%88%E3%82%8B%E5%AE%9F%E8%B7%B5%E3%82%B9%E3%83%9E%E3%83%BC%E3%83%88%E3%82%B3%E3%83%B3%E3%83%88%E3%83%A9%E3%82%AF%E3%83%88%E9%96%8B%E7%99%BA-%E2%80%95Truffle-Suite%E3%82%92%E7%94%A8%E3%81%84%E3%81%9F%E9%96%8B%E7%99%BA%E3%81%AE%E5%9F%BA%E7%A4%8E%E3%81%8B%E3%82%89%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4%E3%81%BE%E3%81%A7-Kevin-Solorio/dp/4873119340">実践スマートコントラクト開発</a>

<a href="https://www.amazon.co.jp/%E8%A9%A6%E3%81%97%E3%81%A6%E5%AD%A6%E3%81%B6-%E3%82%B9%E3%83%9E%E3%83%BC%E3%83%88%E3%82%B3%E3%83%B3%E3%83%88%E3%83%A9%E3%82%AF%E3%83%88%E9%96%8B%E7%99%BA-%E5%8A%A0%E5%B5%9C-%E9%95%B7%E9%96%80/dp/4839966885">試して学ぶスマートコントラクト開発</a>

<a href="https://www.amazon.co.jp/%E3%83%9E%E3%82%B9%E3%82%BF%E3%83%AA%E3%83%B3%E3%82%B0%E3%83%BB%E3%82%A4%E3%83%BC%E3%82%B5%E3%83%AA%E3%82%A2%E3%83%A0-%E2%80%95%E3%82%B9%E3%83%9E%E3%83%BC%E3%83%88%E3%82%B3%E3%83%B3%E3%83%88%E3%83%A9%E3%82%AF%E3%83%88%E3%81%A8DApp%E3%81%AE%E6%A7%8B%E7%AF%89-Andreas-M-Antonopoulos/dp/4873118964/ref=pd_lpo_14_img_1/356-2037952-9878221?_encoding=UTF8&pd_rd_i=4873118964&pd_rd_r=09c92823-9be5-4bf0-b266-758aea774cea&pd_rd_w=jlAg1&pd_rd_wg=qolot&pf_rd_p=dc0198fa-c371-4787-b1e2-96ed0e4d45e8&pf_rd_r=W3F72XVVYG5J4E9RR5WV&psc=1&refRID=W3F72XVVYG5J4E9RR5WV">マスタリングイーサリアム</a>

<a href="https://www.amazon.co.jp/%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%E3%83%81%E3%82%A7%E3%83%BC%E3%83%B3-dapp-%E3%82%B2%E3%83%BC%E3%83%A0%E9%96%8B%E7%99%BA%E5%85%A5%E9%96%80-Solidity%E3%81%AB%E3%82%88%E3%82%8B%E3%82%A4%E3%83%BC%E3%82%B5%E3%83%AA%E3%82%A2%E3%83%A0%E5%88%86%E6%95%A3%E3%82%A2%E3%83%97%E3%83%AA%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0-Kedar/dp/4798159689/ref=sr_1_1?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&dchild=1&keywords=dapp&qid=1619923227&s=books&sr=1-1">ブロックチェーン dapp&ゲーム開発入門 Solidityによるイーサリアム分散アプリプログラミング</a>

<a href="https://infura.io/docs/ethereum">INFURA</a>

<a href="https://www.trufflesuite.com/boxes">truffleの公式ページ</a>

<a href="https://www.rinkeby.io/#faucet">Rinkeby Faucet</a>