import {SIGNATURES_TYPES} from '../index.js'

import crypto from '../crypto_primitives/crypto.js'

import bls from '../crypto_primitives/bls.js'





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


let toBigIntString = value => BigInt(Math.round(value * 1e18)).toString();


export let getTransactionTemplate=(workflowVersion,creator,txType,sigType,nonce,fee,payload)=>{

    fee = toBigIntString(fee)

    let payloadCopy = JSON.parse(JSON.stringify(payload))

    if(payloadCopy.amount) payloadCopy.amount = toBigIntString(payloadCopy.amount)

    if(payloadCopy?.params?.amount) payloadCopy.params.amount = toBigIntString(payloadCopy.params.amount)


    return {

        v:workflowVersion,
        creator,
        type:txType,
        nonce,
        fee,
        payload: payloadCopy,
        sigType,
        sig:''

    }

}



// Transactions. Default, Multisig, Threshold, Post-quantum

/**
 * 
 * @param {import('../index.js').default} jsSdk
 */
export let createEd25519Transaction=(jsSdk,txType,yourAddress,yourPrivateKey,nonce,fee,payload)=>{

    let workflowVersion = jsSdk.chains.get(jsSdk.currentChain).workflowVersion

    let transaction = getTransactionTemplate(workflowVersion,yourAddress,txType,SIGNATURES_TYPES.DEFAULT,nonce,fee,payload)

    transaction.sig = crypto.ed25519.signEd25519(jsSdk.currentChain+workflowVersion+txType+JSON.stringify(transaction.payload)+nonce+transaction.fee,yourPrivateKey)

    // Return signed transaction

    return transaction

}



/**
 * 
 * @param {import('../index.js').default} jsSdk
 */
export let signDataForMultisigTransaction=(jsSdk,txType,blsPrivateKey,nonce,fee,payload)=>{

    let workflowVersion = jsSdk.chains.get(jsSdk.currentChain).workflowVersion

    let txTemplate = getTransactionTemplate(workflowVersion,'',txType,SIGNATURES_TYPES.MULTISIG,nonce,fee,payload)

    let dataToSign = jsSdk.currentChain+workflowVersion+txType+JSON.stringify(txTemplate.payload)+nonce+txTemplate.fee

    let singleSigna = bls.singleSig(dataToSign,blsPrivateKey)

    return singleSigna

}



/**
 * 
 * @param {import('../index.js').default} jsSdk
 */
export let createMultisigTransaction=async(jsSdk,txType,rootPubKey,aggregatedSignatureOfActive,nonce,fee,payload)=>{

    let workflowVersion = jsSdk.chains.get(jsSdk.currentChain).workflowVersion

    let multisigTransaction = getTransactionTemplate(workflowVersion,rootPubKey,txType,SIGNATURES_TYPES.MULTISIG,nonce,fee,payload)

    multisigTransaction.sig = aggregatedSignatureOfActive

    // Return signed tx
    return multisigTransaction

}

/**
 * 
 * @param {import('../index.js').default} jsSdk
 */
export let buildPartialSignatureWithTxData=(jsSdk,txType,hexID,sharedPayload,nonce,fee,payloadForTblsTransaction)=>{

    let workflowVersion = jsSdk.chains.get(jsSdk.currentChain).workflowVersion

    let txTemplate = getTransactionTemplate(workflowVersion,'',txType,SIGNATURES_TYPES.TBLS,nonce,fee,payloadForTblsTransaction)

    let dataToSign = jsSdk.currentChain+workflowVersion+txType+JSON.stringify(txTemplate.payload)+nonce+txTemplate.fee

    let partialSignature = crypto.tbls.signTBLS(hexID,sharedPayload,dataToSign)
        
    return partialSignature

}




/**
 * 
 * @param {import('../index.js').default} jsSdk
 */
export let createThresholdTransaction = (jsSdk,txType,tblsRootPubkey,partialSignaturesArray,nonce,fee,tblsPayload) => {

    let thresholdSigTransaction = getTransactionTemplate(
            
        jsSdk.chains.get(jsSdk.currentChain).workflowVersion,
            
        tblsRootPubkey,
            
        txType,

        SIGNATURES_TYPES.TBLS,
            
        nonce, fee, tblsPayload
            
    )
        
    thresholdSigTransaction.sig = crypto.tbls.buildSignature(partialSignaturesArray)
 
    return thresholdSigTransaction
 
}




/**
 * 
 * @param {import('../index.js').default} jsSdk
 */
export let createPostQuantumTransaction = (jsSdk,txType,pqcAlgorithm,yourAddress,yourPrivateKey,nonce,fee,payload)=>{

    let workflowVersion = jsSdk.chains.get(jsSdk.currentChain).workflowVersion

    let sigTypeToAddToTx = pqcAlgorithm === 'bliss' ? SIGNATURES_TYPES.POST_QUANTUM_BLISS : SIGNATURES_TYPES.POST_QUANTUM_DILITHIUM

    let transaction = getTransactionTemplate(workflowVersion,yourAddress,txType,sigTypeToAddToTx,nonce,fee,payload)

    let funcRef = pqcAlgorithm === 'bliss' ? crypto.pqc.bliss : crypto.pqc.dilithium


    transaction.sig = funcRef.signData(yourPrivateKey,jsSdk.currentChain+workflowVersion+txType+JSON.stringify(transaction.payload)+nonce+transaction.fee)

    // Return signed transaction

    return transaction

}


/**
 * 
 * @param {import('../index.js').default} jsSdk
 * @returns 
 */
export let sendTransaction = (jsSdk,transaction) => jsSdk.postRequestToNode('/transaction',transaction)
