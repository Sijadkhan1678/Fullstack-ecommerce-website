const express = require('express')
const app = express()
const port = process.env === 'production' ?  process.env : 5000;
// console.log(app.use)
app.get((req,res)=>{
    
    res.send('hello')
})
app.listen(5000,()=> console.log(`server listen on port ${port}`))