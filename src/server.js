const express = require('express')
const app = express()
const config = require('./config')
const {PORT} = config.get('server')
const connectDB = require('./config/db') 
const authRoute =  require('./routes/auth.routes')

app.use(express.json({extended:false}))

// const port =  === 'production' ?  process.env : 5000;
connectDB()

app.use('/api/v1/auth',authRoute)



app.listen(PORT,()=> console.log(`server listen on http://localhost:${PORT}`))