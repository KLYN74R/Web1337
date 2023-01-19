/*

Only general API & functionality present here. We'll extend abilities via modules & other packages and so on

You can also use web3.js EVM-compatible API with symbiotes that supports KLY-EVM

*/


import tbls from './crypto_primitives/threshold/tbls.js'
import crypto from './crypto_primitives/crypto.js'
import bls from './crypto_primitives/bls.js'
import {hash} from 'blake3-wasm'
import fetch from 'node-fetch'



// import WS from 'websocket' //https://github.com/theturtle32/WebSocket-Node



const TX_TYPES = {

    TX:'TX', // default address <=> address tx
    CONTRACT_DEPLOY:'CONTRACT_DEPLOY',
    CONTRACT_CALL:'CONTRACT_CALL',
    EVM_CALL:'EVM_CALL',
    MIGRATE_BETWEEN_ENV:'MIGRATE_BETWEEN_ENV'

}

const SIG_TYPES = {
    
    DEFAULT:'D',                    // Default ed25519
    TBLS:'T',                       // TBLS(threshold sig)
    POST_QUANTUM_DIL:'P/D',         // Post-quantum Dilithium(2/3/5,2 used by default)
    POST_QUANTUM_BLISS:'P/B',       // Post-quantum BLISS
    MULTISIG:'M'                    // Multisig BLS

}

const SPECIAL_OPERATIONS={

    VERSION_UPDATE:'VERSION_UPDATE',
    SLASH_UNSTAKE:'SLASH_UNSTAKE',
    REMOVE_FROM_WAITING_ROOM:'REMOVE_FROM_WAITING_ROOM',
    WORKFLOW_UPDATE:'WORKFLOW_UPDATE',
    UPDATE_RUBICON:'UPDATE_RUBICON',
    STAKING_CONTRACT_CALL:'STAKING_CONTRACT_CALL'

}


export default class {

    constructor(symbioteID,workflowVersion,nodeURL,proxy,hostChainTicker,hostchainNodeURL){

        this.proxy=proxy //for TOR/I2P connections

        this.symbiotes = new Map() //symbioteID => {nodeURL,workflowVersion}

        this.hostchains = new Map() //ticker => endpoint(RPC,websocket,etc.)


        //Set the initial values
        this.currentSymbiote = symbioteID

        this.symbiotes.set(symbioteID,{nodeURL,workflowVersion})

        this.hostchains.set(hostChainTicker,hostchainNodeURL)

    }


    BLAKE3=v=>hash(v).toString('hex')


    GET_REQUEST_TO_NODE=url=>{

        let {nodeURL} = this.symbiotes.get(this.currentSymbiote)

        return fetch(nodeURL+url).then(r=>r.json()).catch(e=>{

            console.log('_________ ERROR _________')

            console.error(e)

        })

    }


