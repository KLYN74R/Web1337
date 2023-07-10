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
    CONTRACT_DEPLOY:'CONTRACT_DEPLOY', // deployment of WASM contact to KLY-WVM 
    CONTRACT_CALL:'CONTRACT_CALL', // call the WASM contact to KLY-WVM
    EVM_CALL:'EVM_CALL', // call the KLY-EVM
    MIGRATE_BETWEEN_ENV:'MIGRATE_BETWEEN_ENV' // to move KLY coins from KLY-WVM to KLY-EVM and vice versa 

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

export {bls,tbls,crypto}

export default class {

    /**
     * 
     * @param {String} [options.symbioteID] identificator of KLY symbiote to work with
     * @param {Number} [options.workflowVersion] identificator of appropriate version of symbiote's workflow
     * @param {String} [options.nodeURL] endpoint of node to interact with
     * @param {String} [options.proxyURL] HTTP(s) / SOCKS proxy url
     * 
     * 
     * @param {String} [options.hostChainTicker] ticker of hostchain of your symbiote
     * @param {String} [options.hostchainNodeURL] endpoint to interact with hostchain's node
     * 
     */
    constructor(options = {symbioteID,workflowVersion,nodeURL,proxyURL,hostChainTicker,hostchainNodeURL}){

        let {symbioteID,workflowVersion,nodeURL,proxyURL,hostChainTicker,hostchainNodeURL} = options;

        if(proxyURL === 'string'){

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


    #GET_REQUEST_TO_NODE=url=>{

        let {nodeURL} = this.symbiotes.get(this.currentSymbiote)

        return fetch(nodeURL+url,{agent:this.proxy}).then(r=>r.json()).catch(error=>error)

    }


    #POST_REQUEST_TO_NODE=(url,payload)=>{

        let {nodeURL} = this.symbiotes.get(this.currentSymbiote)

        return fetch(nodeURL+url,{

            method:'POST',
            body:JSON.stringify(payload),
            agent:this.proxy

        }).then(r=>r.json()).catch(error=>error)

    }
























    
    
    /*
    
    
                         █████╗ ██████╗ ██╗
                        ██╔══██╗██╔══██╗██║
                        ███████║██████╔╝██║
                        ██╔══██║██╔═══╝ ██║
                        ██║  ██║██║     ██║
                        ╚═╝  ╚═╝╚═╝     ╚═╝
    
    
    */


    //_______Get data about checkpoint, symbiote and state__________

    /**
     * @typedef {Object} PoolsMetadata
     * @property {Number} index - index of finalized blocks by this checkpoint
     * @property {String} hash - hash of block with this index
     * @property {Boolean} isReserve - pointer if pool is reserve. true - it's reserve pool, false - it's prime pool with own subchain
     * 
     * 
     * @typedef {Object} CheckpointHeader
     * @property {Number} id - index of checkpoint to keep sequence
     * @property {String} payloadHash - 512-bit BLAKE3 hash of payload
     * @property {String} quorumAggregatedSignersPubKey - Base58 encoded BLS aggregated pubkey of quorum members who agreed and sign this checkpoint
     * @property {String} quorumAggregatedSignature - Base64 encoded BLS aggregated signature of quorum members who agreed and sign this checkpoint
     * @property {Array.<string>} afkVoters - array of pubkeys of quorum members who didn't take part in signing process
     * 
     * 
     * @typedef {Object} CheckpointPayload
     * @property {String} prevCheckpointPayloadHash - 512-bit BLAKE3 hash of previous checkpoint(since it's chain)
     * @property {PoolsMetadata} poolsMetadata - metadata of all registered pools for current epoch
     * @property {Array.<Object>} operations - array of special operations that must be runned after checkpoint
     * @property {Object} otherSymbiotes - state fixation of other symbiotes in ecosystem
     * 
     * 
     * @typedef {Object} Checkpoint
     * @property {CheckpointHeader} header - the header of checkpoint that is published on hostchains
     * @property {CheckpointPayload} payload - the payload of checkpoint with all the required stuff
    
     */

