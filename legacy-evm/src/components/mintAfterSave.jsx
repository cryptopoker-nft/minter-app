import React, {useRef} from "react";
import { useAccount } from "wagmi";

import { DisplayCard } from "../functions/displayCard";
import { httpGet } from '../functions/xmlHttpReq';


import { BurnBtn } from "./BurnBtn.jsx";


import heroLogo from "/img/cp-hero-logo-full.png";

// OK to show animation then bail to homepage for now.
function playHandBtn(){
    console.log("PLAYING HAND -> just for navigation animation");

	let airplaneHtml = '<div id="plane-container"><div class="paperplane"><div class="plane"><div class="wingRight"></div><div class="wingLeft"></div><div class="bottom"></div><div class="top"></div><div class="middle"></div></div><div class="clouds"><div class="cloudOne"></div><div class="cloudTwo"></div><div class="cloudThree"></div></div></div></div>';

	// console.log("Fancy animation -> flying to the right, then send player to their profile page (later scoreboard?)");
    // set DOM Directly
    let dataArea = document.getElementById('dataArea');
	dataArea.innerHTML = airplaneHtml;

    //js scroll to element
    dataArea.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});

	// delay to show off the animation, then redirect
	setTimeout(() => {
        console.log("executing redirection after 3 seconds"); 
        // dashboard(); 
        location.reload();      // get out, go home (for now)
    }, 3000);	

	return true;
}

