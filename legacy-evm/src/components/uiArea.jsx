import React, {useState} from "react";

import { useAccount } from 'wagmi';

import homeTag from '/img/home/art-tagline-cp.png';

export function UIArea({cc, cu, setPage}) {

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

    function goDash(e){
      e.preventDefault();
      console.log("going dash", e.target);
      setPage("dashboard");
  }

    let cpImgUrl = 'https://cryptopoker.mypinata.cloud/ipfs/QmQuLYDgqWbPiNtYeGFR2ARtjCP9H9K4j6FBbAVwV8cYYm';
    let myTokens = 0;

    // console.log(cu);
    if(isConnected){
      if(cu){
        // setTokens(cu.cpTokens);
        myTokens = cu.cpTokens;
      }

      // console.log(cc);
    }


    return (<div id="UIArea">
          
      <h2>
        <a href='#' onClick={(e) => goClaim(e)}>
          <span className='badge token_balance'>
            <span 
              id="token-num"
              style={{borderBottom:"2px solid " + (cc.chainId === 10 ? "red" : cc.chainId === 42161 ? "blue" : "purple")}}
              >{myTokens}</span> <img id="cpt-logo" src={cpImgUrl} alt="CP Token Logo" />
      </span></a></h2>

      <img className='ui-tagline' src={homeTag} alt='Generative Collect & Trade NFT Game' />

      {cu.cpTokens < 1 ?
      <a 
        id='claimBtn'
        className='btn btn-danger' 
        href='#'  
        onClick={(e) => goClaim(e)}
        >
        <strong>BUY IN</strong>
        </a>
      : cu.handNum > 4 ?
        <a
          id='dashBtn' 
          className='btn btn-success'
          href='#' 
          onClick={(e) => goDash(e)} 
        >DASH</a>
      : <a 
        id='mintBtn' 
        className='btn btn-primary'
        href='#' 
        onClick={(e) => goMint(e)} ></a> 
      
      }
      {/* content (Label) of goMint button is set by CSS */}

      
    
    </div>)

  }