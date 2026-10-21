import React from "react";

// should take in an ID#, and add it to an array of IDs

export function addCardId(id){

    console.log(id);

    // basic error handling, is id ok?
    if(!id){
        return false;
    } else {
        return true;
    }


}