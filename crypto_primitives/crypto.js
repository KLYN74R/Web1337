import '../KLY_Addons/must_have/wasm_exec.js'

import tbls from './tbls/tbls.js'

import ed25519 from './ed25519.js'

import {hash} from 'blake3-wasm'

import bls from './bls.js'

import Web3 from 'web3'





const web3 = new Web3() // this will be used to generate EVM addresses

const blake3 = (input,length=32) => hash(input,{length}).toString('hex')








export default {


    ed25519,

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