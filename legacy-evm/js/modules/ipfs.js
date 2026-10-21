  
  // NFT image files to store after creation
import { NFTStorage } from 'https://cdn.jsdelivr.net/npm/nft.storage/dist/bundle.esm.min.js';

const token = new URLSearchParams(window.location.search).get('key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEIzMTg1OTlhZTUwM0Q2ZjgzODA1NDNiNWY3OTNFNjQ5QTU4MENGYmUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0MDIwOTc4MjU3OSwibmFtZSI6ImNwX25mdF9zdG9yYWdlIn0.NM5PgU0bP67L3yn_ILXKgVN1WjUrMJoxnqfNJ05XzFc'; // your API key from https://nft.storage/manage

export async function storeImageData(svg, filename, mintnum, handName, attr) {
  const store = new NFTStorage({ token })
  const data = svg
  // console.log("This is good here taking in SVG & returning IPFS, now need to capture real data & fix all site functions to modules. ");

  let imageFile = new File([svg], filename, { type: 'image/svg '});    // from input provided

  let attributes = attr;

  const metadata = await store.store({

       name: 'cpNFT 2022: #'+mintnum + " | " + handName,
       description: 'CP HAND NFT unlocks entry into the game. Let\'s play at https://cryptopoker.justplay.cafe/',
       external_url: "https://cryptopoker.justplay.cafe",
       seller_fee_basis_points: 250,  //# Indicates a 2.5% seller fee.
       fee_recipient: "0x63bf70C967c5627B45d7B0c245781D3F04447D48", // # Where seller fees will be paid to.
       attributes: attributes,
       image: imageFile

  });

  console.log("IPFS Module: Metadata stored on Pinata and IPFS with URL:", metadata.url);
  let contentArea = document.getElementById("contentArea");
  contentArea.innerHTML += "<h3>IPFS Module: Metadata stored on Pinata and IPFS</h3>";

  // console.log(data, metadata);
  const status = await store.status(metadata.ipnft)
  // console.log(status);

  return metadata;    // this returns all metadata, but only metadata.url is used for URI Submission to Mint
}
