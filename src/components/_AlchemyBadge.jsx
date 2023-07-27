import React from 'react';

// import {*} from 'https://static.alchemyapi.io/scripts/badge/alchemy-badge.js';

// <!-- Alchemy Badge -->

export function AlchemyBadge() {

	const BADGE_ID = '55d8b59b9b5dbec4';
	<script type="text/javascript" src="https://static.alchemyapi.io/scripts/badge/alchemy-badge.js"></script>
	
    
    return (<a href="#">
		<img 
            onclick=logBadgeClick() 
            id="badge-button" 
            style={{width:"240px", height:"53px"}} 
            src="https://static.alchemyapi.io/images/marketing/badge.png" 
            alt="Alchemy Supercharged" />
	</a>)

}