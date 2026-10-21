import React, { useState, useEffect } from "react";

import { useAccount, useConnect, useDisconnect, usePublicClient } from 'wagmi';

import { getChainId } from '../functions/getChainId.jsx';

import { MainNav } from '../components/mainNav.jsx';
import { UIArea } from '../components/uiArea.jsx';
import { MainAppLogo } from '../components/mainAppLogo.jsx';
import { TipJar } from "../components/TipJar.jsx";

import { renderNav } from './renderNav.jsx';

import { getCpMeta } from '../functions/getCpMeta.jsx';
import { myClient, checkName, checkSymbol, checkCount, getURI, getOwner,
  getBalance, getTreasury,
  myWalletClient, getCptBalance } from "../../js/viemConnect.js";

// import { getCptBalance } from "../functions/getCptBalance.jsx";

// import { cpMetaBak } from '../data/cpMeta.jsx';     // backup data for API server call
// {cu, setCu, setCc, cc, page, setPage, chainId, setChainId}
export const MainContent = () => {

  const [chainId, setChainId] = useState( null );   // chain is fist as it determines contract
  // chainId is also added to cc for later reference
  const [cc, setCc] = useState(null);           // contract data
  const [cu, setCu] = useState(null);          // connected user data
  const [page, setPage] = useState("home");

    const { address, connector, isConnected } = useAccount({
        onConnect({ address, connector, isReconnected }) {
            // console.log('Connected', { address, connector, isReconnected });

        },
    });
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
	  const { disconnect } = useDisconnect();

    getChainId(chainId, setChainId);    // set the chainId FIRST ?

    // const currentChainId = getChainId(setChainId);
  // only set data values if it has a connected account,and is unchanged
  useEffect(() => {


    // console.log(chainId);     // problems if we dont have this - initial load est.

    // console.log("Bug here in deterining logged in after connection - causing CRASH...");

    // declare the data fetching function
    const initialSetup = async () => {

      // console.log(isConnected, address, chainId); // OK to go

      /** for current user, data lookups ***/
      const tokenNum = Number( await getCptBalance(address, chainId) ) / 10**18;
      // console.log("tokenNum: ",tokenNum);   // OK Polygon, OK OPTIMISM

      let handNum = Number( await getBalance(address, chainId) );


      /** for current contracts, data lookups **/
      const currentTreasury = await getTreasury(chainId);
      // console.log("Treasury: " + currentTreasury);      // OK Polygon, OK OPTIMISM

      //figure out which CPMeta to use
      let cpMeta = await getCpMeta(chainId);
      // console.log(cpMetaBak);   // OK Polygon, OK OPTIMISM

      let pc = [...new Set(cpMeta.map(item => item.owner))];   // player count, uniques

      let currentCount = Number( await checkCount(chainId) );
      // console.log(currentCount);

      // current contract data
      let cc_data = {
        chainId: chainId,
        // address
        // abi?
        name: await checkName(chainId),
        symbol: await checkSymbol(chainId),
        count: currentCount,
        cpMeta: cpMeta,
        playerCount: pc.length,
        currentTreasury: currentTreasury,
        defaultFees: chainId === 137 ? '0.001' : '0.00001'
      }

      let cu_data = {
        isConnected: isConnected,
        address: address,
        handNum:handNum,
        cpTokens: tokenNum.toFixed(0)
      }

      //setState Data for global variables goes here
      console.log("setting cc: ", cc_data);   // use API servver?
      console.log("setting cu: ", cu_data);

      setCu(cu_data);    // assign address of connected account to cu object
      setCc(cc_data);        // assign contract data calls to cc object

      // ASYNC set the token umber in the UI area.
      // console.log(document.getElementById("token-num"), tokenNum);
      let tokenUI = document.getElementById("token-num")
      if(tokenUI){
        tokenUI.innerHTML = tokenNum;
      }


    }

    // can we omit this check, in favour of requirements below?
    if(!cu && isConnected && address && chainId){

      // call the ASYNC data function
      initialSetup().catch(console.error);

    }
  }, [isConnected, cu, cc, address, chainId]);

  return ( <div className="container" id="main-container">
            <div className="row">
                <div className="col" id="main-column">

                  <MainAppLogo />

                  { isConnected && cu ?
                    <>
                      <UIArea cc={cc} cu={cu} setPage={setPage} />
                    </>
                    : <>
                      {/* <ConnectButton /> */}

                    </> }
                  { /* is dynamic connection to rainbow wallet */ }

                  {/* this handles the setting of the correct page when selected */}
                  { renderNav(page, setPage, cu, cc) }

                  <MainNav setPage={setPage} />

                  <div id="footerArea">
                    <div id="pageSocial"></div>
                    <TipJar chainId={chainId} />
                    <p>Connected to Chain: {chainId}</p>
                    <p className="colorYellow">BETA Prototype offered as-is to any and all players.</p>
                    <p className="colorOrange">If you're stuck, email support at <a href="mailto:help@justplay.cafe">help@</a> or <a href="https://twitter.com/cryptopoker_nft">Tweet@ Us</a> for more info.</p>

                  </div>

                </div>
            </div>
        </div> );
};