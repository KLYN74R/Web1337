import Web1337 from '../../index.js';


let web1337 = new Web1337({

    chainID:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    workflowVersion:0,
    nodeURL: 'http://localhost:7332'

});


let keypair = {
    
    pub: "0xb2ec32c9d7216163790ba3628a6a6b5a12db457c933b1f4627775b6dae468636233c6ad9931a8ef848a58353e60d33dd",
    
    prv:"3981d303762bd2016644021e95052c50cb0916470a7eb36205bb12b97913523a"

}

let payload = {

    active: keypair.pub, // aggregated pubkey of signers

    afk:[],

    to: "nXSYHp74u88zKPiRi7t22nv4WCBHXUBpGrVw3V93f2s",

    amount: 13.37

}


const shardID = "shard_0"

const fee = 0.03

const nonce = 0

const txType = 'TX'


let signa = web1337.signDataForMultisigTransaction(shardID,txType,keypair.prv,nonce,fee,payload)

let tx = web1337.createMultisigTransaction(txType,keypair.pub,signa,nonce,fee,payload)

console.log(tx)
