import Web1337 from "../index.js"

/*
    
    
            ███████╗██████╗  ██████╗  ██████╗██╗  ██╗                                       
            ██╔════╝██╔══██╗██╔═══██╗██╔════╝██║  ██║                                       
            █████╗  ██████╔╝██║   ██║██║     ███████║                                       
            ██╔══╝  ██╔═══╝ ██║   ██║██║     ██╔══██║                                       
            ███████╗██║     ╚██████╔╝╚██████╗██║  ██║                                       
            ╚══════╝╚═╝      ╚═════╝  ╚═════╝╚═╝  ╚═╝                                       
                                                                                
            ███████╗██████╗  ██████╗ ███████╗                                               
            ██╔════╝██╔══██╗██╔════╝ ██╔════╝                                               
            █████╗  ██║  ██║██║  ███╗█████╗                                                 
            ██╔══╝  ██║  ██║██║   ██║██╔══╝                                                 
            ███████╗██████╔╝╚██████╔╝███████╗                                               
            ╚══════╝╚═════╝  ╚═════╝ ╚══════╝                                               
                                                                                
             ██████╗ ██████╗ ██████╗ ███████╗ █████╗ ████████╗██╗ ██████╗ ███╗   ██╗███████╗
            ██╔═══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
            ██║   ██║██████╔╝██████╔╝█████╗  ███████║   ██║   ██║██║   ██║██╔██╗ ██║███████╗
            ██║   ██║██╔═══╝ ██╔══██╗██╔══╝  ██╔══██║   ██║   ██║██║   ██║██║╚██╗██║╚════██║
            ╚██████╔╝██║     ██║  ██║███████╗██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║███████║
             ╚═════╝ ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝                                                                  
                                                                                
    
    */

export let createEpochEdgeOperation=async(type,payload)=>{

    // See the examples
        
}
        
export let sendEpochEdgeOperation=async specialOperation=>{
                
    let optionsToSend = {
        
        method:'POST',
        body:JSON.stringify(specialOperation)
                
    }
        
    let status = await fetch(this.symbiotes.get(this.currentSymbiote),optionsToSend).then(r=>r.text()).catch(error=>error)
        
    return status
        
}