// NEW WC Code 6/5/23

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'

import { configureChains, createConfig } from '@wagmi/core'
import { polygon, mainnet, optimism } from '@wagmi/core/chains'


import { connect, fetchEnsName } from '@wagmi/core'
import { InjectedConnector } from '@wagmi/core/connectors/injected'

// import { mainnet, optimism, polygon } from '@wagmi/core/chains'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'



// 1. Define constants
// cryptopoker-NFT project: 82f2b17442f9a96a77a7b971a1cb59ae
const projectId = 'ac7d670d228dfe2e6e2dda56b4c7082d'        // get this from walletConnect
const alchemyAPI = 'H142mkJS2UCpceoBqIqldBYr-hRkDyPR';      // hopefully this is the fix! USE IN VIEM
const myChains = [polygon, mainnet, optimism];

// NEW wagmiConfig

const { publicClient } = configureChains(myChains, [w3mProvider({ projectId })])



// 2. Configure wagmi client
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, myChains }),
  // connectors: [
    
  //   new WalletConnectConnector({
  //     myChains,
  //     options: {
  //       projectId: projectId,
  //     },
  //   }),
  //   new InjectedConnector({ myChains }),
  //   // w3mConnectors({ projectId, version: 1, myChains }),
  // ],
  publicClient
})

// 3. Create ethereum and modal clients
export const ethereumClient = new EthereumClient(wagmiConfig, myChains)
export const web3Modal = new Web3Modal(
  {
    projectId,
    defaultChain: polygon,
  },
  ethereumClient
)

// export const connector = new WalletConnectConnector({
// 	chains: [mainnet, optimism, polygon],
// 	options: {
// 	  projectId: 'ac7d670d228dfe2e6e2dda56b4c7082d',
// 	},
// })

// console.log(window.ethereum);   // can we get this here?

  //let mm = new InjectedConnector()
// generate a connection request.
// const { address } = await connect({
// 	connector: connector,
//   })
// const ensName = await fetchEnsName({ address });
// console.log(ensName);


console.log("End of modmain.js")
