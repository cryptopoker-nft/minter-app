import React from "react";

//art

//connect
import { ScoreContent } from '../components/scoreContent.jsx';
import { ScoreFooter } from '../components/scoreFooter.jsx';

// function showAllHands(button) {
//     console.log(button);
// }

function showAllHands($this) {
	// should toggle the visual of the button 180deg. rotation animation
	let handContainer =  document.getElementById('game-scores');

	if($this.classList.contains('active')) {
		$this.classList.remove('active');		// flip down

		// should add a class of showall to the container element.
		handContainer.classList.remove('showall'); 

	} else {

		$this.classList.add('active');		// flip down
		// should add a class of showall to the container element.
		handContainer.classList.add('showall'); 

	}

	
}

export const Scoreboard = ({cu, cc}) => {

    if(cu){
        console.log(cu)        // show currentUser object

        return (<>
            <div id="score-loading" className="text-center colorYellow">
                <span id="mintCounter">LOADING MINTS</span>
            </div>
            <div id="dash"></div>
            <h2 className="mainHeader">--- My Active Hands ---</h2>
            <div id="player-scores">
                Table goes Here
            </div>
            <h2 className="mainHeader">--- Top Hands 
                <button id="showAllHandsBtn" 
                    className="btn btn-outline-primary" 
                    onClick={ e => showAllHands(e.target) }
                > ^ </button>---</h2>
            <div id="game-scores">
                Table goes Here
            </div>
            <div id="game-summary">
                Table goes here
            </div>
            <ScoreContent cu={cu} cc={cc} />

            <ScoreFooter cu={cu} cc={cc} />

        </>);
    } else {
        return null;
    }

}