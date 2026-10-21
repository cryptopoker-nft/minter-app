import React, {useEffect} from "react";
//art

//connect
import { ConnectButton } from '@rainbow-me/rainbowkit';

import { HomeHero } from '../components/homeHero.jsx';
import { HomeContent } from '../components/homeContent.jsx';
import { HomeAfter } from '../components/homeAfter.jsx';


export const Home = ({cu}) => {

    if(cu){
        // console.log(cu)        // show currentUser object


        return (<>
            <div className='button-container'>
                <ConnectButton />
            </div>
            <HomeContent cu={cu} />
            <HomeAfter cu={cu} />
        </>);
    } else {
        return (
            <>
            {/* <iframe style={{marginTop:"25px", width:"100%", height:"350px"}} src="https://www.youtube.com/embed/P7sq27793O8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}
            <HomeHero />
            <div className='button-container-no-bg'>
                <ConnectButton />
            </div>
            <div id="unlogged-adframe">
                <iframe width="418" height="743" src="https://www.youtube.com/embed/aSInzlrSoao" title="what is cryptopoker?" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </div>
            </>
        );
    }

}