    /**
     * 
     * 
     * @returns {Checkpoint} current checkpoint
     */
    getCurrentCheckpoint=()=>this.#GET_REQUEST_TO_NODE('/quorum_thread_checkpoint')

    getSymbioteInfo=()=>this.#GET_REQUEST_TO_NODE('/symbiote_info')

    /**
     * 
     * @returns {Object} 
     */
    getGeneralInfoAboutKLYInfrastructure=()=>this.#GET_REQUEST_TO_NODE('/my_info')
    
    getSyncState=()=>this.#GET_REQUEST_TO_NODE('/sync_state')


    //_________________________Block API_________________________


    getBlockByBlockID=blockID=>this.#GET_REQUEST_TO_NODE('/block/'+blockID)

    getBlockBySID=(subchain,sid)=>this.#GET_REQUEST_TO_NODE(`/block_by_sid/${subchain}/${sid}`)

    getBlockByGRID=grid=>this.#GET_REQUEST_TO_NODE('/block_by_grid/'+grid)
    

    //____________________Get data from state____________________


    getFromState=(subchain,cellID)=>this.#GET_REQUEST_TO_NODE(`/state/${subchain}/${cellID}`)

    getTransactionReceiptById=txID=>this.#GET_REQUEST_TO_NODE('/tx_receipt/'+txID)

    // Consensus-related API
    getAggregatedFinalizationProofForBlock=blockID=>this.#GET_REQUEST_TO_NODE('/aggregated_finalization_proof/'+blockID)


    getTransactionTemplate=(workflowVersion,creator,txType,nonce,fee,payload)=>{

        return {

            v:workflowVersion,
            creator,
            type:txType,
            nonce,
            fee,
            payload,
            sig:''

        }

    }
























    /*
    
    
                   ████████╗██████╗  █████╗ ███╗   ██╗███████╗ █████╗  ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
                    ══██╔══╝██╔══██╗██╔══██╗████╗  ██║██╔════╝██╔══██╗██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
                      ██║   ██████╔╝███████║██╔██╗ ██║███████╗███████║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗
                      ██║   ██╔══██╗██╔══██║██║╚██╗██║╚════██║██╔══██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║
                      ██║   ██║  ██║██║  ██║██║ ╚████║███████║██║  ██║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║
                      ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝

                    ██████╗██████╗ ███████╗ █████╗ ████████╗██╗███╗   ██╗ ██████╗                                    
                    █╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██║████╗  ██║██╔════╝                                    
                    █║     ██████╔╝█████╗  ███████║   ██║   ██║██╔██╗ ██║██║  ███╗                                   
                    █║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██║██║╚██╗██║██║   ██║                                   
                    ██████╗██║  ██║███████╗██║  ██║   ██║   ██║██║ ╚████║╚██████╔╝                                   
                    ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝                                    


    */


    // Transactions. Default, Multisig, Threshold, Post-quantum

    createDefaultTransaction=async(originSubchain,yourAddress,yourPrivateKey,nonce,recipient,fee,amountInKLY,rev_t)=>{

        let workflowVersion = this.symbiotes.get(this.currentSymbiote).workflowVersion
    
        let payload={

            type:SIG_TYPES.DEFAULT,

            to:recipient,

            amount:amountInKLY
        
        }

        // Reverse threshold should be set if recipient is a multisig address
        if(typeof rev_t === 'number') payload.rev_t=rev_t


        let transaction = this.getTransactionTemplate(workflowVersion,yourAddress,TX_TYPES.TX,nonce,fee,payload)

        transaction.sig = await crypto.kly.signEd25519(this.currentSymbiote+workflowVersion+originSubchain+TX_TYPES.TX+JSON.stringify(payload)+nonce+fee,yourPrivateKey)

        // Return signed transaction
        return transaction

    }


