import React from "react";

import { useAccount, useContractRead } from 'wagmi'

import { cptAddress, cptABI } from "../data/contracts.jsx";			// this is to pull the chain-specific contracts and ABIs as needed.


export function getCptBalance(address, chainId) {

    // if chainId === 137, use polygon contract
    console.log(address, chainId);

    const myData = useContractRead({
        address: cptAddress,
        abi: cptABI,
        functionName: 'balanceOf',
        args: [address],
        chainId: 137,
        onSuccess(data) {
            console.log('Success', data);
            return data;
        },
    })

}

  // ref
// export function getCptBalance(address) {
//     return myClient.readContract({
//         address: cptAddress,
//         abi: cptABI,
//         functionName: 'balanceOf',
//         args: [address]
//     })
// }