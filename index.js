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


    REQUEST_TO_NODE=url=>{

        let nodeUrl = this.symbiotes.get(this.currentSymbiote)

        return fetch(nodeUrl+url).then(r=>r.json()).catch(e=>{

            console.log('_________ ERROR _________')

            console.error(e)

        })

    }

    //____________________________ GENERAL LOGIC _____________________________

    getGeneralInfo=()=>this.REQUEST_TO_NODE('/info')

    getCurrentQuorum=()=>this.REQUEST_TO_NODE('/getquorum')
    
    getBlock=blockID=>this.REQUEST_TO_NODE('/block/'+blockID)

    getValidators=()=>this.REQUEST_TO_NODE('/getvalidators')

    getAccount=accountID=>this.REQUEST_TO_NODE('/account'+accountID)

    getCommitments=(blockID,blockHash)=>this.REQUEST_TO_NODE('/getcommitments/'+`${blockID}:${blockHash}`)

    getSuperFinalization=(blockID,blockHash)=>this.REQUEST_TO_NODE('/getsuperfinalization/'+`${blockID}:${blockHash}`)

    getEvent=eventID=>{}

    //____________________________ CONTRACTS LOGIC ____________________________

    getContractState=contractID=>this.REQUEST_TO_NODE('/account'+contractID)

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