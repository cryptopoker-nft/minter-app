import React from "react";

import { cpMetaBakPoly, cpMetaBakARB, cpMetaBakOP, cpMetaBakBase } from "../data/cpMeta";

export async function getCpMeta(chainId) {

  // console.log(chainId);
  

  // get cpMeta from global variable (API server)
  //NEW API CALL TO GET DATA PRE_CACHE
  console.log("Calling cpMeta...");

  // return true;

  var cpMeta = [];		// setup storage variable
  fetch('https://api.justplay.cafe/data/cpMeta', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(response => response.json())
  .then(data => {
    console.log("cpMeta has been gathered from the API cache.");
    cpMeta = data;
    console.log(cpMeta.length);   // OK HERE

    

    if(cpMeta.length < 205){
      //there is a problem with the API call
      console.log("There is a problem with the API call for cpMeta. Checking Backup...",cpMetaBak);
      //load local copy
      if(cpMetaBakPoly.length > 50){
        console.log("Backup is good. Loading...");
        cpMeta = cpMetaBakPoly;
      }
    } else {
      // send the data
      // return cpMeta;
    }
  });


  // BACKUP SHORTCUTS TO EXPORT FOR NOW
  if(chainId === 8453) {
    return cpMetaBakBase;
  } else if(chainId === 137){
    return cpMetaBakPoly;
  } else if(chainId === 10){
    return cpMetaBakOP;
  } else if(chainId === 42161){
    return cpMetaBakARB;    // no data for Arbitrum, yet...
  } else {
    return [];    // nothing
  }



}