import Web1337 from "../index.js"



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
 * @param {*} contractID
 * @param {*} eventID
 */
export let subscribeForEventsByContract=async(web1337,contractID,eventID='ALL')=>{}