import { faucetContract, cpDepositContract, cpDepositABI, cptAddress, cpContractPolygon, cpABIPolygon, faucetABI, cptABI } from "./modules/contracts.js";			// this is to pull the chain-specific contracts and ABIs as needed.

// VIEM PUBLIC CLIENT
import { createPublicClient, createWalletClient, http, webSocket, formatEther } from 'viem'
import { polygon, optimism } from 'viem/chains'

// import 'dotenv/config';

// console.log(process.env);

// console.log(import.meta.env);
// console.log(import.meta.env.ALCHEMY_KEY);

// SWITCH TO ALCHEMY RPC
const alchemyAPI = 'H142mkJS2UCpceoBqIqldBYr-hRkDyPR';      // hopefully this is the fix!

// transport: http('https://eth-mainnet.g.alchemy.com/v2/<apiKey>')

const alchemy = http('https://polygon-mainnet.g.alchemy.com/v2/' + alchemyAPI);
const infura = http('https://polygon-mainnet.infura.io/v3/2ExAf0dbHMckoGiA5DpxUk59mYX');
const lastChance = http();

const alWs = webSocket('wss://polygon-mainnet.g.alchemy.com/v2/' + alchemyAPI);

// VIEM PUBLIC CLIENT
export const myClient = createPublicClient({
    chain: polygon,
    transport: alWs,
})

// VIEM WALLET CLIENT
export const myWalletClient = createWalletClient({
    chain: polygon,
    transport: alWs,		// fallback to infura if alchemy fails

});



// EXPORT contract direct calls
export const checkName = myClient.readContract({
    address: cpContractPolygon,
    abi: cpABIPolygon,
    functionName: 'name',
    args: []
})

export const checkSymbol = myClient.readContract({
    address: cpContractPolygon,
    abi: cpABIPolygon,
    functionName: 'symbol',
    args: []
})

export const checkCount = myClient.readContract({
    address: cpContractPolygon,
    abi: cpABIPolygon,
    functionName: 'count',
    args: []
  })


// get data using provided inputs
export function getURI(id) {
    return myClient.readContract({
        address: cpContractPolygon,
        abi: cpABIPolygon,
        functionName: 'tokenURI',
        args: [id]
    })
}

export function getOwner(id) {
    return myClient.readContract({
        address: cpContractPolygon,
        abi: cpABIPolygon,
        functionName: 'ownerOf',
        args: [id]
    })
}

export function getBalance(address) {
    return myClient.readContract({
        address: cpContractPolygon,
        abi: cpABIPolygon,
        functionName: 'balanceOf',
        args: [address]
    })
}


export function getFaucetBalance() {
    return myClient.readContract({
        address: faucetContract,
        abi: faucetABI,
        functionName: 'getBalance',
    })
}

export function getCptBalance(address) {
    return myClient.readContract({
        address: cptAddress,
        abi: cptABI,
        functionName: 'balanceOf',
        args: [address]
    })
}


export async function getTreasury(){

    let defaultCurrency = "MATIC";
  
    let minterBalance = await myClient.getBalance({
        address: cpContractPolygon
    });		
    let depositBalance = await myClient.getBalance({
        address: faucetContract
    });			
  
    // console.log(Number(minterBalance));     // OK
    // console.log(Number(depositBalance));    // OK
  
    let gameBalEth = formatEther(minterBalance);
    let depBalEth = formatEther(depositBalance);
  
    console.log("Game Contract Balance: " + gameBalEth + " " + defaultCurrency);
    console.log("Faucet Balance (tips): " + depBalEth + " " + defaultCurrency);
  
    let totalTreasury = Number(gameBalEth) + Number(depBalEth);
  
    // console.log(await totalTreasury);       // ok
  
    return await totalTreasury;
  }

// export async function PayCPT() {

//     console.log("Is this used?");
  
//     console.log("TBD: RAINBOW WALLET is requesting MATIC. MM OK");

//     const { request } = await publicClient.simulateContract({
// 		address: cptAddress,
// 		abi: cptABI,
// 		functionName: 'Transfer',
// 		account: myAddress,
// 		args: [	faucetContract, singleToken ],
// 	  })
// 	const hash = await walletClient.writeContract(request);
// }