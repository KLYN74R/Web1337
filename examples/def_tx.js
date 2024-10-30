import Web1337 from '../index.js';


let web1337 = new Web1337({

    chainID:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    workflowVersion:0,
    nodeURL: 'http://localhost:7332'

});


const keypair = {
    
    pub:"9GQ46rqY238rk2neSwgidap9ww5zbAN4dyqyC7j5ZnBK",
    
    prv:"MC4CAQAwBQYDK2VwBCIEILdhTMVYFz2GP8+uKUA+1FnZTEdN8eHFzbb8400cpEU9",

};

const shardID = "shard_0";

const payload = {

    to: "0x407d73d8a49eeb85d32cf465507dd71d507100c1",

    amount: 13.37,
    
    shard: shardID,

    touchedAccounts:["9GQ46rqY238rk2neSwgidap9ww5zbAN4dyqyC7j5ZnBK","0x407d73d8a49eeb85d32cf465507dd71d507100c1"]

};

const fee = 0.03;

const nonce = await web1337.getAccount(shardID,keypair.pub).then(account=>account.nonce+1);

const txType = "TX";

let tx = web1337.createEd25519Transaction(shardID,txType,keypair.pub,keypair.prv,nonce,fee,payload);

console.log(tx);




let sendStatus = await web1337.sendTransaction(tx);

console.log(sendStatus);