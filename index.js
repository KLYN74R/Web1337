/*


                        ██╗    ██╗███████╗██████╗        ██╗██████╗ ██████╗ ███████╗                            
                        ██║    ██║██╔════╝██╔══██╗      ███║╚════██╗╚════██╗╚════██║                            
                        ██║ █╗ ██║█████╗  ██████╔╝█████╗╚██║ █████╔╝ █████╔╝    ██╔╝                            
                        ██║███╗██║██╔══╝  ██╔══██╗╚════╝ ██║ ╚═══██╗ ╚═══██╗   ██╔╝                             
                        ╚███╔███╔╝███████╗██████╔╝       ██║██████╔╝██████╔╝   ██║                              
                         ╚══╝╚══╝ ╚══════╝╚═════╝        ╚═╝╚═════╝ ╚═════╝    ╚═╝                              
                                                                                                                
                                                                                                                
                                                                                                                
                                                                                          
                                                                                                                
                                                                                                                
 ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗██████╗     ███████╗ ██████╗ ██████╗     ██╗  ██╗██╗  ██╗   ██╗
██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝██╔══██╗    ██╔════╝██╔═══██╗██╔══██╗    ██║ ██╔╝██║  ╚██╗ ██╔╝
██║     ██████╔╝█████╗  ███████║   ██║   █████╗  ██║  ██║    █████╗  ██║   ██║██████╔╝    █████╔╝ ██║   ╚████╔╝ 
██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝  ██║  ██║    ██╔══╝  ██║   ██║██╔══██╗    ██╔═██╗ ██║    ╚██╔╝  
╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗██████╔╝    ██║     ╚██████╔╝██║  ██║    ██║  ██╗███████╗██║   
 ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═════╝     ╚═╝      ╚═════╝ ╚═╝  ╚═╝    ╚═╝  ╚═╝╚══════╝╚═╝   



    _____________________________________________ INFO _____________________________________________

    Only general API & functionality present here. We'll extend abilities via modules & other packages and so on

    You can also use web3.js EVM-compatible API with symbiotes that supports KLY-EVM


*/


import tbls from './crypto_primitives/threshold/tbls.js'
import crypto from './crypto_primitives/crypto.js'
import bls from './crypto_primitives/bls.js'
import {hash} from 'blake3-wasm'
import fetch from 'node-fetch'


// For future support of WSS
// import WS from 'websocket' // https://github.com/theturtle32/WebSocket-Node


// For proxy support

import {SocksProxyAgent} from 'socks-proxy-agent'
import {HttpsProxyAgent} from 'https-proxy-agent'



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


export {TX_TYPES,SIG_TYPES,SPECIAL_OPERATIONS}



export default class {

    /**
     * 
     * @param {String} symbioteID identificator of KLY symbiote to work with
     * @param {Number} workflowVersion identificator of appropriate version of symbiote's workflow
     * @param {String} nodeURL endpoint of node to interact with
     * @param {String} proxyURL HTTP(s) / SOCKS proxy url
     * 
     * 
     * @param {String} hostChainTicker ticker of hostchain of your symbiote
     * @param {String} hostchainNodeURL endpoint to interact with hostchain's node
     * 
     */
    constructor({symbioteID,workflowVersion,nodeURL,proxyURL,hostChainTicker,hostchainNodeURL}){

        if(typeof proxyURL === 'string'){

            if(proxyURL.startsWith('http')) this.proxy = new HttpsProxyAgent(proxyURL)  // for example => 'http(s)://login:password@127.0.0.1:8080'

            else if (proxyURL.startsWith('socks'))  this.proxy = new SocksProxyAgent(proxyURL) // for TOR/I2P connections. For example => socks5h://Vlad:Cher@127.0.0.1:9150

        }

        this.symbiotes = new Map() // symbioteID => {nodeURL,workflowVersion}

        this.hostchains = new Map() // ticker => endpoint(RPC,websocket,etc.)


        //Set the initial values
        this.currentSymbiote = symbioteID

        this.symbiotes.set(symbioteID,{nodeURL,workflowVersion})

        this.hostchains.set(hostChainTicker,hostchainNodeURL)

    }


    BLAKE3=(input,length=64)=>hash(input,{length}).toString('hex')


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
    getGeneralInfoAboutKLYInfrastructure=()=>this.GET_REQUEST_TO_NODE('/my_info')

    getCurrentCheckpoint=()=>this.GET_REQUEST_TO_NODE('/quorum_thread_checkpoint')

