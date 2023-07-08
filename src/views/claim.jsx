import React from "react";
//art

//connect
import { useAccount } from 'wagmi';

import { ClaimContent } from '../components/claimContent.jsx';
import { ClaimInfo } from '../components/claimInfo.jsx';
import { MySendTransaction } from "../components/sendTest.jsx";


export const Claim = ({cu, setPage}) => {

    const { isConnected } = useAccount();

    if(isConnected){
        // console.log(cu)        // show currentUser object

        return (<>
            <ClaimContent cu={cu} setPage={setPage} />
            <ClaimInfo />
            <MySendTransaction />
        </>);
    } else {
        return (<>
        <p>Please Connect Wallet.</p>
        </>);
    }

}