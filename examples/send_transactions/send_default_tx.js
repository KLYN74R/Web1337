import Web1337 from '../../index.js'


let web1337 = new Web1337({

    symbioteID:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    workflowVersion:0,
    nodeURL: 'http://localhost:7332'

});



// Get it using await crypto.kly.generateDefaultEd25519Keypair()

// Your funds will be moved from this subchain to recepient acccount on the same subchain
// Default ed25519 Solana compatible address. Your KLY will be transfered to this account binded to <subchain>

const myKeyPair = {

    mnemonic: 'south badge state hedgehog carpet aerobic float million enforce opinion hungry race',
    bip44Path: "m/44'/7331'/0'/0'",
    pub: '2VEzwUdvSRuv1k2JaAEaMiL7LLNDTUf9bXSapqccCcSb',
    prv: 'MC4CAQAwBQYDK2VwBCIEIDEf/4H5iiY3ebAfWsFIFkeZrB8HpcvBYK5zjEe9/8ga'
      
}


const subchain = '7GPupbq1vtKUgaqVeHiDbEJcxS7sSjwPnbht4eRaDBAEJv8ZKHNCSu2Am3CuWnHjta'

const recipient = 'nXSYHp74u88zKPiRi7t22nv4WCBHXUBpGrVw3V93f2s'

const from = myKeyPair.pub

const myPrivateKey = myKeyPair.prv

const nonce = 0

const fee = 1

const amountInKLY = 13.37


let signedTx = await web1337.createDefaultTransaction(subchain,from,myPrivateKey,nonce,recipient,fee,amountInKLY)

console.log(signedTx)


let txStatus = await web1337.sendTransaction(signedTx)

console.log(txStatus)

// After that - you can check the tx receipt

let receipt = await web1337.getTransactionReceiptById(web1337.BLAKE3(signedTx.sig))