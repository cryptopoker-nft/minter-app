import React, {useState} from "react";

import { useDebounce } from 'use-debounce'
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi'
import { parseEther } from 'viem';

import { faucetContract } from "../../js/modules/contracts";

export function TipJar({chainId}) {

	// console.log(chainId);
	let cur = "MATIC";
	let chain = "POLYGON";
	let cpSafeWalletPolygon = "0xC3DDF7AFDE9Fc8Bec6af792C44dd801534aB1385";

	let cpSafeWalletOptimism = "0xa9786A0c49993898820f9882364d8bFeFe329e86";
	let cpSafeWalletArbitrum = "0x9d41BC83EF4f9154808F086b0F31eE6DeFd882f5";
	let cpSafeWalletBase = "0x522d634b6BFfb444FdbCdE5932738995A4cfd1F1";

	let safeWallet;

	if(chainId=== 8453) {
		safeWallet = cpSafeWalletBase;
		cur = "ETH";
		chain = "BASE MAINNET";

	} else if(chainId=== 10) {

		safeWallet = cpSafeWalletOptimism;
			// OPTIMISM
		cur = "ETH";
		chain = "OPTIMISM";

	} else if(chainId=== 137) {
		safeWallet = cpSafeWalletPolygon;

		
	} else if(chainId === 42161) {
		// no go
		cur = "ETH";
		chain = "ARBITRUM ONE";
		safeWallet = cpSafeWalletArbitrum;
	}

	const [to, setTo] = React.useState('');
	const [debouncedTo] = useDebounce(to, 500);
	const [amount, setAmount] = React.useState('');
	const [debouncedAmount] = useDebounce(amount, 500);

	const { config } = usePrepareSendTransaction({
		to: debouncedTo,
		value: debouncedAmount ? parseEther(debouncedAmount) : undefined,
		
	});
	const { data, sendTransaction } = useSendTransaction(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash,
		onSuccess(data) {
			console.log('Success', data)
		},
	});

	function GetHashLink() {
		switch(chain) {
			case "POLYGON":
				return (<a target="_blank" href={`https://polygonscan.io/tx/${data?.hash}`}>PolygonScan</a>)
				break;
			case "OPTIMISM":
				return (<a target="_blank" href={`https://optimistic.etherscan.io/tx/${data?.hash}`}>Etherscan</a>)
				break;
			case "ARBITRUM ONE":
				return (<a target="_blank" href={`https://arbiscan.io/tx/${data?.hash}`}>Arbiscan</a>)
				break;
			case "BASE MAINNET":
				return (<a target="_blank" href={`https://basescan.org/tx/${data?.hash}`}>BaseScan</a>)
				break;
			default:
				return (<a target="_blank" href={`https://polygonscan.io/tx/${data?.hash}`}>PolygonScan</a>)

		}
	}



	// console.log(sendTransaction);
	// console.log(isLoading, !sendTransaction, !to, !amount);		// need all false for button enabled

	return (
	<form id="tipJar"
		onSubmit={(e) => {
		console.log("Submit Clicked...");
		e.preventDefault()
		sendTransaction?.()
	}}>
		<p>Like the idea? <b>Want to see more?</b> Tip the Team some gas on {chain} below.</p>
		<p>Copy &amp; Paste this Addr: {safeWallet}, then choose your tip amount, then click send to trigger a wallet request.</p>
		<div className="rowLine">
			<input 
				aria-label="Recipient" 
				placeholder="0xA0Cf…251e" 
				onChange={(e) => setTo(e.target.value)}
				value={to}
			/>
			<input 
				aria-label={"Amount" + cur}
				placeholder={cur==="MATIC" ? "0.10" : "0.001"} 
				onChange={(e) => setAmount(e.target.value)}
				value={amount}
			/>
			<button disabled={isLoading || !sendTransaction || !to || !amount}>
				{isLoading ? 'Sending...' : 'Send'}
			</button>
		</div>
		<p>We're a small team of volunteers, curently unfunded. Every little bit helps!</p>

		{isSuccess && (
			<div>
				Successfully sent {amount} {cur} to {to}
				<div>
					<GetHashLink />


				</div>
			</div>
		)}
		{isLoading && <div className="colorYellow">Check Wallet</div>}
		{isSuccess && <><div className="colorOrange">THANKS YOU'RE THE BEST!</div><div className="colorYellow">Transaction: {JSON.stringify(data)}</div></>}
	
	</form>
	)
}
