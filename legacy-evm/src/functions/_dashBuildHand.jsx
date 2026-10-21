import React from "react";

import { displayCard } from "../functions/displayCard.jsx";


export function buildHandDisplayProfile(chainData) {

	let c1 = chainData[0];
	let c2 = chainData[1];
	let c3 = chainData[2];
	let c4 = chainData[3];
	let c5 = chainData[4];

	let handOut = "<div class='hand profile'>";

	handOut += "<table><tr><td><div class='cardDisplay shown'>" + c1.display  + "</div>" + displayCard(c1.id, true) + "</td>";
	handOut += "<td><div class='cardDisplay shown'>" + c2.display + "</div>" + displayCard(c2.id, true) + "</td>"; 
	handOut += "<td><div class='cardDisplay shown'>" + c3.display + "</div>" + displayCard(c3.id, true) + "</td>"; 
	handOut += "<td><div class='cardDisplay shown'>" + c4.display + "</div>" + displayCard(c4.id, true) + "</td>"; 
	handOut += "<td><div class='cardDisplay shown'>" + c5.display + "</div>" + displayCard(c5.id, true) + "</td>";
	handOut += "</tr></table>";

	handOut += "</div>";

	// output to DOM
	return handOut;
}