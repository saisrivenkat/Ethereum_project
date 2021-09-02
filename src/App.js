import "./styles.css";
import React from 'react';
import {ethers} from 'ethers';
import {ChainId,Fetcher,WETH,Route,Trade,TradeType,TokenAmount,Percent} from '@uniswap/sdk';
export default function App() {
  const chain_id = ChainId.MAINNET;
  const token_address = "DAI token address";

  const exchange=async(e)=>{
    //getting the values for weth to dai
    e.preventDefault();
    const dai = await Fetcher.fetchTokenData(chain_id,token_address);
    const weth = WETH[chain_id]; // weth token address
    const pair = await Fetcher.fetchPairData(weth,dai);
    console.log(pair);
    const route = new Route([pair],weth);
    const trade = new Trade(route,new TokenAmount(weth,'1000000000000000'),TradeType.EXACT_INPUT)
    //transaction
    console.log(route)
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
    const private_key="PRIVATE_KEY";
    const provider = ethers.getDefaultProvider("kovan");
    const signer= new ethers.Wallet(private_key);
    const account = signer.connect(provider)
    const wallet = new ethers.Wallet(private_key,provider);
    console.log(wallet) 
    const amount_in = ethers.utils.parseUnits('0.1','ether')
    const uniswap = new ethers.Contract(
      '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      ['function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
      'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
  ],
      account
    );
    const amount_out = await uniswap.getAmountsOut(amount_in, [weth.address,dai.address]);
    console.log(amount_out) //here only i am getting error
    /*error:- call revert exception (method="getAmountsOut(uint256,address[])", errorArgs=["UniswapV2Library: INSUFFICIENT_LIQUIDITY"], errorName="Error", errorSignature="Error(string)", reason="UniswapV2Library: INSUFFICIENT_LIQUIDITY", code=CALL_EXCEPTION, version=abi/5.4.1)
5 stack frames were coll*/
  }
  return (
    <div className="App">
      <button onClick={(e)=>exchange(e)} >Me</button>
    </div>
  );
}
//to :- 0xfE82bd76D51CB166BcFF79e6fEf9BC4F5d24f989
/*
const txn = await uniswap.swapExactETHForTokens(
      amount_min,
      path,
      to,
      deadline,
      {value}
    )
    console.log(txn)
*/