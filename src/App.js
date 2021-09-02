import "./styles.css";
import React from 'react';
import {ethers} from 'ethers';
import {ChainId,Fetcher,WETH,Route,Trade,TradeType,TokenAmount,Percent} from '@uniswap/sdk';
export default function App() {
  const chain_id = ChainId.MAINNET;
  const token_address = "0x6b175474e89094c44da98b954eedeac495271d0f";

  const exchange=async(e)=>{
    //getting the values for weth to dai
    e.preventDefault();
    const dai = await Fetcher.fetchTokenData(chain_id,token_address);
    const weth = WETH[chain_id];
    const pair = await Fetcher.fetchPairData(dai,weth);
    console.log(pair);
    const route = new Route([pair],weth);
    const trade = new Trade(route,new TokenAmount(weth,'100000000000000000'),TradeType.EXACT_INPUT)
    //transaction
    transaction(trade,weth,dai);
  }
  const transaction=async(trade,weth,dai)=>{
    const sliperage_tolerance = new Percent('50','10000');
    const amount_min = trade.minimumAmountOut(sliperage_tolerance).raw
    //console.log(amount_min);
    const path=[weth.adddress,dai.address]
    const to="0xfE82bd76D51CB166BcFF79e6fEf9BC4F5d24f989";
    const value=trade.inputAmount.raw
    console.log("value is "+value)
    const deadline=Math.floor(Date.now()/1000)+60*20;
    //ether connection
    const private_key="59ab5cd377962a3a824c71b7205006eb88b37be02ecb13ab48902efdf5040576";
    const provider = ethers.getDefaultProvider("kovan");
    const signer= new ethers.Wallet(private_key);
    const account = signer.connect(provider)
    const wallet = new ethers.Wallet(private_key,provider);
    console.log(wallet) 
    const uniswap = new ethers.Contract(
      '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      ['function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'],
      account
    );
    console.log(uniswap)
    const txn = await uniswap.swapExactETHForTokens(
      amount_min,
      path,
      to,
      deadline,
      {value}
    )
    console.log(txn)
  }
/*
  const send=(e)=>{
    e.preventDefault();
    const private_key="59ab5cd377962a3a824c71b7205006eb88b37be02ecb13ab48902efdf5040576";
  const provider = ethers.getDefaultProvider("kovan");
  
  const wallet = new ethers.Wallet(private_key,provider);
  console.log(wallet) 
  
  let balance_promise = wallet.getBalance();
  balance_promise.then((balance)=>console.log(balance))
    let amount = ethers.utils.parseEther('0.1');
    let txn = {
      to:"0xfE82bd76D51CB166BcFF79e6fEf9BC4F5d24f989",
      value:amount
    }
    let send = wallet.sendTransaction(txn);
    send.then((tx)=>console.log(tx))
  }
  */

  console.log("i am there")
  return (
    <div className="App">
      <button onClick={(e)=>exchange(e)} >Me</button>
    </div>
  );
}
//to :- 0xfE82bd76D51CB166BcFF79e6fEf9BC4F5d24f989
