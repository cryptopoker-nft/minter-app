import React from "react";

  // UI component for page navigation
 export function MainNav({setPage}) {

    function goHome(e){
        e.preventDefault();
        console.log("going home", e.target);
        // window.location.href = "/";
        setPage("home");
    }

    // function goClaim(e){
    //     e.preventDefault();
    //     console.log("going claim", e.target);
    //     // window.location.href = "/";
    //     setPage("claim");
    // }

    function goMint(e){
        e.preventDefault();
        console.log("going mint", e.target);
        // window.location.href = "/";
        setPage("mint");
    }

    function goDash(e){
        e.preventDefault();
        console.log("going dash", e.target);
        // window.location.href = "/";
        setPage("dashboard");
    }

    function goScore(e){
        e.preventDefault();
        console.log("going score", e.target);
        // window.location.href = "/";
        setPage("scoreboard");
    }

    return (<div className="fixed-bottom">
      <ul id="base-nav" className="nav justify-content-center nav-fill">
        <li className="nav-item">
          <a className="nav-link" href="#" onClick={(e) => goHome(e)}>Home</a>
        </li>
        <li className="nav-sep">|</li>
        <li className="nav-item">
          <a className="nav-link" href="#" onClick={(e) => goDash(e)}>Dash</a>
        </li>
        <li className="nav-sep">|</li>
        <li className="nav-item">
          <a className="nav-link" href="#" onClick={(e) => goMint(e)}>Dealr</a>
        </li>
        <li className="nav-sep">|</li>
        <li className="nav-item">
          <a className="nav-link" href="https://opensea.io/collection/cryptopoker-nft" target="_blank">Trade</a>
        </li>
        <li className="nav-sep">|</li>
        <li className="nav-item">
          <a className="nav-link" href="#" onClick={(e) => goScore(e)}>Scores</a>
        </li>
      </ul>
    </div>)
  }