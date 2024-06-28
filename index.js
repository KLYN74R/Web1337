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


import * as smartContractsApi from './api/smart_contract_api.js'
import crypto from './crypto_primitives/crypto.js'
import * as txsCreation from './txs_creation.js'
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

const SIGNATURES_TYPES = {
    
    DEFAULT:'D',                    // Default ed25519
    TBLS:'T',                       // TBLS(threshold sig)
    POST_QUANTUM_DIL:'P/D',         // Post-quantum Dilithium(2/3/5,2 used by default)
    POST_QUANTUM_BLISS:'P/B',       // Post-quantum BLISS
    MULTISIG:'M'                    // Multisig BLS

}

const EPOCH_EDGE_OPERATIONS = {

    VERSION_UPDATE:'VERSION_UPDATE',
    SLASH_UNSTAKE:'SLASH_UNSTAKE',
    REMOVE_FROM_WAITING_ROOM:'REMOVE_FROM_WAITING_ROOM',
    WORKFLOW_UPDATE:'WORKFLOW_UPDATE',
    UPDATE_RUBICON:'UPDATE_RUBICON',
    STAKING_CONTRACT_CALL:'STAKING_CONTRACT_CALL'

}



export {TX_TYPES,SIGNATURES_TYPES,EPOCH_EDGE_OPERATIONS}

export {crypto}


export default class {

    /**
     * 
     * @param {String} [options.symbioteID] identificator of KLY symbiote to work with
     * @param {Number} [options.workflowVersion] identificator of appropriate version of symbiote's workflow
     * @param {String} [options.nodeURL] endpoint of node to interact with
     * @param {String} [options.proxyURL] HTTP(s) / SOCKS proxy url
     * 
     * 
     */
    constructor(options = {symbioteID,workflowVersion,nodeURL,proxyURL}){

        let {symbioteID,workflowVersion,nodeURL,proxyURL} = options;

        if(proxyURL === 'string'){

            if(proxyURL.startsWith('http')) this.proxy = new HttpsProxyAgent(proxyURL)  // for example => 'http(s)://login:password@127.0.0.1:8080'

            else if (proxyURL.startsWith('socks'))  this.proxy = new SocksProxyAgent(proxyURL) // for TOR/I2P connections. For example => socks5h://Vlad:Cher@127.0.0.1:9150

        }

        this.symbiotes = new Map() // symbioteID => {nodeURL,workflowVersion}


        //Set the initial values
        this.currentSymbiote = symbioteID

        this.symbiotes.set(symbioteID,{nodeURL,workflowVersion})

    }


    blake3=(input,length)=>hash(input,{length}).toString('hex')


    getRequestToNode=url=>{

        let {nodeURL} = this.symbiotes.get(this.currentSymbiote)

        return fetch(nodeURL+url,{agent:this.proxy}).then(r=>r.json()).catch(error=>error)

    }


    postRequestToNode=(url,payload)=>{

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




    //_________________________Block API_________________________

    getBlockByBlockID=blockID=>this.getRequestToNode('/block/'+blockID)

    getBlockBySID=(shard,sid)=>this.getRequestToNode(`/block_by_sid/${shard}/${sid}`)

    getLatestNBlocksOnShard=(shard,startIndex,limit)=>this.getRequestToNode(`/latest_n_blocks/${shard}/${startIndex}/${limit}`)
    



    //_______________________Epoch data API______________________

    getCurrentEpochOnThread=threadID=>this.getRequestToNode('/current_epoch/'+threadID)

    getCurrentLeadersOnShards=()=>this.getRequestToNode(`/current_shards_leaders`)

    getEpochDataByEpochIndex=epochIndex=>this.getRequestToNode(`/epoch_by_index/${epochIndex}`)




    //_______________________State data API____________________

    getDataFromState=(shard,cellID)=>this.getRequestToNode(`/state/${shard}/${cellID}`)

    getTransactionReceiptById=txID=>this.getRequestToNode('/tx_receipt/'+txID)

    getPoolStats=poolID=>this.getRequestToNode('/pool_stats/'+poolID)




    //_______________________Misc data API_____________________

    getTargetNodeInfrastructureInfo=()=>this.getRequestToNode('/infrastructure_info')

    getChainData=()=>this.getRequestToNode('/chain_info')

    getKlyEvmMetadata=()=>this.getRequestToNode('/kly_evm_metadata')

    getSynchronizationStatus=()=>this.getRequestToNode('/synchronization_stats')




    //___________________Consensus-related API___________________

    getAggregatedEpochFinalizationProof=(epochIndex,shard)=>this.getRequestToNode(`/aggregated_epoch_finalization_proof/${epochIndex}/${shard}`)

    getAggregatedFinalizationProofForBlock=blockID=>this.getRequestToNode('/aggregated_finalization_proof/'+blockID)




    //_____________________________ TXS Creation _____________________________

    createDefaultTransaction=(originShard,yourAddress,yourPrivateKey,nonce,recipient,fee,amountInKLY,rev_t)=>txsCreation.createDefaultTransaction(this,originShard,yourAddress,yourPrivateKey,nonce,recipient,fee,amountInKLY,rev_t)

    createMultisigTransaction=(rootPubKey,aggregatedPubOfActive,aggregatedSignatureOfActive,afkSigners,nonce,fee,recipient,amountInKLY,rev_t)=>txsCreation.createMultisigTransaction(this,rootPubKey,aggregatedPubOfActive,aggregatedSignatureOfActive,afkSigners,nonce,fee,recipient,amountInKLY,rev_t)

    buildPartialSignatureWithTxData=(originShard,hexID,sharedPayload,nonce,fee,recipient,amountInKLY,rev_t)=>txsCreation.buildPartialSignatureWithTxData(this,hexID,sharedPayload,originShard,nonce,fee,recipient,amountInKLY,rev_t)

    createThresholdTransaction=(tblsRootPubkey,partialSignaturesArray,nonce,recipient,amountInKLY,fee,rev_t)=>txsCreation.createThresholdTransaction(this,tblsRootPubkey,partialSignaturesArray,nonce,recipient,amountInKLY,fee,rev_t)

    createPostQuantumTransaction=(originShard,sigType,yourAddress,yourPrivateKey,nonce,recipient,amountInKLY,fee,rev_t)=>txsCreation.createPostQuantumTransaction(this,originShard,sigType,yourAddress,yourPrivateKey,nonce,recipient,amountInKLY,fee,rev_t)

    sendTransaction=(transaction)=>txsCreation.sendTransaction(this,transaction)




    //_________________________ Smart contracts API __________________________

    getContractMetadata=contractID=>smartContractsApi.getContractMetadata(this,contractID)

    getContractStorage=(contractID,storageName)=>smartContractsApi.getContractStorage(this,contractID,storageName)

    deployContractForWvm=bytecode=>smartContractsApi.createContractDeploymentTx(this,bytecode)

    callContract=(contractID,method,params,injects)=>smartContractsApi.createContractCallTx(this,contractID,method,params,injects)

    subscribeForEventsByContract=(contractID,eventID)=>smartContractsApi.subscribeForEventsByContract(this,contractID,eventID)

    //_____________________________ STAKING LOGIC _____________________________

    // stakeToPool=async()=>{}

    // unstakefromPool=async()=>{}

    //_________________ MUTUALISM(cross-symbiotic interaction) _______________

    addSymbioticChain=(symbioticChainID,workflowVersion,nodeURL)=>this.symbiotes.set(symbioticChainID,{nodeURL,workflowVersion})

    changeCurrentSymbioticChain=symbioteID=>this.currentSymbiote=symbioteID


}