    getPayloadForCheckpointByHash=payloadHash=>this.GET_REQUEST_TO_NODE('/payload_for_checkpoint/'+payloadHash)
    
    getSyncState=()=>this.GET_REQUEST_TO_NODE('/sync_state')

    getSymbioteInfo=()=>this.GET_REQUEST_TO_NODE('/symbiote_info')


    // Block API
    getBlockByBlockID=blockID=>this.GET_REQUEST_TO_NODE('/block/'+blockID)

    getBlockBySID=(subchain,sid)=>this.GET_REQUEST_TO_NODE(`/block_by_sid/${subchain}/${sid}`)

    getBlockByGRID=grid=>this.GET_REQUEST_TO_NODE('/block_by_grid/'+grid)
    
    // Account API
    getAccount=accountID=>this.GET_REQUEST_TO_NODE('/account/'+accountID)


    // Consensus-related API
    getAggregatedFinalizationProofForBlock=blockID=>this.GET_REQUEST_TO_NODE('/aggregated_finalization_proof/'+blockID)



    // Transactions (default txs,contract calls,etc) API
    getTransactionReceiptById=txID=>this.GET_REQUEST_TO_NODE('/tx_receipt/'+txID)


    getTransactionTemplate=(workflowVersion,creator,txType,nonce,fee,payload)=>{

        return {

            v:workflowVersion,
            c:creator,
            t:txType,
            n:nonce,
            f:fee,
            p:payload

        }

    }


    // Transactions. Default, Multisig, Threshold, Post-quantum

    createDefaultTransaction=async(originSubchain,yourAddress,yourPrivateKey,nonce,recipient,fee,amountInKLY,rev_t)=>{

        nonce ??= this.getAccount(yourAddress).then(account=>account.nonce).catch(_=>false)


        let workflowVersion = this.symbiotes.get(this.currentSymbiote).workflowVersion
    
        let payload={

            type:SIG_TYPES.DEFAULT,

            to:recipient,

            amount:amountInKLY
        
        }

        // Reverse threshold should be set if recipient is a multisig address
        if(typeof rev_t === 'number') payload.rev_t=rev_t


        let transaction = {

            v:workflowVersion,
            creator:yourAddress,
            type:TX_TYPES.TX,
            nonce,
            fee,
            payload,
            sig:''
            
        }


        transaction.sig = await crypto.kly.signEd25519(this.currentSymbiote+workflowVersion+originSubchain+TX_TYPES.TX+JSON.stringify(payload)+nonce+fee,yourPrivateKey)

        // Return signed transaction
        return transaction

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


        let multisigTransaction = {

            v:workflowVersion,
            creator:yourBLSAggregatedPubkey,
            type:TX_TYPES.TX,
            nonce,
            fee,
            payload,
            sig:''
            
        }

        multisigTransaction.sig = yourBLSAggregatedSignature

        // Return signed tx
        return multisigTransaction

    }


    signDataForMultisigTxAsOneOfTheActive=async(originSubchain,yourBLSPrivateKey,activeAggregatedPubkey,afkSigners,nonce,fee,recipient,amountInKLY,rev_t)=>{

        let workflowVersion = this.symbiotes.get(this.currentSymbiote).workflowVersion

        let payload={

            type:SIG_TYPES.MULTISIG,
            active:activeAggregatedPubkey,
            afk:afkSigners,

            to:recipient,
            amount:amountInKLY

        }

        if(typeof rev_t==='number') payload.rev_t = rev_t

        let dataToSign = this.currentSymbiote+workflowVersion+originSubchain+TX_TYPES.TX+JSON.stringify(payload)+nonce+fee

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

        let thresholdSigTransaction = {
    
            v:this.symbiotes.get(this.currentSymbiote).workflowVersion,
            creator:tblsRootPubkey,
            type:TX_TYPES.TX,
            nonce,
            fee,
            payload:tblsPayload,
            sig:''
        
        }
    
        thresholdSigTransaction.sig=tbls.buildSignature(sigSharesArray)
 
        return thresholdSigTransaction
 
    }

    createPostQuantumTransaction=async(yourAddress,yourPubKey,yourPrivateKey,recipient,amountInKLY,rev_t)=>{



    }


    sendTransaction = transaction => {

        let {nodeURL} = this.symbiotes.get(this.currentSymbiote)

        return fetch(nodeURL+'/transaction',
    
            {
            
                method:'POST',
            
                body:JSON.stringify(transaction)
        
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