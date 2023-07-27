import React, {useState} from "react";

import { useAccount, 
    useContractRead, 
    useContractWrite, 
    usePrepareContractWrite } from 'wagmi'
  
// f2: storeImageData
import { NFTStorage } from 'https://cdn.jsdelivr.net/npm/nft.storage/dist/bundle.esm.min.js';



import { cptAddress, cptABI, cpContractPolygon, cpABIPolygon } from "../../js/modules/contracts.js";			// this is to pull the chain-specific contracts and ABIs as needed.

import { faucetContract, cpFaucetOp, cptOpAddr, cptArbAddr, cpFaucetArb, cptBaseAddr, cpFaucetBase } from "../data/contracts.jsx";

// functions
import { getNewHand } from "./getNewHand.jsx";
import { mintMainAlert } from "./mintMainAlert.jsx";
import { assessHand } from "./mintAssessHand.jsx";

// art
import chipImage from "/img/mint/chip-temp.jpg";
import dealerPoster from "/img/mint/dealerPoster.png";
import dealerVideo from "/img/mint/dealer.mp4";
import mintImage from "/img/mint/slot-temp.jpg";

import chipSound from "/audio/chips.wav";
import shuffleSound from "/audio/shuffle.wav";

// components
import { MintHand } from "../components/MintHand.jsx";


// Contract WRITES using WAGMI - moved to solo component file

/** MINT PROCESS PROCEDURE *** KEY FUNCTIONS **/

//UI - feeddback processing to user 
function processFeedback(feedback){
  // console.log("CHECK: if used_remove from file"); USED
  // CLEAR AND ADD CURRENT to UI data area
  document.getElementById("dataArea").innerHTML = feedback; 

}

// step 1: get the CPT token payment -> Export the UI
export function PayCPT(props) {

  const { address, connector, isConnected } = useAccount();
  //state vars hand and ???
  const [myHand, setMyHand] = useState(null);		// this is the hand object, need to generate artwork and metadata
  const [myURI, setMyURI] = useState(null);		// this is the URI for the NFT, neet to mint NFT
  const [mySvg, setMySvg] = useState([]);		// this is the SVG for the NFT, need to mint NFT

  const [liveFeedback, setLiveFeedback] = useState(null);		// this is the hand object, need to generate artwork and metadata

  // console.log(props.mintNum);   
  
  let nextMintNum = props.cc.count;    // is next mintNum from loaded contract
  let singleToken = 1 * 10**18;       // represented with 18 digits for token Request
	// console.log(singleToken);

  let chainTokenAddr, chainFaucet;

  // console.log(props.cc);

  // CHECK CHAIN    console.log(props.chainId); //OK
  if(props.cc.chainId === 8453){    // this is the BASE chain
    chainTokenAddr = cptBaseAddr;
    chainFaucet = cpFaucetBase;
  } else if(props.cc.chainId === 42161 ){
    // ARBITRUM
    chainTokenAddr = cptArbAddr;
    chainFaucet = cpFaucetArb;

  } else if(props.cc.chainId === 10 ){
    // OPTIMISM
    chainTokenAddr = cptOpAddr;
    chainFaucet = cpFaucetOp;
  } else {
    // POLYGON
    chainTokenAddr = cptAddress;
    chainFaucet = faucetContract;
  }

  const { config } = usePrepareContractWrite({
    address: chainTokenAddr,
    abi: cptABI,
    functionName: 'transfer',
		args: [	chainFaucet, singleToken ]
  })
  const { data, isLoading, isSuccess, write } = useContractWrite(config)



  // step 2: build the hand object and generate the SVG on button press
  async function buildHandGetURI(num){

    console.log("Implement press-and-hold UI for fun while dealing.");

    //play sound 
    playSound(shuffleSound);

    let hand = getNewHand();   // this is the hand object
    // console.log(hand);
    hand.mintNum = num;    // this is the mint number of the NFT, store in object data
  
  
    // need to get the URI for the metadta of the card to be minted and 
      // using myHand, we need to generate the SVG and store it on IPFS
    // console.log(props.cc.chainId, hand );
    hand.chainId = props.cc.chainId;    // this is the chainId of the NFT, store in object data
    // console.log("BUG: safari+rainbow fails here with undefined error");
    let dataURI = await getURI(hand, setMySvg)    // this is the URI for the NFT
    // console.log(num,hand,dataURI);   // confirm correct return data? OK!

    setMyHand(hand);      // set the hand object
    setMyURI(dataURI);    // set the URI for the NFT
  
    return [num,hand,dataURI];
  
  }

  const ChipImage = (props) => {

    // console.log(props.msg);

    return (
      <img 
        style={{maxWidth: "100%"}}
        src={chipImage} 
        alt={props.msg} />
    )
  }

  const DealerImage = (props) => {
      
      // console.log(props.msg);
  
      return (
        <video style={{maxWidth: "100%"}}
        poster={dealerPoster}
        title="Click Above: Dealer is ready to deal your hand."
        controls autostart="true" autoPlay src={dealerVideo} type="video/mp4" />

      )
  }

  const MintImage = (props) => {

    // console.log(props.msg);

    return (
      <img 
        style={{maxWidth: "100%"}}
        src={mintImage} 
        alt={props.msg} />
    )
  }


  function playSound(audioFile){
    // console.log(audioFile);
    let audio = new Audio(audioFile);
    audio.play();
  }



  console.log("Waiting for CPT: " + isSuccess);   // this indicates that the CPT has been sent
  if(isSuccess) {
    // trigger the hand build functions
    console.log("Tweak the page UI to reduce token count by 1.");
    // document.getElementById("token-num").innerHTML = Number(document.getElementById("token-num").innerHTML) - 1;
    // processFeedback("<p>1 CPT Sent! </p>");

    if(myHand && myURI){
      processFeedback('<p class=subHeader>Hand and URI have been successfully generated. Lets MINT to see what you got!</p>');
    }

  }
 
  return (
    <div>
      1. <button className="btn btn-lg btn-primary" disabled={!write} onClick={() => write?.()}>
          PAY 1 CPT
          {isSuccess ? <span className="colorBlack"> (done)</span> : null}
      </button>
      2. <button className="btn btn-lg btn-primary" disabled={!isSuccess} onClick={() => buildHandGetURI(nextMintNum)}>
          {isSuccess ? "DEAL HAND" : "WAITING"}
          {myHand && myURI ? <span className="colorBlack"> (done)</span> : null}
      </button>

      {/* Only show mintbutton if Pay is confirmed and hand has been dealt and URI generated */}
      3. 
      {isSuccess && myHand && myURI && (<MintHand 
        address={address} hand={myHand} myURI={myURI} svg={mySvg}
        defaultFees={props.cc.defaultFees} chainId={props.cc.chainId}
        />) 
      }

      {/* Graphics UI Area - 1 hand out, 2 dealing, 3 mint machine */}

      {(myHand && myURI) && isSuccess ?
        <MintImage msg="MINT ROBOT READY" />
        : isSuccess ? 
          <DealerImage msg="DEALER DEALING HAND" />
          : <ChipImage msg="CHIPS DOWN WAITING" />
      }

      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}

      {/* Feedback process 1 */}
      {isSuccess && processFeedback("<p class=subHeader>1 CPT Sent! </p>")}
      {isSuccess && playSound(chipSound)}

      {/* Feedback process 2 */}
      {(myHand && myURI) && processFeedback('<p class=subHeader>Hand and URI have been successfully generated. Lets MINT to see what you got!</p>')}

      {/* possibly rather than show the explicit manuanl mint button, need to trigger the mint function here (maybe both is the answer). */}
      {/* This shows the main alert to be displayed to the user indicating the mint instructions */ }
      <div>{ isSuccess && mintMainAlert() }</div>

    </div>
  )
}

