import Web1337 from './index.js';
import crypto from './crypto_primitives/crypto.js';
import bls from './crypto_primitives/bls.js';

let web1337 = new Web1337('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',0,'http://localhost:7331');



// let myKeyPair = {

//     mnemonic: 'south badge state hedgehog carpet aerobic float million enforce opinion hungry race',
//     bip44Path: "m/44'/7331'/0'/0'",
//     pub: '2VEzwUdvSRuv1k2JaAEaMiL7LLNDTUf9bXSapqccCcSb',
//     prv: 'MC4CAQAwBQYDK2VwBCIEIDEf/4H5iiY3ebAfWsFIFkeZrB8HpcvBYK5zjEe9/8ga'
  
// }


let blsPrivate = await bls.generatePrivateKey()

console.log(blsPrivate)

let blsPub = await bls.derivePubKey(blsPrivate)

console.log(blsPub)

let partialSignature = await web1337.signDataForMultisigTxAsOneOfTheActive(blsPrivate,blsPub,[],1,5,'7GPupbq1vtKUgaqVeHiDbEJcxS7sSjwPnbht4eRaDBAEJv8ZKHNCSu2Am3CuWnHjta',10)

let tx = await web1337.createMultisigTransaction(blsPub,partialSignature,[],1,5,'7GPupbq1vtKUgaqVeHiDbEJcxS7sSjwPnbht4eRaDBAEJv8ZKHNCSu2Am3CuWnHjta',10)

console.log(tx)




// await web1337.createDefaultEvent(myKeyPair.pub,myKeyPair.prv,0,'7GPupbq1vtKUgaqVeHiDbEJcxS7sSjwPnbht4eRaDBAEJv8ZKHNCSu2Am3CuWnHjta',5,10)

// console.log(myKeyPair)