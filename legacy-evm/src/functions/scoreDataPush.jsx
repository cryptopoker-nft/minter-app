import React from 'react';

// function to sort the final table by score
function sortTable(table) {

	console.log("Final Table sort", table);

	let tableDOM = document.getElementById('sortTable');
	// console.log(tableDOM);
  
	var rows, switching, i, x, y, shouldSwitch;
	// table = document.getElementById("myTable");
	switching = true;
	while (switching) {		  /* Make a loop that will continue until no switching has been done: */
	  	switching = false;			    // Start by saying: no switching is done:
	  	rows = tableDOM.rows;
	  	// console.log(rows);
  
		for (i = 1; i < (rows.length - 1); i++) {		    /* Loop through all table rows (except the first, which contains table headers): */
	
			shouldSwitch = false;		      // Start by saying there should be no switching:
			
			/* Get the two elements you want to compare, one from current row and one from the next: */
			x = rows[i].getElementsByTagName("td")[2];
			y = rows[i + 1].getElementsByTagName("td")[2];
	
			// convert to INT for correct sorting
			let testX = parseInt(x.innerHTML);
			let testY = parseInt(y.innerHTML);
	
			// Check if the two rows should switch place:
			if (testX < testY) {
				// If so, mark as a switch and break the loop:
				shouldSwitch = true;
				break;
			}
		}
		if (shouldSwitch) {
			/* If a switch has been marked, make the switch
			and mark that a switch has been done: */
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
		}
	}
}

export async function scoreDataPush(outputData) {
	// output the results to the DOM here as one batch
	// add loading graphic to the DOM

	let	finalScoreboard = outputData;

	let finalSbhead = '<table class="table table-dark table-striped" id="sortTable">\
						<thead>\
							<tr>\
							<th scope="col" title="MintID">ID</th>\
							<th scope="col">Hand</th>\
							<th scope="col">Score</th>\
							</tr>\
						</thead>\
						<tbody>';


	// remove the loader & loading labels
	let mintCounter = document.getElementById('mintCounter');
	if(mintCounter){	
		mintCounter.innerHTML = "loading finished";
	} else {
		// create it
		mintCounter = document.createElement('div');
		mintCounter.id = "mintCounter";
		mintCounter.innerHTML = "loading finished";
		// document.getElementById("dash").appendChild(mintCounter);
		console.log(mintCounter, "Created -> Trouble!");

	}

	setTimeout(() => {
		console.log("Removing Loader after 2 seconds");
		mintCounter.remove();
	}, 2000);

	let gameScores = document.getElementById('game-scores');
	if(gameScores){
		// OK
	} else {
		// create it
		gameScores = document.createElement('div');
		gameScores.id = "game-scores";
		document.getElementById("dash").appendChild(topHandOutputArea);
	}

	// add to DOM
	gameScores.innerHTML = finalSbhead + finalScoreboard + '</tbody></table>';
	
	sortTable( gameScores );			//sort final table by score order

	// trim / collapse hands to only show top 10.
	console.log("Hiding list items using CSS on tr");

	return true;
}

