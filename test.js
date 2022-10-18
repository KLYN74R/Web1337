import Web1337 from './index.js';


let web1337 = new Web1337('init-1337','http://localhost:6666');

let block = await web1337.getBlock('7GPupbq1vtKUgaqVeHiDbEJcxS7sSjwPnbht4eRaDBAEJv8ZKHNCSu2Am3CuWnHjta:1')


console.log(block)