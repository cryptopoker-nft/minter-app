import React from 'react';

import homeCards from '/img/home/cp-card-home.png';
import homeTag from '/img/home/art-tagline-cp.png';

import mainAudio from '/audio/main.wav';

let isPlaying = false;

function playSound(audio){
    // console.log(audioFile);

    if(isPlaying) {
        audio.pause();
        isPlaying = false;
    } else {
        audio.play();
        isPlaying = true;
    }

    return audio;
}

export function HomeHero() {

    let homeHero = homeCards;
    let titleOverlay = "Cryptopoker";

    const TitleSub = () => {
        return (<img className='tagline-image' src={homeTag} alt='Generative Collect & Trade NFT Game' />);

    } ;

    let audio = new Audio(mainAudio);
    // playSound(audio);

    // FUTURE UPGRADES: Themes
    // if((typeof(currentTheme) !== "undefined") && (currentTheme === 'bcard')) {
    //     homeHero = '../img/bcard-Cover.jpg';
    //     titleOverlay = "CP brought to you by <a href='https://banklesscard.xyz' target='_blank' style='color:#D02128;'>Bankless Card</a>";
    // } else {
    //     // vanilla graphic for catch all
    //     homeHero = homeCards;
    // }

    

	return (<>
        <img 
            src={homeHero} 
            onClick={() => playSound(audio)}
            className="homeHero" 
            alt='Cryptopoker Home Graphic' />
	    <h3 className='title-head'>
            {titleOverlay}
            <TitleSub />
        </h3>
	    <div style={{clear:"both"}}></div>
    </>);
}