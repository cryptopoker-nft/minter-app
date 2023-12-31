import React from 'react';

export var homeAccordion = (
    <div className="accordion" id="accordionDisplay">
		<div className="accordion-item">
		    <h2 className="accordion-header" id="headingThree">
		      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
		        Games In Play:
		      </button>
		    </h2>
		    <div id="collapseThree" className="accordion-collapse collapse show" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
		      <div className="accordion-body">
		      	<div className="prizes">
                    <h2 className="prize-title">Top Hand Minted</h2>
                    <h3 className="prize-copy-link">
                        <a href="https://bankless.community">WIN 1000 BANK.</a>
                    </h3>
                    <h4 className="prize-copy-extra">Claim FREE CPT tokens to get started<sup>*</sup></h4>
                    <h2 className="prize-title">Top Score of <strong>5 hands</strong> </h2>
                    <h3 className="prize-copy-link">
                        <a href="https://bankless.community">WIN 10,000 BANK.</a>
                    </h3>
                    <h4 className="prize-copy-extra">Top Scores Rewarded at Mint Out or Game End</h4>
                </div>
		        <ul className='gameHomeContainer'></ul>
		      </div>
		    </div>
		</div>
		<div className="accordion-item">
		    <h2 className="accordion-header" id="headingOne">
		      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
		        Goals for Suite 0
		      </button>
		    </h2>
		    <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
		      <div className="accordion-body">
		        <ul>
                    <li><strong>Introduce/test fundamental cryptopoker mechanics:</strong> 
                    <ul>
                        <li>Buy-in to game with Tokens (on-chain CP tokens)</li>
						<li>Claim 5 CPT daily - gas cost only</li>
                        <li>Use Tokens to Mint Hands - gas + basefee</li>
                        <li>Collect and Manage/Burn Hands</li>
						<li>Trade Hands on OpenSea</li>
						<li>Track Scores in dApp</li>
						<li>Play every day to improve your ranking and chance to win!</li>

                    </ul>
                    </li>
		            <li><strong>Introduce/practice fundamental web3 mechanics (in an easy environment):</strong></li> 
                    <ul>
                        <li>Get a web3 Address and wallet (<a className="colorOrange" href="https://app.banklessacademy.com" target="_blank">wallet onboarding guide via Bankless Academy</a>)</li>
                        <li>Connect your wallet to a dApp with your public address to sign-in and interact with the app.</li>
                        <li>Claim FREE airdrop tokens (individual limits applied daily)</li>
                        <li>Spend Tokens and pay Gas to MINT NFTs for the game</li>
                        <li>Manage/Burn NFTs in dApp and TRADE NFTs on OpenSea</li>
                        <li><strong>DYOR</strong> if plays beyond free make sense for you</li>
                        <li><strong>HODL</strong> your hands and wait for the end of the game prizing to be announced</li>
                    </ul>

		            <li><strong>Internal:</strong> Gather data for prizing potential of future games</li>
		            <li><strong>Internal/external:</strong> Assess game mechanics and potential for how to compromise the simple game mechanics.</li>
		            <li><strong>First Suite of Games:</strong> Gather a "whitelist" of connected wallet addresses from players as basis for future game launches.</li>
		            <li>Provide UI for dApp baseline</li>
                </ul>
                <hr />
		        <p style={{textAlign:"center"}}>
                    <strong>BUG BOUNTY:</strong> Submit a feedback report on your use of the app and you will earn 125 BANK tokens (once per player). <a href="mailto:help@justplay.cafe?subject=Cryptopoker%20Minting%20DApp%20-%20Feeedback-Report&body=WALLET ADDRESS: FEEDBACK REPORT: ">FEEDBACK REPORT</a>.
                </p>
                
                <hr />

		        <p style={{textAlign:"center"}}>
                    <strong>Need help? email us at <a href="mailto:help@justplay.cafe?subject=Cryptopoker%20Minting%20DApp%20-%20Help">help@justplay.cafe</a>.</strong>
                </p>
		      </div>
		    </div>
		</div>
		<div className="accordion-item">
		    <h2 className="accordion-header" id="headingTwo">
		      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
		        Instructions for the game
		      </button>
		    </h2>
		    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
		      <div className="accordion-body">

				<div className='instructions-buttons'>
					<a href="https://cryptopoker.justplay.cafe/downloads/cp-mobile-guide.pdf" target="_blank" className="btn btn-primary">Instruction Guide - PDF</a>
					<a href="https://youtube.com/playlist?list=PLHwKd_H8ewQ4na_cdP-iXIw32Sc1m8SUr" target="_blank" className="btn btn-primary">Playthrough - Videos</a>

				</div>

		        <ul>
		        	<li>You may only hold a combined total of 5 NFT hands. No minting if you hold 5 or more!</li>
					<li>First 5 tokens daily per wallet address connected are free to claim from the faucet (while supplies last). </li>
					<li>This a trade and collect NFT game, based on generative art minted hands that carry <a href="https://en.wikipedia.org/wiki/Poker_probability" target="_blank">common rarity rankings based on poker hands</a>.</li>
					<li>We hope this is the first of many games from our studio on this platform, so stay tuned for more games coming soon using cpNFT as input tokens. </li>
					{/* <li>Would like to keep the distribution phase of the game to be as broad as possible. Hopefully making possible a distribution of some percentage of the contract earnings to <strong>all players of the game</strong>.</li>
					<li>Subsequent token claims beyond the first one will incur an increasing buy-in cost. This game payments, along with after mint trades via openSea, will form the basis for future game prizing and continued development of new games and features.</li>
					<li>Would like to look into contract level storage of the assets into a yield-generating strategy to match the asset being depositied (i.e. ETH, MATIC, BANK, etc.)</li> */}
                </ul>
		      </div>
		    </div>
		</div>
		<div className="accordion-item">
		    <h2 className="accordion-header" id="headingFour">
		      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
		        Upcoming Games
		      </button>
		    </h2>
		    <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
		      <div className="accordion-body">
				<ul>
					<li><a href="https://twitter.com/BuildOnBase" target='_blank'>BASE ...</a></li>
					<li><a href="https://twitter.com/pgn_eth" target='_blank'>PGN ...</a></li>
					<li>
						{/* <a href="#" target='_blank'> */}
							MORE Coming Soon...
						{/* </a> */}
					</li></ul>
		      </div>
		    </div>
		</div>
	</div>);