import React from "react";
//art

//connect
import { MintContent } from '../components/mintContent.jsx';

function Distractor() {
    return (<iframe id="distractor" title="Playable Card Deck - Animation Samples" src="https://tranmer.ca/tech/cards/"></iframe>);
}

export const Mint = ({cu, cc, setPage}) => {

    if(cu){
        // console.log(cu)        // show currentUser object

        return (<>
            <h3 className="mainHeader" title={cu.address}>Welcome to the DEAL/MINT page.</h3>
            
            <div id="dataArea">
                <h4 className="subHeader">Pay the dealer 1 CPT to build your hand.</h4>
            </div>

            {cu.cpTokens > 0 ?
                <MintContent cu={cu} cc={cc} />
                :
                <button 
                    className="btn btn-outline-success"
                    onClick={setPage("claim")}>
                        Get Tokens
                </button>
            }

            

            <h3 className='mainHeader'>*FUN ONLY* Distractor *FUN ONLY*</h3>
            <Distractor />
            
        </>);
    } else {
        return null;
    }

}