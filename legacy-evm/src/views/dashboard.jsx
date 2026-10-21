import React from "react";
//art

//connect
import { DashHeader } from '../components/dashHeader.jsx';
import { DashContent } from '../components/dashContent.jsx';


export const Dashboard = ({cu, cc, setPage}) => {

    if(cu){

        return (<>
            <DashHeader cu={cu} setPage={setPage} />
            <div id="dash-feedback"></div>
            <DashContent cu={cu} cc={cc} />
            {/* promo video content */}
            <div id="dash-adframe">
                <iframe 
                    width="418" height="700" 
                    style={{marginTop:"50px", marginLeft:"25px"}}
                    src="https://www.youtube.com/embed/aSInzlrSoao" 
                    title="what is cryptopoker?" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    frameBorder="0" 
                    allowFullScreen></iframe>
            </div>
            {/* <iframe 
                style={{marginTop:"50px", width:"100%", height:"350px"}}
                src="https://www.youtube.com/embed/P7sq27793O8" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}
        </>);
    } else {
        return null;
    }

}