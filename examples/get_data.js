import Web1337 from '../index.js';


let web1337 = new Web1337('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',0,'http://localhost:7331');

let block = await web1337.getBlockByBlockID('7GPupbq1vtKUgaqVeHiDbEJcxS7sSjwPnbht4eRaDBAEJv8ZKHNCSu2Am3CuWnHjta:10')

console.log(block)

console.log('Account info is ',await web1337.getAccount('7GPupbq1vtKUgaqVeHiDbEJcxS7sSjwPnbht4eRaDBAEJv8ZKHNCSu2Am3CuWnHjta'))


console.log('General node info ',await web1337.getGeneralInfoAboutKLYInfrastructure())


console.log('1137th block is => ',await web1337.getBlockByRID(130))


console.log('Symbiote info is => ',await web1337.getSymbioteInfo())


console.log('Pool storage is ',await web1337.getContractStorage('7GPupbq1vtKUgaqVeHiDbEJcxS7sSjwPnbht4eRaDBAEJv8ZKHNCSu2Am3CuWnHjta(POOL)','POOL'))
