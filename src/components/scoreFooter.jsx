import React from "react";
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';

// fucnctions
import { myClient } from "../../js/viemConnect.js";
import { cptAddress, cpContractPolygon } from "../../js/modules/contracts.js";

export function ScoreFooter(props) {

    const { address, connector, isConnected } = useAccount();

    console.log(props.cc);

    let currentTreasury = 0;

    useEffect(() => {

        async function getTreasury(){

            let defaultCurrency = "MATIC";
        
            let minterBalance = await myClient.getBalance({
                address: cpContractPolygon
            });		
            let depositBalance = await myClient.getBalance({
                address: cptAddress
            });			
        
            console.log(Number(minterBalance));     // OK
            console.log(Number(depositBalance));    // OK
        
            let gameBalEth = formatEther(minterBalance);
            let depBalEth = formatEther(depositBalance);
        
            console.log("Game Contract Balance: " + gameBalEth + " " + defaultCurrency);
            console.log("CPToken (Donations) Contract Balance: " + depBalEth + " " + defaultCurrency);
        
            let totalTreasury = Number(gameBalEth) + Number(depBalEth);
        
            return await totalTreasury;
        }
    
        // console.log(isConnected);
        if (isConnected) {
            currentTreasury = getTreasury().then((data) => {
                console.log(data);      // OK

                document.getElementById("current-treasury").innerHTML = data;

                return data;
            });

        }
    }, []);

    return (<>
        <hr />
        <h4>Number of players: {props.cc.playerCount}
        <br />MATIC Treasury: <span id="current-treasury">{currentTreasury}</span>
        <br />The Game: {props.cc.count} / 10,000</h4>
    </>);
}