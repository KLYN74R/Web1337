/*

You can get the keypair using this snippet

import bls from './crypto_primitives/bls.js';

let blsPrivate = await bls.generatePrivateKey()

console.log(blsPrivate)

let blsPub = await bls.derivePubKey(blsPrivate)

console.log(blsPub)


*/


import Web1337,{bls} from '../../index.js'


let web1337 = new Web1337({

    symbioteID:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    workflowVersion:0,
    nodeURL: 'http://localhost:7332'

});



const publicKey1 = '6Pz5B3xLQKDxtnESqk3tWnsd4kwkVYLNsvgKJy31HssK3eGSy7Tvratk5pZNFW5z8S';
const privateKey1 = '6bcdb86cd8f9d24e9fe934905431de5c224499af8788bf12cae8597f0af4cb23';

const publicKey2 = '5uj1Sgrvo9mwF6v8Z3Kxe4arQcu53Q2z9QBYsRPWCdo972jBeL8hD3Kmo4So3dSLt5';
const privateKey2 = 'e5ca94e2c60cbb3ca9d5f9c233a99f01e3250ef62bd48fbc09caf25ae70040b5';

const publicKey3 = '6ZmLf52hp5FgCxuaNJ6Jmi2M7FSJTr115WRMuV1yCvEihepnEKJBhgopDMpUKLpe2F';
const privateKey3 = 'ead8698b5ef285e6019e22e54dfe2c592c020946e803df8c6e79f98baf849d48';

const publicKey4 = '61tPxmio9Y21GtkiyYG3qTkreKfqm6ktk7MVk2hxqiXVURXxM6qNb9vPfvPPbhpMDn';
const privateKey4 = '414230b72c59ac8db6ec47b629607057edaa5c7c553d44b4b9fd1c0090141c5a';

// General pubkey retrieved from 4 friends public keys
const rootPubKey = bls.aggregatePublicKeys([publicKey1,publicKey2,publicKey3,publicKey4]);

// Root pubkey of 3 friends who want to use account
const aggregatePubKeyOfThreeFriends = bls.aggregatePublicKeys([publicKey1,publicKey2,publicKey3]);

// Array of pubkeys of friends who dissenting to sign
const arrayOfAfkSigners = [publicKey4];


// ID of subchain where you want to transfer KLY or call contract
const subchain = '7GPupbq1vtKUgaqVeHiDbEJcxS7sSjwPnbht4eRaDBAEJv8ZKHNCSu2Am3CuWnHjta';

// Now it's PQC
const recipient = 'f5091405e28455880fc4191cbda9f1e57f72399e732222d4639294b66d3a5076';

const from = rootPubKey;

const nonce = 0;

const fee = 1;

const amountInKLY = 13.37;


// Now 3 sides need to sign the same tx data locally(on their devices)

let signature1 = await web1337.signDataForMultisigTxAsOneOfTheActiveSigners(subchain,privateKey1,aggregatePubKeyOfThreeFriends,arrayOfAfkSigners,nonce,fee,recipient,amountInKLY);

let signature2 = await web1337.signDataForMultisigTxAsOneOfTheActiveSigners(subchain,privateKey2,aggregatePubKeyOfThreeFriends,arrayOfAfkSigners,nonce,fee,recipient,amountInKLY);

let signature3 = await web1337.signDataForMultisigTxAsOneOfTheActiveSigners(subchain,privateKey3,aggregatePubKeyOfThreeFriends,arrayOfAfkSigners,nonce,fee,recipient,amountInKLY);


console.log('\n============ Partial signatures ============\n');
console.log(`[0] ${signature1}`);
console.log(`[1] ${signature2}`);
console.log(`[2] ${signature3}`);


// Now, build the transaction, aggregate signatures and send to network

let aggregatedSignatureOfActive = bls.aggregateSignatures([signature1,signature2,signature3]);

let finalTx = await web1337.createMultisigTransaction(from,aggregatePubKeyOfThreeFriends,aggregatedSignatureOfActive,arrayOfAfkSigners,nonce,fee,recipient,amountInKLY);



console.log('\n============ Final signed tx ready to be deployed ============\n');
console.log(finalTx);