    createMultisigTransaction=async(rootPubKey,aggregatedPubOfActive,aggregatedSignatureOfActive,afkSigners,nonce,fee,recipient,amountInKLY,rev_t)=>{

        let workflowVersion = this.symbiotes.get(this.currentSymbiote).workflowVersion
    
        let payload={

            type:SIG_TYPES.MULTISIG,

            active:aggregatedPubOfActive,

            afk:afkSigners,

            to:recipient,

            amount:amountInKLY
        
        }

        // Reverse threshold should be set if recipient is a multisig address
        if(typeof rev_t==='number') payload.rev_t=rev_t


        let multisigTransaction = this.getTransactionTemplate(workflowVersion,rootPubKey,TX_TYPES.TX,nonce,fee,payload)

        multisigTransaction.sig = aggregatedSignatureOfActive

        // Return signed tx
        return multisigTransaction

    }


    signDataForMultisigTxAsOneOfTheActiveSigners=async(originSubchain,yourBLSPrivateKey,activeAggregatedPubkey,afkSigners,nonce,fee,recipient,amountInKLY,rev_t)=>{

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

        let thresholdSigTransaction = this.getTransactionTemplate(
            
            this.symbiotes.get(this.currentSymbiote).workflowVersion,
            
            tblsRootPubkey,
            
            TX_TYPES.TX,
            
            nonce, fee, tblsPayload
            
        )
        
        thresholdSigTransaction.sig=tbls.buildSignature(sigSharesArray)
 
        return thresholdSigTransaction
 
    }

    createPostQuantumTransaction=async(yourAddress,yourPubKey,yourPrivateKey,recipient,amountInKLY,rev_t)=>{



    }


    sendTransaction = transaction => this.#POST_REQUEST_TO_NODE('/transaction',transaction)



    /*
    
    
    
                    ███████╗██████╗ ███████╗ ██████╗██╗ █████╗ ██╗                                  
                    ██╔════╝██╔══██╗██╔════╝██╔════╝██║██╔══██╗██║                                  
                    ███████╗██████╔╝█████╗  ██║     ██║███████║██║                                  
                    ╚════██║██╔═══╝ ██╔══╝  ██║     ██║██╔══██║██║                                  
                    ███████║██║     ███████╗╚██████╗██║██║  ██║███████╗                             
                    ╚══════╝╚═╝     ╚══════╝ ╚═════╝╚═╝╚═╝  ╚═╝╚══════╝                             
                                                                                
         ██████╗ ██████╗ ███████╗██████╗  █████╗ ████████╗██╗ ██████╗ ███╗   ██╗███████╗
        ██╔═══██╗██╔══██╗██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
        ██║   ██║██████╔╝█████╗  ██████╔╝███████║   ██║   ██║██║   ██║██╔██╗ ██║███████╗
        ██║   ██║██╔═══╝ ██╔══╝  ██╔══██╗██╔══██║   ██║   ██║██║   ██║██║╚██╗██║╚════██║
        ╚██████╔╝██║     ███████╗██║  ██║██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║███████║
         ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
                                                                                
    
    */

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

    getContractMetadata=contractID=>this.#GET_REQUEST_TO_NODE('/account/'+contractID)

    getContractStorage=(contractID,storageName)=>this.#GET_REQUEST_TO_NODE('/account/'+contractID+'_STORAGE_'+storageName)

    callContract=(contractID,method,params,injects)=>{}

    deployContractForKlyWvm=(bytecode,callMap)=>{}


    //____________________________ SERVICES LOGIC ____________________________


    //_____________________________ EVENTS BY VM _____________________________


    subscribeForEventsByContract=(contractID,eventID='ALL')=>{}


    //_________________ MUTUALISM(cross-symbiotic interaction) _______________

    addSymbiote=(symbioteID,workflowVersion,nodeURL)=>this.symbiotes.set(symbioteID,{nodeURL,workflowVersion})

    addHostchain=(hostchainTicker,hostchainURL)=>this.hostchains.get(hostchainTicker,hostchainURL)

    changeCurrentSymbiote=symbioteID=>this.currentSymbiote=symbioteID


}