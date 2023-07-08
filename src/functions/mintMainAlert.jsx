import React from "react";

export function mintMainAlert() {

    return (
    <div id="mint-main-alert" className='alert alert-success' role='alert'>
        <h4 className='alert-heading'>Hand Mint In Progress...</h4>  
        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' className='bi bi-exclamation-triangle-fill flex-shrink-0 me-2' viewBox='0 0 16 16' role='img' aria-label='Warning:'>
        <path d='M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z'/>
        </svg>
        <h4>1. CPT Received! You have triggered a new deck to be built in the aether and five cards will be drawn at random and constructed programatically into your Hand NFT. </h4>
        <p>Hand odds should be equivalent to any random hand drawn from a freshly shuffled deck.</p>
        <h3>2. Your payment has enabled the Deal Hand Button above. Click and hold it to get the infinite machine to generate your IPFS artwork and NFT metadata.</h3>
        <h4>3. You may now press the "Mint Button" to enshrine your collectible poker hand on the blockchain. You will be asked to pay a gas cost to create your new NFT, and will receive 1 Cryptopoker Hand in exchange!</h4>
        
        <hr /><p><strong>Please wait for mint transaction request to be sent by your wallet.</strong>.</p>
        
        <ol>
            <li>Your hand has been dealt and then stored to ipfs.</li>
            <li>Your NFT and stored metadata will be sent to a contract to mint your NFT. This contract <strong>requires gas to mint</strong> as your NFT wil be permanantly associated to your address and stored in the blockchain.</li>
            <li>After your trasaction has been confirmed, you will be able to reveal your NFT by flipping each of the five cards individually. You will then be shown a local representation of your NFT image and you will be given the option to play or fold your hand.</li>
            <li>Fail Safe: You can always see your hand NFT in your dashboard after a successful mint, even if you do not play the reveal animation.</li>
            <li>Hands can be viewed on OpenSea for trade or selling or folded at any time from the <strong>user dashboard</strong></li>
        </ol>
        <hr />
        <p className='mb-0'>Choose wisely! You may not mint more hands if you currently hold more than 4 hands in your wallet. Good luck!</p>
        <button type='button' className='btn-close' data-bs-dismiss='alert' aria-label='Close' onClick={console.log("Set permanant dismissal of mint-main-alert = true")} />
    </div>
    );
}
