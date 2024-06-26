import crypto from './crypto_primitives/crypto.js'

import Web1337 from './index.js'




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


export let getTransactionTemplate=(workflowVersion,creator,txType,nonce,fee,payload)=>{

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


// Transactions. Default, Multisig, Threshold, Post-quantum

/**
 * 
 * @param {Web1337} web1337 
 */
export let createDefaultTransaction=async(web1337,originShard,yourAddress,yourPrivateKey,nonce,recipient,fee,amountInKLY,rev_t)=>{

    let workflowVersion = web1337.symbiotes.get(web1337.currentSymbiote).workflowVersion
    
    let payload={

        type:SIGNATURES_TYPES.DEFAULT,

        to:recipient,

        amount:amountInKLY
        
    }

    // Reverse threshold should be set if recipient is a multisig address
    if(typeof rev_t === 'number') payload.rev_t=rev_t


    let transaction = getTransactionTemplate(workflowVersion,yourAddress,TX_TYPES.TX,nonce,fee,payload)

    transaction.sig = await crypto.ed25519.signEd25519(web1337.currentSymbiote+workflowVersion+originShard+TX_TYPES.TX+JSON.stringify(payload)+nonce+fee,yourPrivateKey)

    // Return signed transaction
    return transaction

}


/**
 * 
 * @param {Web1337} web1337 
 */
export let createMultisigTransaction=async(web1337,rootPubKey,aggregatedPubOfActive,aggregatedSignatureOfActive,afkSigners,nonce,fee,recipient,amountInKLY,rev_t)=>{

    let workflowVersion = web1337.symbiotes.get(web1337.currentSymbiote).workflowVersion
    
    let payload={

        type:SIGNATURES_TYPES.MULTISIG,

        active:aggregatedPubOfActive,

        afk:afkSigners,

        to:recipient,

        amount:amountInKLY
        
    }

    // Reverse threshold should be set if recipient is a multisig address
    if(typeof rev_t==='number') payload.rev_t=rev_t

    let multisigTransaction = getTransactionTemplate(workflowVersion,rootPubKey,TX_TYPES.TX,nonce,fee,payload)

    multisigTransaction.sig = aggregatedSignatureOfActive

    // Return signed tx
    return multisigTransaction

}

/**
 * 
 * @param {Web1337} web1337 
 */
export let buildPartialSignatureWithTxData=async(web1337,hexID,sharedPayload,originShard,nonce,fee,recipient,amountInKLY,rev_t)=>{

    let workflowVersion = web1337.symbiotes.get(web1337.currentSymbiote).workflowVersion

    let payloadForTblsTransaction = {

        to:recipient,

        amount:amountInKLY,
            
        type:SIGNATURES_TYPES.TBLS

    }

    if(typeof rev_t==='number') payloadForTblsTransaction.rev_t = rev_t

    let dataToSign = web1337.currentSymbiote+workflowVersion+originShard+TX_TYPES.TX+JSON.stringify(payloadForTblsTransaction)+nonce+fee

    let partialSignature = crypto.tbls.signTBLS(hexID,sharedPayload,dataToSign)
        
    return partialSignature

}




/**
 * 
 * @param {Web1337} web1337 
 */
export let createThresholdTransaction = async(web1337,tblsRootPubkey,partialSignaturesArray,nonce,recipient,amountInKLY,fee,rev_t)=>{
    
    let tblsPayload = {
    
        to:recipient,
    
        amount:amountInKLY,
    
        type:SIGNATURES_TYPES.TBLS
        
    }
    
    if(typeof rev_t==='number') tblsPayload.rev_t = rev_t


    let thresholdSigTransaction = getTransactionTemplate(
            
        web1337.symbiotes.get(web1337.currentSymbiote).workflowVersion,
            
        tblsRootPubkey,
            
        TX_TYPES.TX,
            
        nonce, fee, tblsPayload
            
    )
        
    thresholdSigTransaction.sig = crypto.tbls.buildSignature(partialSignaturesArray)
 
    return thresholdSigTransaction
 
}




/**
 * 
 * @param {Web1337} web1337
 */
export let createPostQuantumTransaction = async(web1337,originShard,sigType,yourAddress,yourPrivateKey,nonce,recipient,amountInKLY,fee,rev_t)=>{

    let workflowVersion = web1337.symbiotes.get(web1337.currentSymbiote).workflowVersion
    
    let payload={

        type: sigType === 'bliss' ? SIGNATURES_TYPES.POST_QUANTUM_BLISS : SIGNATURES_TYPES.POST_QUANTUM_DIL,
            
        to:recipient,

        amount:amountInKLY
        
    }

    // Reverse threshold should be set if recipient is a multisig address
    if(typeof rev_t === 'number') payload.rev_t = rev_t


    let transaction = getTransactionTemplate(workflowVersion,yourAddress,TX_TYPES.TX,nonce,fee,payload)

    let funcRef = sigType === 'bliss' ? crypto.pqc.bliss : crypto.pqc.dilithium

    transaction.sig = await funcRef.signData(yourPrivateKey,web1337.currentSymbiote+workflowVersion+originShard+TX_TYPES.TX+JSON.stringify(payload)+nonce+fee)

    // Return signed transaction
    return transaction

}


/**
 * 
 * @param {Web1337} web1137
 * @returns 
 */
export let sendTransaction = (web1137,transaction) => web1137.postRequestToNode('/transaction',transaction)
