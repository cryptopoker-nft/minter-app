import React from "react";

import { useDebounce } from 'use-debounce'
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi'
import { parseEther } from 'viem';

import { faucetContract } from "../../js/modules/contracts";

export function MySendTransaction() {

	let cpSafeWalletPolygon = "0xC3DDF7AFDE9Fc8Bec6af792C44dd801534aB1385";

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

	// console.log(sendTransaction);
	// console.log(isLoading, !sendTransaction, !to, !amount);		// need all false for button enabled

	return (
	  <form onSubmit={(e) => {
		console.log("Submit Clicked...");
        e.preventDefault()
        sendTransaction?.()
      }}>
        <p>Like the idea? <b>Want to see more?</b>Tip the Team on Polygon below.</p>
		<p>Copy &amp; Paste this Addr: {cpSafeWalletPolygon}, then choose your tip amount.</p>
		<input 
			aria-label="Recipient" 
			placeholder="0xA0Cf…251e" 
			onChange={(e) => setTo(e.target.value)}
			value={to}
		/>
		<input 
			aria-label="Amount (ether)" 
			placeholder="0.05" 
			onChange={(e) => setAmount(e.target.value)}
			value={amount}
		/>
		<button disabled={isLoading || !sendTransaction || !to || !amount}>
			{isLoading ? 'Sending...' : 'Send'}
		</button>
        <p>We're a small team of volunteers, curently unfunded. Every little bit helps!</p>

		{isSuccess && (
			<div>
				Successfully sent {amount} MATIC to {to}
				<div>
					<a href={`https://polygonscan.io/tx/${data?.hash}`}>PolygonScan</a>
				</div>
			</div>
		)}
		{isLoading && <div>Check Wallet</div>}
      	{isSuccess && <><div>THANKS YOU'RE THE BEST!</div><div>Transaction: {JSON.stringify(data)}</div></>}
	  </form>
	)
}