// INTERNAL FUNCTIONS

// step 2b: call build svg with the hand object after assessemnt (from button press in PayCPT function)
async function getURI(myHand, setMySvg){

  // myHand needs to be an object of 5 cards, plus one ID#
  // everything else is generated here.

  let assessment = assessHand(myHand);
  // shoudl be: object, string, and array of attributes for opensea
  return await buildSvg(myHand, assessment[0], assessment[2], setMySvg);
}

// step 2c: build the SVG and store it on IPFS, is called by getURI only
async function buildSvg(hand, assessment, attr, setMySvg) {

	// console.log(hand);
  let activeGameNum = 1;
  let borderColor = 'purple';

  console.log(hand.chainId);
  if(hand.chainId === 10 ){
    // Optimism
    activeGameNum = 2;
    borderColor = 'red';
  } else if(hand.chainId === 42161 ){
    // Arbitrum
    activeGameNum = 3;
    borderColor = 'blue';
  } else if(hand.chainId === 8453) {
    // Base
    activeGameNum = 4;
    borderColor = 'lightblue';
  }

	let mySvg = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: sans-serif; font-size: 14px; } .title { font-size: 18px; font-weight:bold; fill: #F47A1F; font-family: sans-serif; } .alert{ text-decoration:underline; fill: #E6C65B; } .small{ font-size: 12px;} .heavy{ font: italic 20px serif;}</style>';

	mySvg += '<rect width="100%" height="100%" rx="5" ry="5" fill="#3d3838" style="stroke:'+borderColor+';stroke-width:5;" /><text x="10" y="25" class="title">CRYPTOPOKER HAND #: ' + hand.mintNum + ' / 10,000</text><text x="260" y="45" class="base small">gameId #: 00'+activeGameNum+'</text><text x="10" y="60" class="base">';
	mySvg += 'Card 1: ' + hand.card1.display + '</text><text x="10" y="80" class="base">Card 2: ' + hand.card2.display + '</text><text x="10" y="100" class="base">Card 3: ' + hand.card3.display + '</text><text x="10" y="120" class="base">Card 4: ' + hand.card4.display + '</text><text x="10" y="140" class="base">Card 5: ' + hand.card5.display + '</text>';
	// TO DO
	// -> Insert hand assessment here
	mySvg += '<text x="10" y="180" class="alert">';
	mySvg += assessment;
	mySvg += '</text><text x="10" y="220" class="base small">Join us at https://cryptopoker.justplay.cafe/ to play your hand.</text>';

	mySvg += '<image x="270" y="240" href="https://cryptopoker.mypinata.cloud/ipfs/'+hand.card1.ipfs_cid+'" height="100" transform="rotate(11, 290, 270)" />';
	mySvg += '<image x="210" y="240" href="https://cryptopoker.mypinata.cloud/ipfs/'+hand.card2.ipfs_cid+'" height="100" transform="rotate(-10, 240, 250)" />';
	mySvg += '<image x="150" y="240" href="https://cryptopoker.mypinata.cloud/ipfs/'+hand.card3.ipfs_cid+'" height="100" transform="rotate(5, 165, 260)" />';
	mySvg += '<image x="90" y="240" href="https://cryptopoker.mypinata.cloud/ipfs/'+hand.card4.ipfs_cid+'" height="100" transform="rotate(-8, 100, 250)" />';
	mySvg += '<image x="30" y="240" href="https://cryptopoker.mypinata.cloud/ipfs/'+hand.card5.ipfs_cid+'" height="100" transform="rotate(9, 40, 270)" />';
	mySvg += '</svg>';

	// let storeHandNow = [hand.card1.id, hand.card2.id, hand.card3.id, hand.card4.id, hand.card5.id];
	let handName = hand.card1.display + ", " + hand.card2.display + ", " + hand.card3.display + ", " + hand.card4.display + ", " + hand.card5.display;
  let filename = "cp-hand-"+hand.mintNum+".svg";

  // this functioncall actually uploads to IPFS and returns the metadata
  let ulMetadata = await storeImageData(mySvg, filename, hand.mintNum, handName, attr);
  console.log(ulMetadata);
  // confirm that we have the URI

  // we also have IPFS hash here for image storage and could use it rather than making the function call later
  let ipfsPathname =  ulMetadata.data.image.href;   //.slice(7);		// clips out just the IPFS cid for the image of the NFT
  console.log(ipfsPathname);

  setMySvg([mySvg, assessment, ipfsPathname]);		// this is the SVG for the NFT, need to mint NFT

  // saveMintDatabase(handName, mySvg, hand.mintNum);		// this is the local database save
	
	return await ulMetadata.url;		// true for successful completion
}

