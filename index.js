/*

Only general API & functionality present here. We'll extend abilities via modules & other packages and so on


*/


import fetch from 'node-fetch'

// import WS from 'websocket' //https://github.com/theturtle32/WebSocket-Node


export default class {

    constructor(symbioteID,nodeURL,proxy,hostChainTicker,hostchainNodeURL){

        this.proxy=proxy //for TOR/I2P connections

        this.symbiotes = new Map() //symbioteID => nodeURL

        this.hostchains = new Map() //ticker => endpoint(RPC,websocket,etc.)


        //Set the initial values
        this.currentSymbiote = symbioteID

        this.symbiotes.set(symbioteID,nodeURL)

        this.hostchains.set(hostChainTicker,hostchainNodeURL)

    }


    GET_REQUEST_TO_NODE=url=>{

        let nodeUrl = this.symbiotes.get(this.currentSymbiote)

        return fetch(nodeUrl+url).then(r=>r.json()).catch(e=>{

            console.log('_________ ERROR _________')

            console.error(e)

        })

    }


    POST_REQUEST_TO_NODE=(url,payload)=>{

        let nodeUrl = this.symbiotes.get(this.currentSymbiote)

        return fetch(nodeUrl+url,{

            method:'POST',
            body:JSON.stringify(payload)

        }).then(r=>r.json()).catch(e=>{

            console.log('_________ ERROR _________')

            console.error(e)

        })

    }

    
    //____________________________ GENERAL LOGIC _____________________________

    getGeneralInfo=()=>this.GET_REQUEST_TO_NODE('/info')

    getCurrentQuorum=()=>this.GET_REQUEST_TO_NODE('/getquorum')
    
    getBlock=blockID=>this.GET_REQUEST_TO_NODE('/block/'+blockID)

    getValidators=()=>this.GET_REQUEST_TO_NODE('/getvalidators')

    getAccount=accountID=>this.GET_REQUEST_TO_NODE('/account/'+accountID)

    getCommitments=(blockID,blockHash)=>this.GET_REQUEST_TO_NODE('/getcommitments/'+`${blockID}:${blockHash}`)

    getSuperFinalization=(blockID,blockHash)=>this.GET_REQUEST_TO_NODE('/getsuperfinalization/'+`${blockID}:${blockHash}`)

    getEvent=eventID=>{}


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


    //Initial sig types

    createDefaultEvent=async(workflowVersion,creator,eventType,nonce,fee,payload,ed25519Base64EncodedPrivateKey)=>{

        let eventTemplate = this.getEventTemplate(workflowVersion,creator,eventType,nonce,fee,payload)

        eventTemplate.p.t='D'

        eventTemplate.s = await SIG()//TODO

    }

    createThresholdSigEvent=()=>{}

    createMultisigEvent=()=>{}

    createPostQuantumEvent=()=>{}


    //____________________________ CONTRACTS LOGIC ____________________________

    getContractState=contractID=>this.GET_REQUEST_TO_NODE('/account'+contractID)

    callContract=params=>{}

    deployContractForKLYVM=(bytecode,callMap)=>{}

    deployContractForEVM=(bytecode,callMap)=>{}

    //____________________________ SERVICES LOGIC ____________________________


    //_____________________________ EVENTS BY VM _____________________________


    subscribeForEventsByContract=(contractID,eventID='ALL')=>{}


    //_________________ MUTUALISM(cross-symbiotic interaction) _______________

    addSymbiote=(symbioteID,nodeURL)=>this.symbiotes.set(symbioteID,nodeURL)

    addHostchain=(hostchainTicker,hostchainURL)=>this.hostchains.get(hostchainTicker,hostchainURL)

    changeCurrentSymbiote=symbioteID=>this.currentSymbiote=symbioteID



}