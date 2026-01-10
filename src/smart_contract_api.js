/**
 * 
 * @param {import('../index.js').default} jsSdk
 */
export let getContractMetadata=async(jsSdk,contractID)=>jsSdk.getRequestToNode(`/account/${contractID}`)


/**
 * 
 * @param {import('../index.js').default} jsSdk
 */
export let getContractStorage=async(jsSdk,contractID,storageName)=>jsSdk.getRequestToNode(`/state/${contractID}_STORAGE_/${storageName}`)



/**
 * 
 * @param {import('../index.js').default} jsSdk
 * @param {*} contractID
 * @param {*} eventID
 */
export let subscribeForEventsByContract=async(jsSdk,contractID,eventID='ALL')=>{}