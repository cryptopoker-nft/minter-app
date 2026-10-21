import React from 'react';

function addTokensPage() {
    console.log("Set State => page: add-tokens");
}

export function HomeAfter({cu}) {
    // not logged in, just display a big connect button.

    if(cu){
        if (cu.tokens === "0") {
            return (
                <p className='center-button'>
                    <a className='btn btn-danger btn-lg' onClick={addTokensPage}><strong>BUY IN NOW</strong></a>
                </p>
            );
        }
    } else {
        return (
            <p className='center-button'>
                <a className='btn btn-outline btn-lg' onClick={addTokensPage}><strong>REBUY NOW</strong></a>
            </p>
        );
    }
    
    
}