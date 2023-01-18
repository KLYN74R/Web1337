/*

Only general API & functionality present here. We'll extend abilities via modules & other packages and so on


*/


import fetch from 'node-fetch'

// import WS from 'websocket' //https://github.com/theturtle32/WebSocket-Node


export default class {

    constructor(symbioteID,nodeURL,proxy,hostChainTicker,hostchainNodeURL){

        this.proxy=proxy //for TOR/I2P connections

        this.symbiotes = new Map() //symbioteID => nodeURL

        this.hostchains = new Map() //ticker => endpoint(RPC,websocket,etc.)


        //Set the initial values
        this.currentSymbiote = symbioteID

        this.symbiotes.set(symbioteID,nodeURL)

        this.hostchains.set(hostChainTicker,hostchainNodeURL)

    }


    GET_REQUEST_TO_NODE=url=>{

        let nodeUrl = this.symbiotes.get(this.currentSymbiote)

        return fetch(nodeUrl+url).then(r=>r.json()).catch(e=>{

            console.log('_________ ERROR _________')

            console.error(e)

        })

    }


    POST_REQUEST_TO_NODE=(url,payload)=>{

        let nodeUrl = this.symbiotes.get(this.currentSymbiote)

        return fetch(nodeUrl+url,{

            method:'POST',
            body:JSON.stringify(payload)

        }).then(r=>r.json()).catch(e=>{

            console.log('_________ ERROR _________')

            console.error(e)

        })

    }

    
    //____________________________ API _____________________________

    // General info & stats
    getGeneralInfoAboutKLYInfrastructure=()=>this.GET_REQUEST_TO_NODE('/get_my_info')

    getCurrentCheckpoint=()=>this.GET_REQUEST_TO_NODE('/get_quorum')

    getPayloadForCheckpointByHash=hash=>this.GET_REQUEST_TO_NODE('/get_payload_for_checkpoint/'+hash)
    
    getSyncState=()=>this.GET_REQUEST_TO_NODE('/get_sync_state')

    getSymbioteInfo=()=>this.GET_REQUEST_TO_NODE('/get_symbiote_info')


    // Block API
    getBlockByBlockID=blockID=>this.GET_REQUEST_TO_NODE('/block/'+blockID)

    getBlockByRID=rid=>this.GET_REQUEST_TO_NODE('/get_block_by_rid/'+rid)

    
    // Account API
    getAccount=accountID=>this.GET_REQUEST_TO_NODE('/account/'+accountID)


    // Consensus-related API
    getSuperFinalizationProofForBlock=(blockID,blockHash)=>this.GET_REQUEST_TO_NODE('/get_super_finalization/'+blockID+blockHash)



    // Events (txs,contract calls,etc) API
    getEventReceiptById=eventID=>this.GET_REQUEST_TO_NODE('/get_event_receipt/'+eventID)


    getEventTemplate=(workflowVersion,creator,eventType,nonce,fee,payload)=>{

        return {

            v:workflowVersion,
            c:creator,
            t:eventType,
            n:nonce,
            f:fee,
            p:payload

        }

    }


    // Transactions. Default, Multisig, Threshold, Post-quantum

    createDefaultEvent=async(yourAddress,yourPubKey,yourPrivateKey,recipient,amountInKLY,rev_t)=>{


    }

    createMultisigEvent=async(yourAddress,yourPubKey,yourPrivateKey,recipient,amountInKLY,rev_t)=>{



    }

    createThresholdSigEvent=async(yourAddress,yourPubKey,yourPrivateKey,recipient,amountInKLY,rev_t)=>{


    }

    createPostQuantumEvent=async(yourAddress,yourPubKey,yourPrivateKey,recipient,amountInKLY,rev_t)=>{



    }

    //___________________________ SPECIAL OPERATIONS __________________________

    createSpecialOperation=async()=>{}

    sendSpecialOperation=async()=>{}

    //_____________________________ STAKING LOGIC _____________________________

    stakeToPool=async()=>{}

    unstakefromPool=async()=>{}


    //____________________________ CONTRACTS LOGIC ____________________________

    getContractMetadata=contractID=>this.GET_REQUEST_TO_NODE('/account/'+contractID)

    getContractStorage=(contractID,storageName)=>this.GET_REQUEST_TO_NODE('/account/'+contractID+'_STORAGE_'+storageName)

    callContract=(contractID,method,params,injects)=>{}

    deployContractForKLYVM=(bytecode,callMap)=>{}


    //____________________________ SERVICES LOGIC ____________________________


    //_____________________________ EVENTS BY VM _____________________________


    subscribeForEventsByContract=(contractID,eventID='ALL')=>{}


    //_________________ MUTUALISM(cross-symbiotic interaction) _______________

    addSymbiote=(symbioteID,nodeURL)=>this.symbiotes.set(symbioteID,nodeURL)

    addHostchain=(hostchainTicker,hostchainURL)=>this.hostchains.get(hostchainTicker,hostchainURL)

    changeCurrentSymbiote=symbioteID=>this.currentSymbiote=symbioteID


}