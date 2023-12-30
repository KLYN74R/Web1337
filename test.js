import {crypto} from './index.js';


let threshold = 2; // 2/3

let myPubId = 1; // our ID

let pubKeysArr = [1,2,3]; // array of identifiers of all members


let {verificationVector: verificationVector1,secretShares: secretShares1,id: id1} = crypto.tbls.generateTBLS(threshold,myPubId,pubKeysArr);


console.log('Use with VV => ',verificationVector1);
console.log('Array of secret shares to share among friends => ',secretShares1);
console.log('Your id => ',id1);


let {verificationVector: verificationVector2,secretShares: secretShares2,id: id2} = crypto.tbls.generateTBLS(threshold,2,pubKeysArr);
let {verificationVector: verificationVector3,secretShares: secretShares3,id: id3} = crypto.tbls.generateTBLS(threshold,3,pubKeysArr);

let rootPub = crypto.tbls.deriveGroupPubTBLS([verificationVector1,verificationVector2,verificationVector3])

console.log(rootPub)


// let secretKey1 = '375c39b3ab706e40eb4f9f44fb367aa5a200a4d00a022535011e391d0f2c1e6e'

// let publicKey1 = crypto.bls.derivePubKeyFromHexPrivateKey(secretKey1)

// console.log('PubKey is ',publicKey1)

// let msg = 'Hello, BLS!'

// let signature1 = await crypto.bls.singleSig(msg,secretKey1)

// console.log('Signa 1 is => ',signature1)

// let secretKey2 = '12424ad4888e8c61626ffdc5347b9d741965923c0450135790759203106f0968'

// let publicKey2 = crypto.bls.derivePubKeyFromHexPrivateKey(secretKey2)

// console.log('PubKey 2 is ',publicKey2)

// let signature2 = await crypto.bls.singleSig(msg,secretKey2)

// console.log('Signa 2 is => ',signature2)

// // Aggregate public keys & signatures

// let rootPub = await crypto.bls.aggregatePublicKeys([publicKey1,publicKey2])

// console.log('Rootpub is => ',rootPub)


// let aggregatedSignature = await crypto.bls.aggregateSignatures([signature1,signature2])

// console.log('Aggregated signa is => ',aggregatedSignature)

// console.log('Is aggregated signa ok ? => ',await crypto.bls.singleVerify(msg,rootPub,aggregatedSignature))

// console.log('Is threshold signa ok ? => ',await crypto.bls.verifyThresholdSignature(publicKey1,[publicKey2],rootPub,msg,signature1,1))




// import { Wallet } from 'ethers';

// // Ваш ID цепи (chainId)
// const chainId = 7331; // Например, 1 для Ethereum Mainnet

// // Создайте новый кошелек
// const wallet = Wallet.createRandom({chainId});



// // Выведите приватный и публичный ключи
// console.log('Private Key:', wallet.privateKey);
// console.log('Public Key:', wallet.address);

// console.log(wallet.mnemonic)

// console.log(Wallet.fromPhrase(wallet.mnemonic.phrase,{chainId}))

// console.log(Wallet.fromPhrase(wallet.mnemonic.phrase))


// const firstKeypairInChain = {
//     mnemonic: 'final lottery shell supply lottery doll drive flavor awesome tool matter argue',
//     bip44Path: "m/44'/7331'/0'/0'",
//     pub: '5oFCA179BeABvcUx921adoU4N9mXGGGS6DaoAwcTgFzs',
//     prv: 'MC4CAQAwBQYDK2VwBCIEIB5ghaD82U+RixQ9KuGtFwADQu1FMVl4dTWs1zd094Q2'
// }

// console.log('0 in chain => ',await crypto.kly.generateDefaultEd25519Keypair(firstKeypairInChain.mnemonic,firstKeypairInChain.bip44Path,'HelloKlyntar'))
// console.log('1 in chain => ',await crypto.kly.generateDefaultEd25519Keypair(firstKeypairInChain.mnemonic,"m/44'/7331'/0'/1'",'HelloKlyntar'))
// console.log('2 in chain => ',await crypto.kly.generateDefaultEd25519Keypair(firstKeypairInChain.mnemonic,"m/44'/7331'/0'/2'",'HelloKlyntar'))


