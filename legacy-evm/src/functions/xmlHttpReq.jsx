export async function httpGet(theUrl) {

	let xmlHttpReq = new XMLHttpRequest();
	xmlHttpReq.open("GET", theUrl, false); 
	xmlHttpReq.send(null);
	return xmlHttpReq.responseText;	
}