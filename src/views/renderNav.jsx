import React from 'react';

// load all pages here into one page before splitting for navigation
import { Home } from './home.jsx';
import { Dashboard } from './dashboard.jsx';
import { Claim } from './claim.jsx';
import { Mint } from './mint.jsx';
import { Scoreboard } from './scoreboard.jsx';

export function renderNav(page, setPage, cu, cc) {
  console.log(page);
  
    switch(page) {
      case 'home':{
        return (<>
            <Home cu={cu} />
            <hr />
            <hr />
          </>);
         }
      case 'scoreboard':
        return (<>
            <Scoreboard cu={cu}  cc={cc} />
            <hr />
            <hr />
          </>);
      case 'dashboard':
        return (<>
            <Dashboard cu={cu} cc={cc} setPage={setPage} />
            <hr />
            <hr />
          </>);
      case 'claim':
        return (<>
            <Claim cu={cu} cc={cc} setPage={setPage} />
            <hr />
            <hr />
          </>);
      case 'mint':
        return (<>
            <Mint cu={cu} cc={cc} setPage={setPage}/>
            <hr />
            <hr />
          </>);


      default:
        return 'home';
    }
  }