export function MintAfterSave(props){

    const ref = useRef(null);

    const handleScroll = () => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    console.log("if failing aftermint, check async here -> it's own function?");


    const { address, connector, isConnected } = useAccount();

    console.log(props);

    // add in useEffect here to get the hand IMAGE from the mint URI

        // console.log("TEMP ONLY for UI!, need to receive the actual hand here from the mint.")
    let hand = props.hand;          // call the function to get a new hand above
    let mintNum = props.hand.mintNum; 
    let svg = () => {
        return (
            props.svg[0]
        );
    } 
    let uri = props.uri;     // URI is used to get the image
    // could also use mintNum and getURI to get URI if this is causing trouble.
    // may need a setTimeout to wait for the mint to complete before calling this function.

    console.log("REVEAL IMAGE LOADING ISSUE HERE: sometimes does not get data. - try component await conditions on props - nope, not working.");

    // let thisURI = result;
	console.log(uri);
	let urlTarget = "https://cryptopoker.mypinata.cloud/ipfs/" + uri.slice(7);

    console.log("Need to get the image ASYNC from the URI: %s", urlTarget);

    console.log(props.svg[2]);
    //need to trim IPFS prefix

    let imgHashFixed = props.svg[2].substr(6);
    let thisImageUrl = "https://cryptopoker.mypinata.cloud/ipfs"+imgHashFixed;
    //  bafybeiaaywhj5i4ag47tofgpojsdknf7eq645havodx32l2nenjzgrlgmi/cp-hand-279.svg";
    console.log(thisImageUrl);







	// const jsonResult = async () => {
    //     await httpGet(urlTarget);
    // }
    // jsonResult().catch(console.error);
    // TEMP OVERRIDE
    // const jsonResult = '{"name":"CryptoPoker Hand #1","description":"CryptoPoker Hand #1","image":"ipfs://QmZ1Z2Z3Z4Z5Z6Z7Z8Z9Z10Z11Z12Z13Z14Z15Z16Z17Z18Z19Z20Z21Z22Z23Z24Z25Z26Z27Z28Z29Z30Z31Z32Z33Z34Z35Z36Z37Z38Z39Z40Z41Z42Z43Z44Z45Z46Z47Z48Z49Z50Z51Z52Z53Z54Z55Z56Z57Z58Z59Z60Z61Z62Z63Z64Z65Z66Z67Z68Z69Z70Z71Z72Z73Z74Z75Z76Z77Z78Z79Z80Z81Z82Z83Z84Z85Z86Z87Z88Z89Z90Z91Z92Z93Z94Z95Z96Z97Z98Z99Z100Z101Z102Z103Z104Z105Z106Z107Z108Z109Z110Z111Z112Z113Z114Z115Z116Z117Z118Z119Z120Z121Z122Z123Z124Z125Z126Z127Z128Z129Z130Z131Z132Z133Z134Z135Z136Z137Z138Z139Z140Z141Z142Z143Z144Z145Z146Z147Z148Z149Z150Z151Z152Z153Z154Z155Z156Z157Z158Z159Z160Z161Z162Z163Z164Z165Z166Z167Z168Z169Z170Z171Z172Z173Z174Z175Z176Z177Z178Z179Z180Z181Z182Z183Z184Z185Z186Z187Z188Z189Z190Z191Z192Z193Z194Z195Z196Z197Z198Z199Z200Z201Z202Z203Z204Z205Z206Z207Z208Z209Z210Z211Z212Z213Z214Z215Z216Z217Z218Z219Z220Z221Z222Z223Z224Z225Z226Z227Z228Z229Z230Z231Z232Z233Z234Z235Z236Z237
	// let parseRes = JSON.parse(jsonResult);

	// let soloHash = parseRes.image.slice(7,66);			// clips out just the IPFS cid for the image of the NFT
	// let thisFilename = parseRes.image.slice(67)	;		// clips out just the filename for use when calling the image

	// // let thisImageUrl = "https://cryptopoker.mypinata.cloud/ipfs/" + soloHash+"/"+thisFilename;
	// let thisImagelink = "<a class='nft-link' href='"+thisImageUrl+"' target='_blank'>";
	// let thisImage = "<img src='"+thisImageUrl+"' alt="+thisFilename+" style='width: 100%;'/>";

    // let thisImageUrl = "https://cryptopoker.mypinata.cloud/ipfs/bafybeiaaywhj5i4ag47tofgpojsdknf7eq645havodx32l2nenjzgrlgmi/cp-hand-279.svg";

    function burnHandBtn() {
        // get id and pass to burn function
        console.log("BURNING HAND %d -> just for button testing ATM", mintNum);
    }
    
    function dustHandBtn() {
        // get id and pass to burn function
        console.log("DUSTING HAND -> coming soon.");
    }

    function flipAllCards(e) {
        e.preventDefault();

        let allCards = document.getElementsByClassName('flip-card');
        for(let i=0; i<allCards.length; i++){
            allCards[i].classList.toggle('flipped');
        }   

        // reveal nft assessment
        let myNftImg = document.getElementById('nft-img');
        // myNftImg.style.display = 'block';
        document.getElementById('nft-assess').style.display = 'block';
        myNftImg.style.visibility = 'visibile';
        myNftImg.style.opacity = '1';

        // open link for nft art in new tab
        console.log(thisImageUrl);
        window.open(thisImageUrl, '_blank');

    }

    // requires: mintNum, currentUserHands, currentUserAddress
    // let activeGameNum = 1; // this should be a global variable
    // let currentUserAddress = address; // this should be a global variable

    // let imgSrc="img/mint/"+activeGameNum+"-"+currentUserAddress+"-"+mintNum+".svg";     // the TEMP image stored on the server as the NFT is created. LIVE SERVER ONLY

    if(ref){
        console.log(ref);
        handleScroll();

        if(document.getElementById('nft-img-two')){
            document.getElementById('nft-img-two').scrollIntoView({ behavior: 'smooth' });
        }
    }

    if(hand){
        // console.log("hand is ready to display");

        // console.log("Need a test for 5 flipped here, then enable the NFT display in the BG and the buttons below (currently always enabled).");
    
        let assessPlainText = props.svg[1].textContent;
        console.log(assessPlainText);

        return (<>
            {/* ART REVEAL HEADER IMAGE */}
            <img ref={ref} id='nft-img-two' className='image-wide nft-img' src={heroLogo} alt='Header for NFT display area.' />

            <p id="nft-assess"
            >Assessment: {props.svg[1]}</p>

            {/* ART REVEAL ACTUAL NFT IMAGE */}
            <img id='nft-img' className='image-wide nft-img' src={thisImageUrl} alt='NFT, or animated gif of NFT hand generation' />

            
            <p className='hotCutLink'>
                <a onClick={(e) => {
                    flipAllCards(e);
                }} 
                    href="#" target='_blank'>Just show me my NFT!</a>
            </p>
            
            {hand ? <div className='hand mint'>
                <table><tbody>
                    <tr>
                        <td>
                            <div className='cardDisplay'>{hand.card1.display}</div>
                            {/* {displayCard(hand.card1.id, false)} */}
                            <DisplayCard id={hand.card1.id} />
                        </td>
                        <td>
                            <div className='cardDisplay'>{hand.card2.display}</div>
                            {/* {displayCard(hand.card2.id, false)} */}
                            <DisplayCard id={hand.card2.id} />
                        </td>
                        <td>
                            <div className='cardDisplay'>{hand.card3.display}</div>
                            {/* {displayCard(hand.card3.id, false)} */}
                            <DisplayCard id={hand.card3.id} />
                        </td>
                        <td>
                            <div className='cardDisplay'>{hand.card4.display}</div>
                            {/* {displayCard(hand.card4.id, false)} */}
                            <DisplayCard id={hand.card4.id} />
                        </td>
                        <td>
                            <div className='cardDisplay'>{ hand.card5.display }</div> 
                            {/* { displayCard(hand.card5.id, false) }  */}
                            <DisplayCard id={hand.card5.id} />
                        </td>
                    </tr>
                </tbody></table>
            </div>
            : 
            null}

            <div className='button-container row'>
                <div className='col'>
                    <a id='playHand' className='btn btn-mint btn-lg' title='HODL this hand and move it to your dashboard.' onClick={playHandBtn}>HODL</a>
                </div>
                <div className='col' style={{"display":"none"}}>
                    <a id='dustHand' title='Dust this hand and burn it to receive 5 cards.' className='btn btn-outline-danger btn-lg disabled' onClick={dustHandBtn}>DUST</a>
                </div>
                <div className='col'>
                    {/* <a id='foldHand' title='Fold this hand and burn it forever' className='btn btn-outline-danger btn-lg' onClick={burnHandBtn}>FODL</a> */}
                    {console.log("Cannot put burn button UI here since the ID does not exist at time of mint. Instead, generate a call-on-demand function and button to call it. ")}
                    {/* <BurnBtn tokenId={mintNum} title="FODL" /> */}
                </div>
            </div>
        </>);
    } else {
        console.log("hand is not ready to display");
        return (<>
            <h3>Follow steps above to generate your hand...</h3>
            <p>It may take a few seconds to mint your hand. Please be patient.<br />
            Once your hand is minted, you will be able to HODL it or FODL it.<br />
            Thank you for playing!</p>
        </>);
    }
}
  
