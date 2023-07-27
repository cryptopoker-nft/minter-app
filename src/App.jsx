// import 'dotenv/config';
import React, { useState } from 'react';
//wagmi
import { configureChains, 
  createConfig, 
  WagmiConfig
   } from 'wagmi';
import { polygon, optimism, arbitrum } from 'wagmi/chains';		// mainnet, arbitrum
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { base } from './data/customChains.jsx';		// mainnet, arbitrum

//rainbow
import {
    getDefaultWallets,
    RainbowKitProvider,
    lightTheme,
    darkTheme,
    midnightTheme
  } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import {ALCHEMY_KEY_POLYGON, WC_ID} from './data/env.jsx';

// components
import { MainContent } from './views/MainContent.jsx';

const ALCHEMY_API_KEY = ALCHEMY_KEY_POLYGON;       
const WC_PROJECT_ID = WC_ID;

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[polygon, optimism, arbitrum, base],
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


export default function App() {
  // global object variables APP STATE
  // const [chainId, setChainId] = useState( null );   // chain is fist as it determines contract
  // // chainId is also added to cc for later reference
  // const [cc, setCc] = useState(null);           // contract data
  // const [cu, setCu] = useState(null);          // connected user data 
  // const [page, setPage] = useState("home");


  return (
      <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider 
            chains={chains}
            coolMode 
            theme={midnightTheme({
              accentColor: '#E57E3A',  //color of wallet  try #703844
              accentColorForeground: 'black', //color of text
              borderRadius: 'large', //rounded edges
              fontStack: 'rounded',  
              overlayBlur: 'small',
            })}
          >  
            <MainContent 
              // setCu={setCu}
              // cu={cu}
              // setCc={setCc}
              // cc={cc}
              // page={page}
              // setPage={setPage}
              // chainId={chainId}
              // setChainId={setChainId}
            />
          </RainbowKitProvider>
      </WagmiConfig>
  );
}