/*

You can get the keypair using this snippet

import bls from './crypto_primitives/bls.js';

let blsPrivate = await bls.generatePrivateKey()

console.log(blsPrivate)

let blsPub = await bls.derivePubKey(blsPrivate)

console.log(blsPub)


*/


import Web1337 from '../index.js';


let web1337 = new Web1337('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',0,'http://localhost:7331');


let testAccount = {

    prv:"af837c459929895651315e878f4917c7622daeb522086ec95cfe64fed2496867",
    
    pub:"7GPupbq1vtKUgaqVeHiDbEJcxS7sSjwPnbht4eRaDBAEJv8ZKHNCSu2Am3CuWnHjta"

}


let recipient = '2VEzwUdvSRuv1k2JaAEaMiL7LLNDTUf9bXSapqccCcSb'


let partialSignature = await web1337.signDataForMultisigTxAsOneOfTheActive(testAccount.prv,testAccount.pub,[],1,5,recipient,10)

let tx = await web1337.createMultisigTransaction(testAccount.pub,partialSignature,[],1,5,recipient,10)

console.log(tx)

