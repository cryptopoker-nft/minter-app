import React from "react";


// returns a deck of cards object that can be used to build a hand, with IPFS art metadata
export function buildDeck() {
	var deck = [
        {id: 1, display: "A♠️", value: 1, suit: "spades", solo: "AS", ipfs_cid:"bafybeicm6dqkpiop65z6i2peua54chs3bk7snakajwecre4oixsmswfwym"},
        {id: 2, display: "2♠️", value: 2, suit: "spades", solo: "2S", ipfs_cid:"bafybeicbh7ha56qzjc2yfrmnwhi6sy4xaougfccthyayiij3rkma3ycgte"},
        {id: 3, display: "3♠️", value: 3, suit: "spades", solo: "3S", ipfs_cid:"bafybeif64xmkdw37g3j3hbgbk6zjr652tbfnomenspn4qs2ghckvqhywsa"},
        {id: 4, display: "4♠️", value: 4, suit: "spades", solo: "4S", ipfs_cid:"bafybeibnkq7djhqw5dp67peds6jidp3dvjdxmzkucaap3y5fhqpkpchkla"},
        {id: 5, display: "5♠️", value: 5, suit: "spades", solo: "5S", ipfs_cid:"bafybeifabkwl35c7vjkk32zypzaf3mah7eakuk3zw36u7an7yxkmmygveq"},
        {id: 6, display: "6♠️", value: 6, suit: "spades", solo: "6S", ipfs_cid:"bafybeiccv32yxyi75cmyu3lyggpkul6gyedddv3q3o3mxmqa4qlvoclnfu"},
        {id: 7, display: "7♠️", value: 7, suit: "spades", solo: "7S", ipfs_cid:"bafybeiasu3edvhxjjnw65r3jrrvjessmt5pkf33ytivl2tc5jrncy37eiq"},
        {id: 8, display: "8♠️", value: 8, suit: "spades", solo: "8S", ipfs_cid:"bafybeibdiuodmblfk4ecnk6o3n2hltfg2j6nwvu6uzdby7docx22rcdd3q"},
        {id: 9, display: "9♠️", value: 9, suit: "spades", solo: "9S", ipfs_cid:"bafybeidpsqiaxnxpgockpht7ecqaeu5pb33uwca5gbodalcdihb66fyqyy"},
        {id: 10, display: "10♠️", value: 10, suit: "spades", solo: "TS", ipfs_cid:"bafybeihwnp5lbmh7hxlayygx6hl7av54dcdblbatyqblddycgtmflkya2a"},
        {id: 11, display: "J♠️", value: 11, suit: "spades", solo: "JS", ipfs_cid:"bafybeidvz3a5y55rxwcstuvys7b4g56hnrcfnmp7qdfvinwl4nde6wztja"},
        {id: 12, display: "Q♠️", value: 12, suit: "spades", solo: "QS", ipfs_cid:"bafybeic2bp2uohmqsbs3aa3sqn5olkdj43pf6g4nkc7jejfm6h74udh6gq"},
        {id: 13, display: "K♠️", value: 13, suit: "spades", solo: "KS", ipfs_cid:"bafybeibckznpp76427qsd4hf74epva445fmuloeid4jicttrgdcgkj2pmy"},
        {id: 14, display: "A♥️", value: 1, suit: "hearts", solo: "AH", ipfs_cid:"bafybeicc5ppnndblirjsvszgqbnj2cuakoladvrbdwz7dsdi47z4kcssl4"},
        {id: 15, display: "2♥️", value: 2, suit: "hearts", solo: "2H", ipfs_cid:"bafybeie7lbe7piavel4celocm4nitytkjdb4c4j6b2qvgpl2xph2up22ty"},
        {id: 16, display: "3♥️", value: 3, suit: "hearts", solo: "3H", ipfs_cid:"bafybeidlhzopv5di4i4j5pu7sh5i7hrjxmafxyrrjhaway73ebyg5qcuxu"},
        {id: 17, display: "4♥️", value: 4, suit: "hearts", solo: "4H", ipfs_cid:"bafybeigo5ng5z7rur6godmnyehbbwzpciy7gatefaavomyxhojxxnlj4qe"},
        {id: 18, display: "5♥️", value: 5, suit: "hearts", solo: "5H", ipfs_cid:"bafybeigtyxk6bsok6y7bva4rbjblghvrarb5bjpu7mrelklmwdhvcagihm"},
        {id: 19, display: "6♥️", value: 6, suit: "hearts", solo: "6H", ipfs_cid:"bafybeif3nrxgwmr4cxzayvv5q5wcvkoj2zkr7fhvgfxbiceg3ge7nctxq4"},
        {id: 20, display: "7♥️", value: 7, suit: "hearts", solo: "7H", ipfs_cid:"bafybeiatbyhy2jkssj7gfq5brfc2fklvkctewwmzaozuzktmu6nr57kxsi"},
        {id: 21, display: "8♥️", value: 8, suit: "hearts", solo: "8H", ipfs_cid:"bafybeichdgpmuzhvcalw7c3cng5hyiapl33l3mnfn5a7aien6h5n2kbwxe"},
        {id: 22, display: "9♥️", value: 9, suit: "hearts", solo: "9H", ipfs_cid:"bafybeicd6gb4c267tfebbunv7gjh2sr5syui4z5y6iheofu7wunzeplh64"},
        {id: 23, display: "10♥️", value: 10, suit: "hearts", solo: "TH", ipfs_cid:"bafybeihgkio5we23api2q6soldkjecu4qx6jc7lh7tmxoakpdjcho3g4p4"},
        {id: 24, display: "J♥️", value: 11, suit: "hearts", solo: "JH", ipfs_cid:"bafybeighdsvapdmvxkzgaqxmbsyi426oh6hx2kyh5jwumly7pldznudetm"},
        {id: 25, display: "Q♥️", value: 12, suit: "hearts", solo: "QH", ipfs_cid:"bafybeihvuvbvozmsl5ynyyby5jbt7ftlpbep3niiek7fww5xiwtdibnjbm"},
        {id: 26, display: "K♥️", value: 13, suit: "hearts", solo: "KH", ipfs_cid:"bafybeie5hsefyfvdwda6ybs5laaqvtq6iay4kwtqe4zlthh74hznaiqb7i"},
        {id: 27, display: "A♦️", value: 1, suit: "diamonds", solo: "AD", ipfs_cid:"bafybeidyyl5je3sssgu2cqtbfsiudu3uphgzwsavtjgdlum4vhuifh26bm"},
        {id: 28, display: "2♦️", value: 2, suit: "diamonds", solo: "2D", ipfs_cid:"bafybeidwksaegho7jlexc4rlnzqkppk6vl4nt5bwxta3a2ek6mvwevhrdy"},
        {id: 29, display: "3♦️", value: 3, suit: "diamonds", solo: "3D", ipfs_cid:"bafybeieyvtgq2j3ulbf6elt2z5d7exuzwfekekjntrkj7jchnwddpd5n4i"},
        {id: 30, display: "4♦️", value: 4, suit: "diamonds", solo: "4D", ipfs_cid:"bafybeibgfzlbwtmjgjaftorge5oigvut3wfcre3yv7hg6sbkuhpfk76udi"},
        {id: 31, display: "5♦️", value: 5, suit: "diamonds", solo: "5D", ipfs_cid:"bafybeigxbtmrtpvjercmh72smnfruiht7vvjqs2brbavifmxpe6j73jtk4"},
        {id: 32, display: "6♦️", value: 6, suit: "diamonds", solo: "6D", ipfs_cid:"bafybeidpswgtgldpydipzf7d6h7eyeouazbazqumtwzueeoucke3chtu5y"},
        {id: 33, display: "7♦️", value: 7, suit: "diamonds", solo: "7D", ipfs_cid:"bafybeicixdgug5kbyx74taqwabv5i33vtxqvywsxcyhin6xgc4afhoaiuu"},
        {id: 34, display: "8♦️", value: 8, suit: "diamonds", solo: "8D", ipfs_cid:"bafybeic2cwfv3iv3d7jazyc44kzn5kzsc3pyhpkabqxpyiqdbapmc322bu"},
        {id: 35, display: "9♦️", value: 9, suit: "diamonds", solo: "9D", ipfs_cid:"bafybeickwbzgnerdryvsmbnsrc6w7kgicporfa62k2hgrlbb43hqy4avgi"},
        {id: 36, display: "10♦️", value: 10, suit: "diamonds", solo: "TD", ipfs_cid:"bafybeih6vf6e3e6efv5omyygbbbs6hukyb7ixnzx76eljliqutl5q4gkve"},
        {id: 37, display: "J♦️", value: 11, suit: "diamonds", solo: "JD", ipfs_cid:"bafybeibk7tk5o5mycksi7b7o2zgarbgkphbr2yxj3vj277n7uc5cakdxtq"},
        {id: 38, display: "Q♦️", value: 12, suit: "diamonds", solo: "QD", ipfs_cid:"bafybeiczvslukdwq2eprqp5qnvfycuxco5yfiu4pe2v26ckdbuypkqmtyi"},
        {id: 39, display: "K♦️", value: 13, suit: "diamonds", solo: "KD", ipfs_cid:"bafybeidyh3qsd7qwshuyhy23l2j7r5shaak6ckvwgretthscx4ytwfut5m"},
        {id: 40, display: "A♣️", value: 1, suit: "clubs", solo: "AC", ipfs_cid:"bafybeicsl4ey6tyqm4sshs7aappbdpdx4s3mgpuhg4pf6lhg2ry5i6fypm"},
        {id: 41, display: "2♣️", value: 2, suit: "clubs", solo: "2C", ipfs_cid:"bafybeihhj3yxezzc5in7pu5gbeklrazgcse2ingafbf6xgqwedsvzhxgcy"},
        {id: 42, display: "3♣️", value: 3, suit: "clubs", solo: "3C", ipfs_cid:"bafybeied5qgvk3y5al7rtu4w6jbrkbathd44jya4hg5fgsjn2m7g2hfchm"},
        {id: 43, display: "4♣️", value: 4, suit: "clubs", solo: "4C", ipfs_cid:"bafybeih32qnsk5z3esn7r35wuk3fc5hosbwhtlefcz5jeiig7ji4p654yy"},
        {id: 44, display: "5♣️", value: 5, suit: "clubs", solo: "5C", ipfs_cid:"bafybeihgi6owbc64x2zjack2u2e2ynre5kbtzh2odvkhv3cjhbnxy5tkry"},
        {id: 45, display: "6♣️", value: 6, suit: "clubs", solo: "6C", ipfs_cid:"bafybeibu45oij4wlktc4rczhjifmtref3kpsmja5ay46f5jinri7almety"},
        {id: 46, display: "7♣️", value: 7, suit: "clubs", solo: "7C", ipfs_cid:"bafybeicam667cpvax3lxofmlcp5cp5hzdr2lut4mx3mp4h563zpneqkv5e"},
        {id: 47, display: "8♣️", value: 8, suit: "clubs", solo: "8C", ipfs_cid:"bafybeie4bvib3pgycc4me2efapmnovcuwentlahuyfu3nytnnggelfx4ny"},
        {id: 48, display: "9♣️", value: 9, suit: "clubs", solo: "9C", ipfs_cid:"bafybeig2qwartbxtv5ocb5s7cbkeywbev6qryj5udoaxeof6ykiaht4d24"},
        {id: 49, display: "10♣️", value: 10, suit: "clubs", solo: "TC", ipfs_cid:"bafybeif5ajwe6nkbvvo4lxiievscg4gt65rd7ud5fmw2psre2hsigoxwq4"},
        {id: 50, display: "J♣️", value: 11, suit: "clubs", solo: "JC", ipfs_cid:"bafybeia2ah36lsvgilaal24wv4j22n2ccwhbftpokrqgt3kofairxclzga"},
        {id: 51, display: "Q♣️", value: 12, suit: "clubs", solo: "QC", ipfs_cid:"bafybeiewpnsl2lndtm7y3drqzlz6bv3n6jdd7fvlgnfuf4wjlqtle7wue4"},
        {id: 52, display: "K♣️", value: 13, suit: "clubs", solo: "KC", ipfs_cid:"bafybeid6a6vngp2h4ucvaoqpvyshn7nz3o7oce3qv4lc3q6vw7kcinwpvm"}
    ];

	return deck;
}