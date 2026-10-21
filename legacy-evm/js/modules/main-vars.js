// export const myLogin = "hello";	

export const activeGameNum = 1;				// display for active game number (when multiple games are simultanuously in play)
export const currentHandAttr = [
            {
              "trait_type": "Game", 
              "value": "Cryptopoker"
            }, 
            {
              "trait_type": "Win Condition", 
              "value": "Top Hand"
            }, 
            {
              "display_type": "number", 
              "trait_type": "Game ID", 
              "value": activeGameNum
            }
          ];		// attributes for the current hand -> used when minting a new hand


export const defaultCurrency = "MATIC";		// for intial Polygon Depolyment
export const defaultFees = "0.0001";		// store as string and parseInt(defaultFees) for float
export const MATICtoCAD = 1.09;				// CAD per MATIC token for CAD $ estimate
export const ownerWallet = "0x63bf70C967c5627B45d7B0c245781D3F04447D48";		// contract owner wallet & for receive tx

// internal application buttons
// button prototypes
export const walletConnectBtn = "<w3m-core-button></w3m-core-button>";   //"<a href='#' id='connectWallet' class='btn btn-primary' onclick='getConnected()'>Connect Wallet / Login</a>";
export const _walletConnectedBtn = "<a href='#' id='connectedWallet' class='btn btn-secondary'></a>";	// Wallet Connected removed
export const mintBtn = "<a href='#' id='mintBtn' onclick='gotoMint()' class='btn btn-outline-primary'></a>";	// DEAL LABEL REMOVED - ADDED BACK WITH CSS for dynamic
// let tokenCounter = "<h2><span class='badge bg-secondary'>"+currentUserTokens+"</h2>";



// external application handlers

// link prefixes for opensea trading / collection
export const osTestPrefix = "https://testnets.opensea.io/assets/";
export const osLivePrefix = "https://opensea.io/assets/matic/";


// IPFS local Art
let cpImgUrl = 'https://cryptopoker.mypinata.cloud/ipfs/QmQuLYDgqWbPiNtYeGFR2ARtjCP9H9K4j6FBbAVwV8cYYm';
export const cpImg = '<img src="'+cpImgUrl+'" alt="CP Token Logo" style="height: 20px; padding-left: 3px;" />';


