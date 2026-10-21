import React from "react";
//art

//connect
import { useAccount } from 'wagmi';

import { ClaimContent } from '../components/claimContent.jsx';
import { ClaimInfo } from '../components/claimInfo.jsx';


export const Claim = ({cu, cc, setPage}) => {

    const { isConnected } = useAccount();

    if(isConnected){
        // console.log(cu)        // show currentUser object

        return (<>
            <ClaimContent cu={cu} cc={cc} setPage={setPage} />
            <ClaimInfo />
        </>);
    } else {
        return (<>
        <p>Please Connect Wallet.</p>
        </>);
    }

}