import React from "react";

import { buildDeck } from "./buildDeck.jsx";

export function getNewHand() {
        // GOAL: enerate a hand at random from a new deck
    
    var newHand = {};
    // get a new deck
    var deckDeal = buildDeck();

    // card 1
    let c1 = Math.floor(Math.random() * deckDeal.length);
    let card1 = deckDeal[c1-1];
    deckDeal = deckDeal.filter(function(item) {
        return item.id !== c1
    });

    // card 2
    let c2 = Math.floor(Math.random() * deckDeal.length);
    let card2 = deckDeal[c2-1];
    deckDeal = deckDeal.filter(function(item, index) {
        return index !== c2-1;
    });

    // card 3
    let c3 = Math.floor(Math.random() * deckDeal.length);
    let card3 = deckDeal[c3-1];
    deckDeal = deckDeal.filter(function(item, index) {
        return index !== c3-1;
    });

    // card 4
    let c4 = Math.floor(Math.random() * deckDeal.length);
    let card4 = deckDeal[c4-1];
    deckDeal = deckDeal.filter(function(item, index) {
        return index !== c4-1;
    });

    // card 5
    let c5 = Math.floor(Math.random() * deckDeal.length);
    let card5 = deckDeal[c5-1];
    deckDeal = deckDeal.filter(function(item, index) {
        return index !== c5-1;
    });

    // this handles all live hand generation builds
    newHand = {
        card1: card1,
        card2: card2,
        card3: card3,
        card4: card4,
        card5: card5
    }

    return newHand;      // give back the hand object
    
}