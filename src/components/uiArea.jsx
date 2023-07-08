import React, {useState} from "react";

import { useAccount } from 'wagmi';

export function UIArea({cu, setPage}) {

    const { address, connector, isConnected } = useAccount();

    // const [cpTokens, setTokens] = useState(0);

    function goClaim(e){
        e.preventDefault();
        console.log("going claim", e.target);
        // window.location.href = "/";
        setPage("claim");
    }

    function goMint(e){
        e.preventDefault();
        console.log("going mint", e.target);
        setPage("mint");
    }
    let cpImgUrl = 'https://cryptopoker.mypinata.cloud/ipfs/QmQuLYDgqWbPiNtYeGFR2ARtjCP9H9K4j6FBbAVwV8cYYm';
    let myTokens = 0;

    // console.log(cu);
    if(isConnected){
      if(cu){
        // setTokens(cu.cpTokens);
        myTokens = cu.cpTokens;
      }
    }


    return (<div id="UIArea">
      {cu.cpTokens < 1 ?
      <a 
        className='btn btn-danger' 
        href='#'  
        onClick={(e) => goClaim(e)}
        >
        <strong>BUY IN</strong>
        </a>
      : <a 
        id='mintBtn' 
        className='btn btn-outline-primary'
        href='#' 
        onClick={(e) => goMint(e)} ></a> }
      {/* content (Label) of this button is set by CSS */}
      
    
      <h2>
        <a href='#' onClick={(e) => goClaim(e)}>
          <span className='badge bg-secondary token_balance'>
            <span id="token-num">{myTokens}</span> <img id="cpt-logo" src={cpImgUrl} alt="CP Token Logo" />
      </span></a></h2>
    
    </div>)

  }