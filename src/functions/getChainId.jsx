import React from "react";

import { usePublicClient } from 'wagmi';

export const getChainId = (currentChainId, setChainId) => {
    
    const { chainId } = usePublicClient().getChainId().then((chainId) => {  

        if(currentChainId !== chainId && chainId !== null) {
            console.log("Setting chainId: ", chainId);

            setChainId(chainId)
        }
        
        // 10 is OPTIMISM
        if (chainId === 10){
            // console.log("connected to OPTIMISM");
            // return 10;
        }
        // 137 is POLYGON
        // 1 is MAINNET
    });

    // setChainId(chainId);
    
    return chainId;
}