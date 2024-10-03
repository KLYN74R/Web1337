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

    You can also use web3.js EVM-compatible API with blockchains in KLY ecosystem that supports KLY-EVM


*/

import * as smartContractsApi from './src/smart_contract_api.js'

import * as txsCreation from './src/txs_creation.js'

import crypto from './crypto_primitives/crypto.js'

import {hash} from 'blake3-wasm'

import fetch from 'node-fetch'








// For future support of WSS
// import WS from 'websocket' // https://github.com/theturtle32/WebSocket-Node


// For proxy support

import {SocksProxyAgent} from 'socks-proxy-agent'
import {HttpsProxyAgent} from 'https-proxy-agent'



const TX_TYPES = {

    TX:'TX', // default address <=> address tx
    WVM_CONTRACT_DEPLOY:'WVM_CONTRACT_DEPLOY', // deployment of WASM contact to KLY-WVM 
    WVM_CALL:'WVM_CALL', // call the WASM contact to KLY-WVM
    EVM_CALL:'EVM_CALL', // call the KLY-EVM
}

const SIGNATURES_TYPES = {
    
    DEFAULT:'D',                    // Default ed25519
    TBLS:'T',                       // TBLS(threshold sig)
    POST_QUANTUM_DIL:'P/D',         // Post-quantum Dilithium(2/3/5,2 used by default)
    POST_QUANTUM_BLISS:'P/B',       // Post-quantum BLISS
    MULTISIG:'M'                    // Multisig BLS

}




export {TX_TYPES,SIGNATURES_TYPES}

export {crypto}


export default class {

    /**
     * 
     * @param {String} [options.chainID] identificator of KLY chain to work with
     * @param {Number} [options.workflowVersion] identificator of appropriate version of chain's workflow
     * @param {String} [options.nodeURL] endpoint of node to interact with
     * @param {String} [options.proxyURL] HTTP(s) / SOCKS proxy url
     * 
     * 
     */
    constructor(options = {chainID,workflowVersion,nodeURL,proxyURL}){

        let {chainID,workflowVersion,nodeURL,proxyURL} = options;

        if(proxyURL === 'string'){

            if(proxyURL.startsWith('http')) this.proxy = new HttpsProxyAgent(proxyURL)  // for example => 'http(s)://login:password@127.0.0.1:8080'

            else if (proxyURL.startsWith('socks'))  this.proxy = new SocksProxyAgent(proxyURL) // for TOR/I2P connections. For example => socks5h://Vlad:Cher@127.0.0.1:9150

        }

        this.chains = new Map() // chainID => {nodeURL,workflowVersion}


        // Set the initial values

        this.currentChain = chainID

        this.chains.set(chainID,{nodeURL,workflowVersion})

    }


    blake3=(input,length)=>hash(input,{length}).toString('hex')

    fromKlyToWei=amountInKly=>amountInKly*10**18

    fromWeiToKly=amountInWei=>amountInWei/10**18

    getRequestToNode=url=>{

        let {nodeURL} = this.chains.get(this.currentChain)

        return fetch(nodeURL+url,{agent:this.proxy}).then(r=>r.json()).catch(error=>error)

    }


