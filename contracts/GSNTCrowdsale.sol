// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Token.sol";

contract Gsntcrowdsale {
    address public owner;
    Token public token;
    uint256 public price;
    uint256 public maxTokens;
    uint256 public tokensSold;
    uint256 public minPurchase;
    uint256 public maxPurchase;
    uint256 public crowdsaleOpened;
    uint256 public crowdsaleClosed;
    uint256 public goal;
    address[] public tokenHolders;

    event Buy(uint256 amount, address buyer);
    event Finalize(uint256 tokenSold, uint256 etherRaised);
    event Refund(address to, uint256 ethRefunded);

    mapping(address => bool) public whitelist;
    mapping(address => uint256) public tokenBalances;

    constructor(
        Token _token, 
        uint256 _price, 
        uint256 _maxTokens, 
        uint256 _minPurchase,
        uint256 _maxPurchase,
        uint256 _crowdsaleOpened,
        uint256 _crowdsaleClosed,
        uint256 _goal
        ) {
        token = _token;
        price = _price;
        maxTokens = _maxTokens;
        owner = msg.sender;
        minPurchase = _minPurchase;
        maxPurchase = _maxPurchase;
        crowdsaleOpened = _crowdsaleOpened;
        crowdsaleClosed = _crowdsaleClosed;
        goal = _goal;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller must be owner");
    _;
    }

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender] == true, 'You have to be in the whitelist to buy tokens');
        _;
    }

    receive() external payable {
        uint256 amount = msg.value / price;
        buyTokens(amount * 1e18);
    }

    function addToWhitelist(address _address) public onlyOwner {
        whitelist[_address] = true;
        tokenHolders.push(_address);
    }

    function buyTokens(uint256 _amount) public payable onlyWhitelisted {
        require(block.timestamp >= crowdsaleOpened, 'Crowdsale is not open yet');
        require(block.timestamp < crowdsaleClosed, 'Crowdsale has ended');
        require(token.balanceOf(address(this)) >= _amount);
        require(_amount >= minPurchase, 'You have to buy more tokens');
        require(_amount <= maxPurchase, 'You cannot buy that many tokens');
        require(msg.value == (_amount / 1e18) * price);
        require(token.transfer(msg.sender, _amount));
        tokenBalances[msg.sender] += _amount;

        tokensSold += _amount;

        emit Buy(_amount, msg.sender);
    }

    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

    function _refund() internal {
        for(uint256 i = 0; i < tokenHolders.length; i++) {
            address holder = tokenHolders[i];
            uint256 balance = tokenBalances[holder];
            if (balance > 0) {
                uint256 ethRefundAmount =  balance * price / 1e18;
                (bool sent, ) = holder.call{value: ethRefundAmount}('');
                require(sent, "Failed to refund ether");
                    
                tokenBalances[holder] = 0;

                emit Refund(holder, ethRefundAmount);
            }
        }
    }

    function finalize() public onlyOwner {
        require(block.timestamp > crowdsaleClosed, "Crowdsale has not ended yet");
        // If goal is not met, refund ether to token holders.
        if (tokensSold > goal) {
        require(tokensSold >= goal, 'Crowdsale goal has not been met');
        //Send remaining tokens to crowdsale creator.
        require(token.transfer(owner, token.balanceOf(address(this))));
        //Send Ether to crowdsale creator.
        uint256 value = address(this).balance;
        (bool sent, ) = owner.call{value: value}('');
        require(sent);

        emit Finalize(tokensSold, value);
        } else {
            _refund();
        }
    }
}