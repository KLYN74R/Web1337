import '../KLY_Addons/must_have/wasm_exec.js'

import tbls from './threshold/tbls.js'

import {hash} from 'blake3-wasm'

import Base58 from 'base-58'

import crypto from 'crypto'

import bls from './bls.js'

import Web3 from 'web3'





const web3 = new Web3() // this will be used to generate EVM addresses

const blake3 = (input,length=32) => hash(input,{length}).toString('hex')








export default {


    ed25519:{

        generateDefaultEd25519Keypair:async(mnemonic,mnemoPass,bip44Path)=>{

            let ed25519Box = globalThis.generateEd25519Keypair(mnemonic,mnemoPass,...bip44Path)

            return ed25519Box
        
        },
    
        
        signEd25519:(data,privateKeyAsBase64)=>{

            return new Promise((resolve, reject) => {

                const privateKeyPem = `-----BEGIN PRIVATE KEY-----\n${privateKeyAsBase64}\n-----END PRIVATE KEY-----`
        
                crypto.sign(null, Buffer.from(data), privateKeyPem, (error, signature) => {
        
                    error ? reject('') : resolve(signature.toString('base64'))
        
                })
        
            }).catch(() => '')

        },
    
           
    
        verifyEd25519:(data,signature,pubKey)=>{

            return new Promise((resolve, reject) => {

                // Decode public key from Base58 and encode to hex , add  
        
                let pubInHex = Buffer.from(Base58.decode(pubKey)).toString('hex')
        
                // Now add ASN.1 prefix
        
                let pubWithAsnPrefix = '302a300506032b6570032100'+pubInHex
        
                // Encode to Base64
        
                let pubAsBase64 = Buffer.from(pubWithAsnPrefix,'hex').toString('base64')
        
                // Finally, add required prefix and postfix
        
                let finalPubKey = `-----BEGIN PUBLIC KEY-----\n${pubAsBase64}\n-----END PUBLIC KEY-----`
        
                crypto.verify(null, data, finalPubKey, Buffer.from(signature, 'base64'), (err, isVerified) => 
        
                    err ? reject(false) : resolve(isVerified)
        
                )
        
        
            }).catch(() => false)

        }

    },

    bls,

    tbls,

    evm:{

        generate:()=>{
        
            let {address,privateKey} = web3.eth.accounts.create()
            
            return {address,privateKey}
        
        }
    
    },


    pqc:{


        dilithium:{

            // generate Dilithium PQC keypair.BLAKE3 hash of pubkey is address. Result => {private,public,address}
        
            generateDilithiumKeypair:()=>{

                let [pubKey,privateKey] = globalThis.generateDilithiumKeypair().split(':')

                return {pubKey,privateKey,address:blake3(pubKey)}

            },
        
            signData:(privateKey,message) => globalThis.generateDilithiumSignature(privateKey,message),

            verifySignature:(message,pubKey,signa) => globalThis.verifyDilithiumSignature(message,pubKey,signa)


        },


        bliss:{

            // generate BLISS PQC keypair.BLAKE3 hash of pubkey is address. Result => {private,public,address}

            generateBlissKeypair:()=>{

                let [pubKey,privateKey] = globalThis.generateBlissKeypair().split(':')

                return {pubKey,privateKey,address:blake3(pubKey)}
               

            },

            signData:(privateKey,message) => globalThis.generateBlissSignature(privateKey,message),

            verifySignature:(message,pubKey,signa) => globalThis.verifyBlissSignature(message,pubKey,signa)


        }

    }

}