// card art IPFS
// IPFS connections to card images for use in app & nft building
export var mainDeckBackIpfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeifqmquol5qqzcycxfski6ygzb36cxvb6drj6zwsaqqc7ntpoggag4";		// back art (new link)
export var mainDeck1Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeicm6dqkpiop65z6i2peua54chs3bk7snakajwecre4oixsmswfwym";			// A - Spades
export var mainDeck2Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeicbh7ha56qzjc2yfrmnwhi6sy4xaougfccthyayiij3rkma3ycgte";		// 2 -Spades
export var mainDeck3Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeif64xmkdw37g3j3hbgbk6zjr652tbfnomenspn4qs2ghckvqhywsa";		// 3 -Spades
export var mainDeck4Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeibnkq7djhqw5dp67peds6jidp3dvjdxmzkucaap3y5fhqpkpchkla";		// 4 -Spades
export var mainDeck5Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeifabkwl35c7vjkk32zypzaf3mah7eakuk3zw36u7an7yxkmmygveq";		// 5 -Spades
export var mainDeck6Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeiccv32yxyi75cmyu3lyggpkul6gyedddv3q3o3mxmqa4qlvoclnfu";		// 6 -Spades
export var mainDeck7Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeiasu3edvhxjjnw65r3jrrvjessmt5pkf33ytivl2tc5jrncy37eiq";		// 7 -Spades
export var mainDeck8Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeibdiuodmblfk4ecnk6o3n2hltfg2j6nwvu6uzdby7docx22rcdd3q";		// 8 -Spades
export var mainDeck9Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeidpsqiaxnxpgockpht7ecqaeu5pb33uwca5gbodalcdihb66fyqyy";		// 9 -Spades
export var mainDeck10Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeihwnp5lbmh7hxlayygx6hl7av54dcdblbatyqblddycgtmflkya2a";		// 10 -Spades
export var mainDeck11Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeidvz3a5y55rxwcstuvys7b4g56hnrcfnmp7qdfvinwl4nde6wztja";		// J - Spades
export var mainDeck12Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeic2bp2uohmqsbs3aa3sqn5olkdj43pf6g4nkc7jejfm6h74udh6gq";		// Q -Spades
export var mainDeck13Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeibckznpp76427qsd4hf74epva445fmuloeid4jicttrgdcgkj2pmy";		// K -Spades
// Hearts
export var mainDeck14Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeicc5ppnndblirjsvszgqbnj2cuakoladvrbdwz7dsdi47z4kcssl4";
export var mainDeck15Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeie7lbe7piavel4celocm4nitytkjdb4c4j6b2qvgpl2xph2up22ty";
export var mainDeck16Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeidlhzopv5di4i4j5pu7sh5i7hrjxmafxyrrjhaway73ebyg5qcuxu";
export var mainDeck17Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeigo5ng5z7rur6godmnyehbbwzpciy7gatefaavomyxhojxxnlj4qe";
export var mainDeck18Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeigtyxk6bsok6y7bva4rbjblghvrarb5bjpu7mrelklmwdhvcagihm";
export var mainDeck19Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeif3nrxgwmr4cxzayvv5q5wcvkoj2zkr7fhvgfxbiceg3ge7nctxq4";
export var mainDeck20Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeiatbyhy2jkssj7gfq5brfc2fklvkctewwmzaozuzktmu6nr57kxsi";
export var mainDeck21Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeichdgpmuzhvcalw7c3cng5hyiapl33l3mnfn5a7aien6h5n2kbwxe";
export var mainDeck22Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeicd6gb4c267tfebbunv7gjh2sr5syui4z5y6iheofu7wunzeplh64";
export var mainDeck23Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeihgkio5we23api2q6soldkjecu4qx6jc7lh7tmxoakpdjcho3g4p4";
export var mainDeck24Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeighdsvapdmvxkzgaqxmbsyi426oh6hx2kyh5jwumly7pldznudetm";
export var mainDeck25Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeihvuvbvozmsl5ynyyby5jbt7ftlpbep3niiek7fww5xiwtdibnjbm";
export var mainDeck26Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeie5hsefyfvdwda6ybs5laaqvtq6iay4kwtqe4zlthh74hznaiqb7i";
// Diamonds
export var mainDeck27Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeidyyl5je3sssgu2cqtbfsiudu3uphgzwsavtjgdlum4vhuifh26bm";
export var mainDeck28Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeidwksaegho7jlexc4rlnzqkppk6vl4nt5bwxta3a2ek6mvwevhrdy";
export var mainDeck29Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeieyvtgq2j3ulbf6elt2z5d7exuzwfekekjntrkj7jchnwddpd5n4i";
export var mainDeck30Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeibgfzlbwtmjgjaftorge5oigvut3wfcre3yv7hg6sbkuhpfk76udi";	// 4
export var mainDeck31Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeigxbtmrtpvjercmh72smnfruiht7vvjqs2brbavifmxpe6j73jtk4";
export var mainDeck32Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeidpswgtgldpydipzf7d6h7eyeouazbazqumtwzueeoucke3chtu5y";
export var mainDeck33Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeicixdgug5kbyx74taqwabv5i33vtxqvywsxcyhin6xgc4afhoaiuu";	// 7
export var mainDeck34Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeic2cwfv3iv3d7jazyc44kzn5kzsc3pyhpkabqxpyiqdbapmc322bu"; 
export var mainDeck35Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeickwbzgnerdryvsmbnsrc6w7kgicporfa62k2hgrlbb43hqy4avgi";
export var mainDeck36Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeih6vf6e3e6efv5omyygbbbs6hukyb7ixnzx76eljliqutl5q4gkve";
export var mainDeck37Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeibk7tk5o5mycksi7b7o2zgarbgkphbr2yxj3vj277n7uc5cakdxtq";
export var mainDeck38Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeiczvslukdwq2eprqp5qnvfycuxco5yfiu4pe2v26ckdbuypkqmtyi";	// Q
export var mainDeck39Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeidyh3qsd7qwshuyhy23l2j7r5shaak6ckvwgretthscx4ytwfut5m";
// Clubs
export var mainDeck40Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeicsl4ey6tyqm4sshs7aappbdpdx4s3mgpuhg4pf6lhg2ry5i6fypm";	// A
export var mainDeck41Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeihhj3yxezzc5in7pu5gbeklrazgcse2ingafbf6xgqwedsvzhxgcy";
export var mainDeck42Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeied5qgvk3y5al7rtu4w6jbrkbathd44jya4hg5fgsjn2m7g2hfchm";
export var mainDeck43Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeih32qnsk5z3esn7r35wuk3fc5hosbwhtlefcz5jeiig7ji4p654yy";
export var mainDeck44Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeihgi6owbc64x2zjack2u2e2ynre5kbtzh2odvkhv3cjhbnxy5tkry";
export var mainDeck45Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeibu45oij4wlktc4rczhjifmtref3kpsmja5ay46f5jinri7almety";
export var mainDeck46Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeicam667cpvax3lxofmlcp5cp5hzdr2lut4mx3mp4h563zpneqkv5e";
export var mainDeck47Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeie4bvib3pgycc4me2efapmnovcuwentlahuyfu3nytnnggelfx4ny";
export var mainDeck48Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeig2qwartbxtv5ocb5s7cbkeywbev6qryj5udoaxeof6ykiaht4d24";
export var mainDeck49Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeif5ajwe6nkbvvo4lxiievscg4gt65rd7ud5fmw2psre2hsigoxwq4";
export var mainDeck50Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeia2ah36lsvgilaal24wv4j22n2ccwhbftpokrqgt3kofairxclzga";
export var mainDeck51Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeiewpnsl2lndtm7y3drqzlz6bv3n6jdd7fvlgnfuf4wjlqtle7wue4";
export var mainDeck52Ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeid6a6vngp2h4ucvaoqpvyshn7nz3o7oce3qv4lc3q6vw7kcinwpvm";
