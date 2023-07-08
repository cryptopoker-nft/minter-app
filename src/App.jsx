// import 'dotenv/config';
import React, { useState, useEffect } from 'react';
//wagmi
import { configureChains, 
  createConfig, 
  WagmiConfig, 
  useAccount, 
  useConnect, 
  useDisconnect } from 'wagmi';
import { polygon, optimism } from 'wagmi/chains';		// mainnet, arbitrum
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { formatEther } from 'viem';
//rainbow
import {
    getDefaultWallets,
    RainbowKitProvider,
    ConnectButton
  } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';



// import { cpDepositContract, cpDepositABI, cpContractPolygon, cpABIPolygon } from "../js/modules/contracts.js";	

//uniswap
// import { SwapWidget } from '@uniswap/widgets';
// import '@uniswap/widgets/fonts.css';

const ALCHEMY_API_KEY = 'H142mkJS2UCpceoBqIqldBYr-hRkDyPR';
const WC_PROJECT_ID = 'ac7d670d228dfe2e6e2dda56b4c7082d';


const { chains, publicClient, webSocketPublicClient } = configureChains(
	[polygon, optimism],
	[
	  alchemyProvider({ apiKey: ALCHEMY_API_KEY }),
	  publicProvider()
	]
);
  
// use walletconnect projectId to connect
const { connectors } = getDefaultWallets({
    appName: 'Cryptopoker Dealr dApp',
    projectId: WC_PROJECT_ID,
    chains
});

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient
});

import { MainNav } from './components/mainNav.jsx';
import { UIArea } from './components/uiArea.jsx';

// import { Home } from './views/home.jsx';
import { renderNav } from './views/renderNav.jsx';
import { MainAppLogo } from './components/mainAppLogo.jsx';

import { myClient, checkName, checkSymbol, checkCount, getURI, getOwner, 
  getBalance, getTreasury,
  myWalletClient, getCptBalance } from "../js/viemConnect.js";

import { cpMetaBak } from './data/cpMeta.jsx';     // backup data for API server call



const MainContent = ({cu, setCu, setCc, cc}) => {
	const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
	const { disconnect } = useDisconnect();

  const [page, setPage] = useState("home");

  // only set data values if it has a connected account,and is unchanged
  useEffect(() => {

    if(!cu && isConnected){

      // declare the data fetching function
      const fetchData = async () => {
          const tokenNum = Number( await getCptBalance(address) ) / 10**18;
          const currentTreasury = await getTreasury();

          let pc = [...new Set(cpMetaBak.map(item => item.owner))];

          // current contract data
          let cc_data = {
            name: await checkName,
            symbol: await checkSymbol,
            count: Number(await checkCount),
            cpMeta: cpMetaBak,
            playerCount: pc.length,
            currentTreasury: currentTreasury,
          }

          //setState Data for global variables goes here
          console.log("setting cc for: ",cc_data);   // use API servver?
          console.log("setting cu for : "+address);

          let handNum = Number( await getBalance(address) );

          setCu({ address: address, isConnected: isConnected, cpTokens: tokenNum, handNum:handNum });    // assign address of connected account to cu object
          setCc(cc_data);        // assign contract data calls to cc object

          // ASYNC set the token umber in the UI area.
          // console.log(document.getElementById("token-num"), tokenNum);
          let tokenUI = document.getElementById("token-num")
          if(tokenUI){
            tokenUI.innerHTML = tokenNum;
          }


      }

      // call the ASYNC data function
      fetchData().catch(console.error);          
  
    }
  }, []);

  return ( <div className="container" id="main-container">
            <div className="row">
                <div className="col" id="main-column">

                  <MainAppLogo />

                  { isConnected && cu ? 
                    <>
                      <UIArea cu={cu} setPage={setPage} />
                    </> 
                    : <>
                      <ConnectButton />
                      
                    </> }
                  { /* is dynamic connection to rainbow wallet */ }

                  {/* this handles the setting of the correct page when selected */}
                  { renderNav(page, setPage, cu, cc) }

                  <MainNav setPage={setPage} />
                  
                  <div id="footerArea">
                    <div id="pageSocial"></div>
                  </div>
                
                </div>
            </div>
        </div> );
};

export default function App() {
  // global object variables
  const [cu, setCu] = useState(null);
  const [cc, setCc] = useState(null);

  return (
      <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>  
            <MainContent 
              setCu={setCu}
              cu={cu}
              setCc={setCc}
              cc={cc}
            />
          </RainbowKitProvider>
      </WagmiConfig>
  );
}