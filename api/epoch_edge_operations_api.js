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

export let createEpochEdgeOperation=async(web1337,type,payload)=>{

    // See the examples
        
}
        
export let sendEpochEdgeOperation=async(web1337,specialOperation)=>{
                
    let optionsToSend = {
        
        method:'POST',
        body:JSON.stringify(specialOperation)
                
    }
        
    let status = await fetch(web1337.symbiotes.get(web1337.currentSymbiote),optionsToSend).then(r=>r.text()).catch(error=>error)
        
    return status
        
}