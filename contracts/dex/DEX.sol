// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; 

import "./../ERC20/MyToken.sol";

// DEX コントラクト
contract DEX {

    event buy(address account, address _tokenAddr, uint256 _cost, uint256 _amount);
    event sell(address account, address _tokenAddr, uint256 _cost, uint256 _amount);
    event swap(address _tokenAddrA, address _tokenAddrB, uint256 _cost, uint256 _amount);
    event createPool(address _tokenAddrA, address _tokenAddrB, uint256 _amountA, uint256 _amountB);

    mapping(address => bool) public supportedTokenAddr;

    address LPTokenAddr = 0xd228A22a2f41273d10Ac871cd675884f72DC85A9;

    /*
    modifier supportsToken(address _tokenAddr) {
        require(supportedTokenAddr[_tokenAddr] == true, "This token is not supported!!");
        _;
    }
    */

    constructor(address[] memory _tokenAddr) {
        for(uint i = 0; i < _tokenAddr.length; i++) {
            supportedTokenAddr[_tokenAddr[i]] = true; 
        }
    }

    function buyToken(address _tokenAddr, uint256 _cost, uint _amount) public payable {
        MyToken token = MyToken(_tokenAddr);
        
        require(msg.value >= _cost, "Insufficient fund");
        require(token.balanceOf(address(this)) >= _amount, "Token sold out");
        // call transfer method
        token.transfer(msg.sender, _amount);
        emit buy(msg.sender, _tokenAddr, _cost, _amount);
    }

    function sellToken(address _tokenAddr, uint256 _cost, uint _amount) public {
        MyToken token = MyToken(_tokenAddr);
        
        require(token.balanceOf(msg.sender) >= _cost, "Insufficient token balance");
        require(address(this).balance >= _amount, "DEX does not have enough funds");
        token.transferFrom(msg.sender, address(this), _cost);
        (bool success, ) = payable(msg.sender).call{ value: _amount}("");
        require(success, "ETH transfer failed");
        emit sell(msg.sender, _tokenAddr, _cost, _amount);
    }

    function swapToken(address _tokenAddrA, address _tokenAddrB, uint256 _cost, uint256 _amount) external {
        sellToken(_tokenAddrA, _cost, 0);
        buyToken(_tokenAddrB, 0, _amount);
        emit swap(_tokenAddrA, _tokenAddrB, _cost, _amount);
    }

    function createLiquidityPool(address _tokenAddrA, address _tokenAddrB, uint256 _amountA, uint256 _amountB) external {
        MyToken tokenA = MyToken(_tokenAddrA);
        MyToken tokenB = MyToken(_tokenAddrB);
        MyToken LPToken = MyToken(LPTokenAddr);

        require(tokenA.balanceOf(msg.sender) >= _amountA, "Insufficient tokenA balance");
        require(tokenB.balanceOf(msg.sender) >= _amountB, "Insufficient tokenB balance");
        tokenA.transferFrom(msg.sender, address(this), _amountA);
        tokenB.transferFrom(msg.sender, address(this), _amountB);       
        LPToken.mint(msg.sender, (_amountA + _amountB) / 2);
        emit createPool(_tokenAddrA, _tokenAddrB, _amountA, _amountB);
    }
}