// step 3: generate and store the IPFS metadata.json
async function storeImageData(svg, filename, mintnum, handName, attr) {

  // NFT image files to store after creation

  const token = new URLSearchParams(window.location.search).get('key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEIzMTg1OTlhZTUwM0Q2ZjgzODA1NDNiNWY3OTNFNjQ5QTU4MENGYmUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0MDIwOTc4MjU3OSwibmFtZSI6ImNwX25mdF9zdG9yYWdlIn0.NM5PgU0bP67L3yn_ILXKgVN1WjUrMJoxnqfNJ05XzFc'; // your API key from https://nft.storage/manage
  
  const store = new NFTStorage({ token })
  const data = svg
  // console.log("This is good here taking in SVG & returning IPFS, now need to capture real data & fix all site functions to modules. ");

  let imageFile = new File([svg], filename, { type: 'image/svg '});    // from input provided

  let attributes = attr;

  const metadata = await store.store({

        name: 'cpNFT 2022: #'+mintnum + " | " + handName,
        description: 'CP HAND NFT unlocks entry into the game. Let\'s play at https://cryptopoker.justplay.cafe/',
        external_url: "https://cryptopoker.justplay.cafe",
        seller_fee_basis_points: 250,  //# Indicates a 2.5% seller fee.
        fee_recipient: "0x63bf70C967c5627B45d7B0c245781D3F04447D48", // # Where seller fees will be paid to.
        attributes: attributes,
        image: imageFile

  });

  console.log("IPFS Module: Metadata stored on Pinata and IPFS with URL:", metadata.url);
  // document.getElementById("dataArea").innerHTML = "<h3>IPFS Module: Metadata stored on Pinata and IPFS</h3>";    // this is the metadata & image of the NFT

  processFeedback("<h3 class=subHeader>IPFS Module: Metadata stored on Pinata and IPFS</h3>");

  // let contentArea = document.getElementById("contentArea");
  // contentArea.innerHTML += "<h3>IPFS Module: Metadata stored on Pinata and IPFS</h3>";

  // console.log(data, metadata);
  const status = await store.status(metadata.ipnft)
  // console.log(status);

  return metadata;    // this returns all metadata, but only metadata.url is used for URI Submission to Mint

  
}