// let blissKeyPair = crypto.pqc.bliss.generateBlissKeypair()

// console.log(blissKeyPair)

// let signa = globalThis.generateBlissSignature(blissKeyPair.privateKey,'Hello World')

// console.log('Signa is ',signa);

// console.log('Is verified => ',globalThis.verifyBlissSignature('Hello World',blissKeyPair.pubKey,signa))

// console.log('Is verified => ',globalThis.verifyBlissSignature('Hello World X',blissKeyPair.pubKey,signa))




// await crypto.kly.generateDefaultEd25519Keypair()

// let privateKey1 = await bls.generatePrivateKey()
// let publicKey1 = bls.derivePubKey(privateKey1)

// let privateKey2 = await bls.generatePrivateKey()
// let publicKey2 = bls.derivePubKey(privateKey2)

// let privateKey3 = await bls.generatePrivateKey()
// let publicKey3 = bls.derivePubKey(privateKey3)

// let privateKey4 = await bls.generatePrivateKey()
// let publicKey4 = bls.derivePubKey(privateKey4)


// console.log(`Pair 1 => ${privateKey1} : ${publicKey1}`)
// console.log(`Pair 2 => ${privateKey2} : ${publicKey2}`)
// console.log(`Pair 3 => ${privateKey3} : ${publicKey3}`)
// console.log(`Pair 4 => ${privateKey4} : ${publicKey4}`)


// let publicKey1 = '6Pz5B3xLQKDxtnESqk3tWnsd4kwkVYLNsvgKJy31HssK3eGSy7Tvratk5pZNFW5z8S'
// let privateKey1 = '6bcdb86cd8f9d24e9fe934905431de5c224499af8788bf12cae8597f0af4cb23'

// let publicKey2 = '5uj1Sgrvo9mwF6v8Z3Kxe4arQcu53Q2z9QBYsRPWCdo972jBeL8hD3Kmo4So3dSLt5'
// let privateKey2 = 'e5ca94e2c60cbb3ca9d5f9c233a99f01e3250ef62bd48fbc09caf25ae70040b5'

// let publicKey3 = '6ZmLf52hp5FgCxuaNJ6Jmi2M7FSJTr115WRMuV1yCvEihepnEKJBhgopDMpUKLpe2F'
// let privateKey3 = 'ead8698b5ef285e6019e22e54dfe2c592c020946e803df8c6e79f98baf849d48'

// let publicKey4 = '61tPxmio9Y21GtkiyYG3qTkreKfqm6ktk7MVk2hxqiXVURXxM6qNb9vPfvPPbhpMDn'
// let privateKey4 = '414230b72c59ac8db6ec47b629607057edaa5c7c553d44b4b9fd1c0090141c5a'


// let rootPubKey = bls.aggregatePublicKeys([publicKey1,publicKey2,publicKey3,publicKey4])

// console.log('RootPubKey => ',rootPubKey)


// const myKeyPair = {

//     mnemonic: 'south badge state hedgehog carpet aerobic float million enforce opinion hungry race',
//     bip44Path: "m/44'/7331'/0'/0'",
//     pub: '2VEzwUdvSRuv1k2JaAEaMiL7LLNDTUf9bXSapqccCcSb',
//     prv: 'MC4CAQAwBQYDK2VwBCIEIDEf/4H5iiY3ebAfWsFIFkeZrB8HpcvBYK5zjEe9/8ga'
      
// }




// const from = myKeyPair.pub

// const myPrivateKey = myKeyPair.prv

// const nonce = 0

// const fee = 1

// const amountInKLY = 13.37


// let signedTx = await web1337.createDefaultTransaction(subchain,from,myPrivateKey,nonce,recipient,fee,amountInKLY,1)

// console.log(signedTx)

// const subchain = '7GPupbq1vtKUgaqVeHiDbEJcxS7sSjwPnbht4eRaDBAEJv8ZKHNCSu2Am3CuWnHjta'

// const recipient = '68Bpgi6MbRX9q3T9h8DDWomPGu85HqWSfPMT23r6g29xyn1dN7qfquwxpfFNMdMpU1'

// let accountInfo  = await web1337.getFromState(subchain,recipient)

// console.log('Account ',accountInfo)


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