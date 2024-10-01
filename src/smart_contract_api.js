import {getTransactionTemplate} from "./txs_creation.js"

import crypto from '../crypto_primitives/crypto.js'

import Web1337, {TX_TYPES} from "../index.js"



/**
 * 
 * @param {Web1337} web1337  
 */
export let getContractMetadata=async(web1337,shardID,contractID)=>web1337.getRequestToNode(`/account/${shardID}/${contractID}`)


/**
 * 
 * @param {Web1337} web1337  
 */
export let getContractStorage=async(web1337,shardID,contractID,storageName)=>web1337.getRequestToNode(`/state/${shardID}/${contractID}_STORAGE_/${storageName}`)


/**
 * 
 * @param {Web1337} web1337  
 */
export let createContractDeploymentTx=async(web1337,originShard,yourAddress,yourPrivateKey,nonce,fee,sigType,bytecode,lang,constructorParams)=>{

/*

    Full transaction which contains contract deploy must have such structure
 
    {
        v: 0,
        creator: '2VEzwUdvSRuv1k2JaAEaMiL7LLNDTUf9bXSapqccCcSb',
        type: 'WVM_CONTRACT_DEPLOY',
        nonce: 0,
        fee: 1,
        payload: {
            bytecode:<hexString>,
            lang:<Rust|AssemblyScript>,
            constructorParams:{}
        },
        sigType: 'D',
        sig: '5AGkLlK3knzYZeZwjHKPzlX25lPMd7nU+rR5XG9RZa3sDpYrYpfnzqecm5nNONnl5wDcxmjOkKMbO7ulAwTFDQ=='
    }
 
*/

    let workflowVersion = web1337.chains.get(web1337.currentChain).workflowVersion

    let payload = {

        bytecode,
        lang,
        constructorParams

    }

    let contractDeploymentTxTemplate = getTransactionTemplate(workflowVersion,yourAddress,TX_TYPES.WVM_CONTRACT_DEPLOY,sigType,nonce,fee,payload)

    let dataToSign = web1337.currentChain+workflowVersion+originShard+TX_TYPES.WVM_CONTRACT_DEPLOY+JSON.stringify(payload)+nonce+fee


    if(sigType==='D') contractDeploymentTxTemplate.sig = await crypto.ed25519.signEd25519(dataToSign,yourPrivateKey)

    else if (sigType==='P/B') contractDeploymentTxTemplate.sig = crypto.pqc.bliss.signData(yourPrivateKey,dataToSign)

    else if (sigType==='P/D') contractDeploymentTxTemplate.sig = crypto.pqc.dilithium.signData(yourPrivateKey,dataToSign)

    // Return signed transaction

    return contractDeploymentTxTemplate


}



/**
 * 
 * @param {Web1337} web1337  
 */
export let createContractCallTx=async(web1337,originShard,yourAddress,yourPrivateKey,nonce,fee,sigType,contractID,method,gasLimit,params,injects)=>{

/*

Full transaction which contains method call of some smart contract must have such structure
 
{
    v: 0,
    creator: '2VEzwUdvSRuv1k2JaAEaMiL7LLNDTUf9bXSapqccCcSb',
    type: 'WVM_CALL',
    nonce: 0,
    fee: 1,
    payload:{

            contractID:<BLAKE3 hashID of contract OR alias of contract(for example, system contracts)>,
            method:<string method to call>,
            gasLimit:<maximum allowed in KLY to execute contract>
            params:{} params to pass to function
            imports:[] imports which should be included to contract instance to call. Example ['default.CROSS-CONTRACT','storage.GET_FROM_ARWEAVE']. As you understand, it's form like <MODULE_NAME>.<METHOD_TO_IMPORT>
        
    },
    sigType'D',
    sig: '5AGkLlK3knzYZeZwjHKPzlX25lPMd7nU+rR5XG9RZa3sDpYrYpfnzqecm5nNONnl5wDcxmjOkKMbO7ulAwTFDQ=='
}
 
*/

    let workflowVersion = web1337.chains.get(web1337.currentChain).workflowVersion

    let payload = {

        contractID,
        method,
        gasLimit,
        params,
        injects
        
    }

    let contractCallTxTemplate = getTransactionTemplate(workflowVersion,yourAddress,TX_TYPES.WVM_CALL,sigType,nonce,fee,payload)

    let dataToSign = web1337.currentChain+workflowVersion+originShard+TX_TYPES.WVM_CONTRACT_DEPLOY+JSON.stringify(payload)+nonce+fee


    if(sigType==='D') contractCallTxTemplate.sig = await crypto.ed25519.signEd25519(dataToSign,yourPrivateKey)

    else if (sigType==='P/B') contractCallTxTemplate.sig = crypto.pqc.bliss.signData(yourPrivateKey,dataToSign)

    else if (sigType==='P/D') contractCallTxTemplate.sig = crypto.pqc.dilithium.signData(yourPrivateKey,dataToSign)

    // Return signed transaction

    return contractCallTxTemplate


}



/**
 * 
 * @param {Web1337} web1337
 * @param {*} contractID
 * @param {*} eventID
 */
export let subscribeForEventsByContract=async(web1337,contractID,eventID='ALL')=>{}