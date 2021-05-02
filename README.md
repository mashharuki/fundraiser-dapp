# 資金調達Web3.0アプリケーションリポジトリ(Dapp用のフレームワークアプリ)

MetaMaskとWeb3.js、スマートコントラクトとReact.jsから構築されています。

土台部分については、下記コマンドにより生成

 truffle unbox react
 
solcのバージョン情報等については、truffle-config.jsを参照ください。

## clientフォルダ直下で実行するコマンド
npm i  

npm install openzeppelin-solidity --save  
npm install --save react-router-dom

## テストコードを実行するコマンド(fundraiser-dappフォルダ直下で実行する)

truffle test

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
