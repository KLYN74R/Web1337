import Web1337 from '../../../../../../index.js';

import fs from 'fs';


let web1337 = new Web1337({

    chainID:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    workflowVersion:0,
    nodeURL: 'http://localhost:7332'

});


// console.log(await web1337.getQuorumUrlsAndPubkeys())

let contractBytecode = fs.readFileSync('./examples/smart_contracts/kly_wvm/users_contracts/assemblyscript/simple_get_set_contract/contract.wasm').toString('hex');

let payload = {

    bytecode:contractBytecode,

    lang:'ASC',

    constructorParams:{
        initStorage:{}
    }

}

let keypair = {
    
    pub:"9GQ46rqY238rk2neSwgidap9ww5zbAN4dyqyC7j5ZnBK",
    
    prv:"MC4CAQAwBQYDK2VwBCIEILdhTMVYFz2GP8+uKUA+1FnZTEdN8eHFzbb8400cpEU9",

}


const shardID = "shard_0"

const fee = 0.03

const nonce = 0

const txType = "WVM_CONTRACT_DEPLOY"

let tx = web1337.createEd25519Transaction(shardID,txType,keypair.pub,keypair.prv,nonce,fee,payload)

console.log(tx)
