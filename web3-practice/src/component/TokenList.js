import Erc721 from "./Erc721";
import React from 'react';

function TokenList({newErc721addr, web3, account, erc721list}){
    return(
        <div className="tokenlist">
            <Erc721 newErc721addr = {newErc721addr} web3 = {web3} account = {account} erc721list = {erc721list}/>
        </div>
    )
}

export default TokenList;