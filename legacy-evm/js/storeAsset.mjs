import { NFTStorage, File } from "nft.storage"
import fs from 'fs'

console.log("!?! Need to store vars in .env file");
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEIzMTg1OTlhZTUwM0Q2ZjgzODA1NDNiNWY3OTNFNjQ5QTU4MENGYmUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0Nzc5NTA5NjMxNCwibmFtZSI6InBvbHlnb24rbmZ0LnN0b3JhZ2UifQ.n5u617oku7eJi0b6aeFtL4rTfRUSozvby6SDAboOob0";


async function storeAsset() {

   let mySvg = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: sans-serif; font-size: 14px; } .title { font-size: 18px; font-weight:bold; fill: #F47A1F; font-family: sans-serif; } .alert{ text-decoration:underline; fill: #E6C65B; } .small{ font-size: 12px;} .heavy{ font: italic 20px serif;}</style>';
   mySvg += '<rect width="100%" height="100%" fill="#3d3838" /><text x="10" y="25" class="title">SAMPLE IPFS CRYPTOPOKER HAND #: NUM / 10,000</text><text x="260" y="45" class="base small">gameId #: 00X</text><text x="10" y="60" class="base"></svg>';


   const client = new NFTStorage({ token: API_KEY })
   const metadata = await client.store({
       name: 'Sample NFT 2022',
       description: 'My ptcNFT is an awesome key let\'s play at https://cryptopoker.justplay.cafe/ - Dark (5%) So Rare!',
       image: new File(
           mySvg,// [await fs.promises.readFile('assets/ptc-nft-22-darkbg.png')],       // try svg as blob first
           'cp-sample-svg.svg',         // name for file
           { type: 'image/svg' }        // type of file
       ),
   })
   console.log("Metadata stored on Filecoin and IPFS with URL:", metadata.url)
}

storeAsset()
   .then(() => {
        process.exit(0);
        console.log("is mint-nft function available directly here?");
    })
   .catch((error) => {
       console.error(error);
       process.exit(1);
   });