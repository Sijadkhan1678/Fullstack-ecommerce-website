const mongoose = require('mongoose')
const config = require('./index')


const connectDB = async () => {

    const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
    const { USER_NAME, PASSWORD } = config.get('dbConfig')
    
    const uri = `mongodb+srv://${USER_NAME}:${PASSWORD}@ecommercedata.dsyn8g.mongodb.net/?appName=ecommercedata`

    try {
        await mongoose.connect(uri, clientOptions)
        console.log('db connected')

    } catch (err) {
        console.log("db error", err)
        process.exit(1)
    }
}
module.exports = connectDB