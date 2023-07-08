import React from "react";

export async function  getCpMeta() {

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
      console.log(cpMeta.length);

      return cpMeta;
  
      if(cpMeta.length < 205){
        //there is a problem with the API call
        console.log("There is a problem with the API call for cpMeta. Checking Backup...",cpMetaBak);
        //load local copy
        if(cpMetaBak.length > 50){
          console.log("Backup is good. Loading...");
          cpMeta = cpMetaBak;
        }
      } else {
        // send the data
        // return cpMeta;
      }
    });
  }