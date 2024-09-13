import Web1337 from '../../../../index.js';


let web1337 = new Web1337({

    chainID:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    workflowVersion:0,
    nodeURL: 'http://localhost:7332'

});


console.log(await web1337.getQuorumUrlsAndPubkeys())



let payload = {

    contractID:'system/dao_voting',

    method:'votingAccept',

    gasLimit:0,
    
    params:[

        {
            votingType:'parameters',

            paylaod:{

                updateField:'',

                newValue:''

            },

            quorumAgreements:{}
        }

    ],

    imports:[]

}

let keypair = {
    
    pub:"9GQ46rqY238rk2neSwgidap9ww5zbAN4dyqyC7j5ZnBK",
    
    prv:"MC4CAQAwBQYDK2VwBCIEILdhTMVYFz2GP8+uKUA+1FnZTEdN8eHFzbb8400cpEU9",

}


const shardID = "shard_0"

const fee = 0.03

const nonce = 0

const txType = "WVM_CALL"

let tx = web1337.createEd25519Transaction(shardID,txType,keypair.pub,keypair.prv,nonce,fee,payload)

console.log(tx)