    POST_REQUEST_TO_NODE=(url,payload)=>{

        let {nodeURL} = this.symbiotes.get(this.currentSymbiote)

        return fetch(nodeURL+url,{

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

    createDefaultTransaction=async(yourAddress,yourPrivateKey,nonce,recipient,fee,amountInKLY,rev_t)=>{

        nonce ??= this.getAccount(yourAddress).then(account=>account.nonce).catch(_=>false)


        let workflowVersion = this.symbiotes.get(this.currentSymbiote).workflowVersion
    
        let payload={

            type:SIG_TYPES.DEFAULT,

            to:recipient,

            amount:amountInKLY
        
        }

        // Reverse threshold should be set if recipient is a multisig address
        if(typeof rev_t === 'number') payload.rev_t=rev_t


        let event = {

            v:workflowVersion,
            creator:yourAddress,
            type:TX_TYPES.TX,
            nonce,
            fee,
            payload,
            sig:''
            
        }


        event.sig = await crypto.kly.signEd25519(this.currentSymbiote+workflowVersion+TX_TYPES.TX+JSON.stringify(payload)+nonce+fee,yourPrivateKey)

        // Return signed event
        return event

    }


    createMultisigTransaction=async(yourBLSAggregatedPubkey,yourBLSAggregatedSignature,afkSigners,nonce,fee,recipient,amountInKLY,rev_t)=>{


        nonce ??= this.getAccount(yourBLSAggregatedPubkey).then(account=>account.nonce).catch(_=>false)


        let workflowVersion = this.symbiotes.get(this.currentSymbiote).workflowVersion
    
        let payload={

            type:SIG_TYPES.MULTISIG,

            active:yourBLSAggregatedPubkey,

            afk:afkSigners,

            to:recipient,

            amount:amountInKLY
        
        }

        // Reverse threshold should be set if recipient is a multisig address
        if(typeof rev_t==='number') payload.rev_t=rev_t


        let event = {

            v:workflowVersion,
            creator:yourBLSAggregatedPubkey,
            type:TX_TYPES.TX,
            nonce,
            fee,
            payload,
            sig:''
            
        }

        event.sig = yourBLSAggregatedSignature

        // Return signed event
        return event

    }


    signDataForMultisigTxAsOneOfTheActive=async(yourBLSPrivateKey,activeAggregatedPubkey,afkSigners,nonce,fee,recipient,amountInKLY,rev_t)=>{

        let workflowVersion = this.symbiotes.get(this.currentSymbiote).workflowVersion

        let payload={

            type:SIG_TYPES.MULTISIG,
            active:activeAggregatedPubkey,
            afk:afkSigners,

            to:recipient,
            amount:amountInKLY

        }

        if(typeof rev_t==='number') payload.rev_t = rev_t

        let dataToSign = this.currentSymbiote+workflowVersion+TX_TYPES.TX+JSON.stringify(payload)+nonce+fee

        let signature = await bls.singleSig(dataToSign,yourBLSPrivateKey)
        
        return signature

    }

    createThresholdTransaction=async(tblsRootPubkey,sigSharesArray,nonce,recipient,amountInKLY,fee,rev_t)=>{
    
        let tblsPayload={
    
            to:recipient,
    
            amount:amountInKLY,
    
            type:SIG_TYPES.TBLS
        
        }
    
        if(typeof rev_t==='number') payload.rev_t = rev_t

        let event = {
    
            v:this.symbiotes.get(this.currentSymbiote).workflowVersion,
            creator:tblsRootPubkey,
            type:TX_TYPES.TX,
            nonce,
            fee,
            payload:tblsPayload,
            sig:''
        
        }
    
        event.sig=tbls.buildSignature(sigSharesArray)
 
        return event
 
    }

    createPostQuantumTransaction=async(yourAddress,yourPubKey,yourPrivateKey,recipient,amountInKLY,rev_t)=>{



    }


    sendTransaction=event=>{

        let {nodeURL} = this.symbiotes.get(this.currentSymbiote)

        return fetch(nodeURL,
    
            {
            
                method:'POST',
            
                body:JSON.stringify({symbiote:this.currentSymbiote,event})
        
            }
    
        ).then(r=>r.text()).catch(console.log)
    
    }


    //___________________________ SPECIAL OPERATIONS __________________________

    createSpecialOperation=async(type,payload)=>{

        // See the examples

    }

    sendSpecialOperation=async specialOperation=>{

        
        let optionsToSend = {

            method:'POST',
            body:JSON.stringify(specialOperation)
        
        }

        let status = await (await fetch(this.symbiotes.get(this.currentSymbiote),optionsToSend).then(r=>r.text())).catch(error=>error)

        return status

    }

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

    addSymbiote=(symbioteID,workflowVersion,nodeURL)=>this.symbiotes.set(symbioteID,{nodeURL,workflowVersion})

    addHostchain=(hostchainTicker,hostchainURL)=>this.hostchains.get(hostchainTicker,hostchainURL)

    changeCurrentSymbiote=symbioteID=>this.currentSymbiote=symbioteID


}