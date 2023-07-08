import React from 'react';

import heroImg from '/img/cp-hero-logo-full.png';

export const MainAppLogo = () => {
    return (<>
        <h1 className="header-image">
            <img src={heroImg} alt="Cryptopoker Dealr dApp Logo" />
        </h1>
    </>);
}