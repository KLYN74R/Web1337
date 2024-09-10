import Web1337 from '../index.js'


let web1337 = new Web1337({

    chainID:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    workflowVersion:0,
    nodeURL: 'http://localhost:7332'

});


console.log(`Current checkpoint is => `,await web1337.getCurrentCheckpoint())

console.log(`AFP for block 7GPupbq1vtKUgaqVeHiDbEJcxS7sSjwPnbht4eRaDBAEJv8ZKHNCSu2Am3CuWnHjta:0 is => `,await web1337.getAggregatedFinalizationProofForBlock('7GPupbq1vtKUgaqVeHiDbEJcxS7sSjwPnbht4eRaDBAEJv8ZKHNCSu2Am3CuWnHjta:0'))

console.log('Get block 7GPupbq1vtKUgaqVeHiDbEJcxS7sSjwPnbht4eRaDBAEJv8ZKHNCSu2Am3CuWnHjta:0 by blockID => ',await web1337.getBlockByBlockID('7GPupbq1vtKUgaqVeHiDbEJcxS7sSjwPnbht4eRaDBAEJv8ZKHNCSu2Am3CuWnHjta:0'))

console.log('Get block 0 by GRID => ',await web1337.getBlockByGRID(0))

console.log('Infrastructure info => ',await web1337.getGeneralInfoAboutKLYInfrastructure())

console.log('Current state => ',await web1337.getSyncState())