import React, { useState } from 'react';

import { faucetContract } from '../../js/modules/contracts';

// import { useDebounce } from 'use-debounce'
// import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi'
// import { parseEther } from 'viem'

// import { useAccount } from 'wagmi';

// export function SendTransaction() {

// 	const [to, setTo] = React.useState('');
// 	const [debouncedTo] = useDebounce(to, 500);
//   	const [amount, setAmount] = React.useState('');
// 	const [debouncedAmount] = useDebounce(amount, 500);

// 	const { config } = usePrepareSendTransaction({
// 		request: {
// 		  	to: debouncedTo,
// 		  	value: debouncedAmount ? parseEther(debouncedAmount) : undefined,
// 		},
// 	});
// 	const { data, sendTransaction } = useSendTransaction(config);

// 	const { isLoading, isSuccess } = useWaitForTransaction({
// 		hash: data?.hash,
// 	});

// 	console.log(sendTransaction);
// 	console.log(isLoading, !sendTransaction, !to, !amount);

// 	return (
// 	  <form onSubmit={(e) => {
// 		console.log("Submit Clicked...");
//         e.preventDefault()
//         sendTransaction?.()
//       }}>
// 		<input 
// 			aria-label="Recipient" 
// 			placeholder="0xA0Cf…251e" 
// 			onChange={(e) => setTo(e.target.value)}
// 			value={to}
// 		/>
// 		<input 
// 			aria-label="Amount (ether)" 
// 			placeholder="0.05" 
// 			onChange={(e) => setAmount(e.target.value)}
// 			value={amount}
// 		/>
// 		<button disabled={isLoading || !to || !amount}>
// 			{isLoading ? 'Sending...' : 'Send'}
// 		</button>
// 		{isSuccess && (
// 			<div>
// 				Successfully sent {amount} MATIC to {to}
// 				<div>
// 					<a href={`https://polygonscan.io/tx/${data?.hash}`}>PolygonScan</a>
// 				</div>
// 			</div>
// 		)}
// 	  </form>
// 	)
//   }

export function ClaimInfo() {

	// const { isConnected } = useAccount();

	/**  </li><li>Players with the best hands are rewarded with game profits to their connected wallet address.</li> **/

	return (<>
		<hr />
		<div id="claimContent">
			<h3>What you get when buying in:</h3>
			<ul>
				<li>Refill to 5 CPT<br />(you cannot always claim FREE tokens, you cannot mint while holding 5 hands)</li>
				<li>One <strong>CP Hand NFT</strong> can be minted for each CP Token you hold.</li>
				<li>The game receives fees based on the number of plays (base mint fee).</li>
				<li>BaseFee will be dynamic in the game and will increase as the total number of hands minted reaches the maximum number, so plan your trades, folds and rebuys carefully to get the most from your buys.</li>
				<li>Pay attention to current game specs as each CP game can have specific proceeds allocations, prizing requirements and awards. DYOR.</li>
			</ul>
		</div>
		<hr />
	</>);

}