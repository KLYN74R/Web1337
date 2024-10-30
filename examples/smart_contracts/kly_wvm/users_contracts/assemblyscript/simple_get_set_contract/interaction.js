import Web1337 from '../../../../../../index.js';


let web1337 = new Web1337({

    chainID:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    workflowVersion:0,
    nodeURL: 'http://localhost:7332'

});


// console.log(await web1337.getQuorumUrlsAndPubkeys())

let payload = {

    contractID:'97f1850172e063abe19c17efc6fb4a9af852cd40d15fb22bf3b168460affe950',

    method:'changeName',

    gasLimit:20_000_000,

    params:{name:"Name_2"},

    imports:["getFromState","setToState"]
}


let keypair = {
    
    pub:"9GQ46rqY238rk2neSwgidap9ww5zbAN4dyqyC7j5ZnBK",
    
    prv:"MC4CAQAwBQYDK2VwBCIEILdhTMVYFz2GP8+uKUA+1FnZTEdN8eHFzbb8400cpEU9",

}


const shardID = "shard_0"

const fee = 2

const nonce = await web1337.getAccount(shardID,keypair.pub).then(account=>account.nonce+3)

const txType = "WVM_CALL"

let tx = web1337.createEd25519Transaction(shardID,txType,keypair.pub,keypair.prv,nonce,fee,payload)

console.log(tx)

web1337.sendTransaction(tx).then(()=>{

    console.log('Sent')

    console.log(`TX ID is => `,web1337.blake3(tx.sig))

}).catch(err=>console.error('Error during contract deployment: ',err))