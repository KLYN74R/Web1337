import Web1337 from '../../../../../../index.js';

import fs from 'fs';


let web1337 = new Web1337({

    chainID:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    workflowVersion:0,
    nodeURL: 'http://localhost:7333'

});

let contractBytecode = fs.readFileSync('./examples/smart_contracts/kly_wvm/users_contracts/assemblyscript/simple_get_set_contract/contract.wasm').toString('hex');

let payload = {

    bytecode:contractBytecode,

    lang:'AssemblyScript',

    constructorParams:{
        initStorage:{

            nameHandler:{name:"Name_1"}

        }
    }

}

let keypair = {
    
    pub:"9GQ46rqY238rk2neSwgidap9ww5zbAN4dyqyC7j5ZnBK",
    
    prv:"MC4CAQAwBQYDK2VwBCIEILdhTMVYFz2GP8+uKUA+1FnZTEdN8eHFzbb8400cpEU9",

}


const shardID = "shard_0"

const fee = 0.03

const nonce = await web1337.getAccount(shardID,keypair.pub).then(account=>account.nonce+1)

const txType = "WVM_CONTRACT_DEPLOY"

let tx = web1337.createEd25519Transaction(shardID,txType,keypair.pub,keypair.prv,nonce,fee,payload)

const contractID = web1337.blake3(shardID+tx.creator+tx.nonce)


console.log('Contract ID: '+contractID)

console.log(`Full contract ID: ${shardID}:${contractID}`)

console.log(`TX ID is => `,web1337.blake3(tx.sig))

// console.log('TX is => ',tx)


// Send contract deployment transaction

web1337.sendTransaction(tx).then(()=>{

    console.log('Sent')

}).catch(err=>console.error('Error during contract deployment: ',err))