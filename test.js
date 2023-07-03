import Web1337 from './index.js';
import crypto from './crypto_primitives/crypto.js';
import bls from './crypto_primitives/bls.js';

let web1337 = new Web1337({

    symbioteID:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    workflowVersion:0,
    nodeURL: 'http://localhost:7332'

});


// let currentCheckpoint = await web1337.getCurrentCheckpoint()

// console.log(currentCheckpoint)

// let afpForFirstBlock = await web1337.getAggregatedFinalizationProofForBlock('7GPupbq1vtKUgaqVeHiDbEJcxS7sSjwPnbht4eRaDBAEJv8ZKHNCSu2Am3CuWnHjta:0')

// console.log(afpForFirstBlock)


// let firstBlock = await web1337.getBlockByBlockID('7GPupbq1vtKUgaqVeHiDbEJcxS7sSjwPnbht4eRaDBAEJv8ZKHNCSu2Am3CuWnHjta:0')

// console.log(firstBlock)



// let firstBlockByGRID = await web1337.getBlockByGRID(0)

// console.log(firstBlockByGRID)



// let infrastructureInfo = await web1337.getGeneralInfoAboutKLYInfrastructure()

// console.log(infrastructureInfo)



// let syncState = await web1337.getSyncState()

// console.log(syncState)



web1337.deployContractForKlyWvm


// let myKeyPair = {

//     mnemonic: 'south badge state hedgehog carpet aerobic float million enforce opinion hungry race',
//     bip44Path: "m/44'/7331'/0'/0'",
//     pub: '2VEzwUdvSRuv1k2JaAEaMiL7LLNDTUf9bXSapqccCcSb',
//     prv: 'MC4CAQAwBQYDK2VwBCIEIDEf/4H5iiY3ebAfWsFIFkeZrB8HpcvBYK5zjEe9/8ga'
  
// }


// let blsPrivate = await bls.generatePrivateKey()

// console.log(blsPrivate)

// let blsPub = await bls.derivePubKey(blsPrivate)

// console.log(blsPub)

// let partialSignature = await web1337.signDataForMultisigTxAsOneOfTheActiveSigners(blsPrivate,blsPub,[],1,5,'7GPupbq1vtKUgaqVeHiDbEJcxS7sSjwPnbht4eRaDBAEJv8ZKHNCSu2Am3CuWnHjta',10)

// let tx = await web1337.createMultisigTransaction(blsPub,partialSignature,[],1,5,'7GPupbq1vtKUgaqVeHiDbEJcxS7sSjwPnbht4eRaDBAEJv8ZKHNCSu2Am3CuWnHjta',10)

// console.log(tx)




// await web1337.createDefaultTransaction(myKeyPair.pub,myKeyPair.prv,0,'7GPupbq1vtKUgaqVeHiDbEJcxS7sSjwPnbht4eRaDBAEJv8ZKHNCSu2Am3CuWnHjta',5,10)

// console.log(myKeyPair)