    postRequestToNode=(url,bodyToSend)=>{

        let {nodeURL} = this.chains.get(this.currentChain)

        return fetch(nodeURL+url,{

            method:'POST',
            body:JSON.stringify(bodyToSend),
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

    getBlockBySID=(shard,blockHeight)=>this.getRequestToNode(`/block_by_sid/${shard}/${blockHeight}`)

    getLatestNBlocksOnShard=(shard,startIndex,limit)=>this.getRequestToNode(`/latest_n_blocks/${shard}/${startIndex}/${limit}`)
    
    getTotalBlocksAndTxsStats=()=>this.getRequestToNode(`/total_blocks_and_txs_stats`)



    //_______________________Epoch data API______________________

    getCurrentEpochOnThread=threadID=>this.getRequestToNode('/current_epoch/'+threadID)

    getCurrentLeadersOnShards=()=>this.getRequestToNode(`/current_shards_leaders`)

    getEpochDataByEpochIndex=epochIndex=>this.getRequestToNode(`/epoch_by_index/${epochIndex}`)

    getTotalBlocksAndTxsStatsPerEpoch=epochIndex=>this.getRequestToNode(`/total_blocks_and_txs_stats_per_epoch/${epochIndex}`)


    //_______________________State data API____________________

    getFromStateByCellID=(shard,cellID)=>this.getRequestToNode(`/state/${shard}/${cellID}`)

    getTransactionReceiptById=txID=>this.getRequestToNode('/tx_receipt/'+txID)

    getPoolStats=poolID=>this.getRequestToNode('/pool_stats/'+poolID)

    getTransactionsWithAccount=(shardID,accountID)=>this.getRequestToNode(`/txs_list/${shardID}/${accountID}`)

    getAccount=(shardID,accountID)=>this.getRequestToNode(`/account/${shardID}/${accountID}`)



    //_______________________Misc data API_____________________

    getTargetNodeInfrastructureInfo=()=>this.getRequestToNode('/infrastructure_info')

    getChainData=()=>this.getRequestToNode('/chain_info')

    getKlyEvmMetadata=()=>this.getRequestToNode('/kly_evm_metadata')

    getSynchronizationStatus=()=>this.getRequestToNode('/synchronization_stats')

    getQuorumUrlsAndPubkeys=()=>this.getRequestToNode('/quorum_urls_and_pubkeys')




    //___________________Consensus-related API___________________

    getAggregatedEpochFinalizationProof=(epochIndex,shard)=>this.getRequestToNode(`/aggregated_epoch_finalization_proof/${epochIndex}/${shard}`)

    getAggregatedFinalizationProofForBlock=blockID=>this.getRequestToNode('/aggregated_finalization_proof/'+blockID)




    //_____________________________ TXS Creation _____________________________

    createEd25519Transaction=(originShard,txType,yourAddress,yourPrivateKey,nonce,fee,payload)=>{

        return txsCreation.createEd25519Transaction(this,originShard,txType,yourAddress,yourPrivateKey,nonce,fee,payload)

    }

    signDataForMultisigTransaction=(originShard,txType,blsPrivateKey,nonce,fee,payload)=>{

        return txsCreation.signDataForMultisigTransaction(this,originShard,txType,blsPrivateKey,nonce,fee,payload)

    }

    createMultisigTransaction=(rootPubKey,txType,aggregatedSignatureOfActive,nonce,fee,payload)=>{

        return txsCreation.createMultisigTransaction(this,txType,rootPubKey,aggregatedSignatureOfActive,nonce,fee,payload)

    }

    buildPartialSignatureWithTxData=(originShard,txType,hexID,sharedPayload,nonce,fee,payload)=>{

        return txsCreation.buildPartialSignatureWithTxData(this,originShard,txType,hexID,sharedPayload,nonce,fee,payload)

    }

    createThresholdTransaction=(tblsRootPubkey,txType,partialSignaturesArray,nonce,fee,payload)=>{

        return txsCreation.createThresholdTransaction(this,txType,tblsRootPubkey,partialSignaturesArray,nonce,fee,payload)

    }
    
    createPostQuantumTransaction=(originShard,txType,pqcAlgorithm,yourAddress,yourPrivateKey,nonce,fee,payload)=>{
    
        return txsCreation.createPostQuantumTransaction(this,originShard,txType,pqcAlgorithm,yourAddress,yourPrivateKey,nonce,fee,payload)
    
    }

    
    sendTransaction=(transaction)=>txsCreation.sendTransaction(this,transaction)




    //_________________________ Smart contracts API __________________________

    getContractMetadata=(shardID,contractID)=>smartContractsApi.getContractMetadata(this,shardID,contractID)

    getContractStorage=(shardID,contractID,storageName)=>smartContractsApi.getContractStorage(this,shardID,contractID,storageName)

    deployContractToWvm=(shardID,yourAddress,yourPrivateKey,nonce,fee,sigType,bytecode,lang,constructorParams,addToPayload)=>smartContractsApi.createContractDeploymentTx(this,shardID,yourAddress,yourPrivateKey,nonce,fee,sigType,bytecode,lang,constructorParams,addToPayload)

    callWvmContract=(shardID,yourAddress,yourPrivateKey,nonce,fee,sigType,contractID,method,gasLimit,params,injects,addToPayload)=>smartContractsApi.createContractCallTx(this,shardID,yourAddress,yourPrivateKey,nonce,fee,sigType,contractID,method,gasLimit,params,injects,addToPayload)

    //_____________________________ STAKING LOGIC _____________________________

    // stakeToPool=async()=>{}

    // unstakefromPool=async()=>{}

    getQuorumApprovementsOfEpochEdgeOperations=epochEdgeOperation=>{

        // 0. Ask for current quorum (web1337.getCurrentEpochOnThread('at'))
        // 1. Get approvements (signatures) of epoch edge operation and aggregate it locally
        // 2. Now when you have 2/3N+1 approvements - send it to /epoch_edge_operation_to_mempool
        // 3. Transaction should be accepted now on the edge of current and the next epoch

    }

    //_________________ To work with other chains _______________

    addChain=(chainID,workflowVersion,nodeURL)=>this.chains.set(chainID,{nodeURL,workflowVersion})

    changeCurrentChain=chainID=>this.currentChain=chainID


}