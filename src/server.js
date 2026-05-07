const express = require('express')
const app = express()
const path = require("path")
const config = require('./config')
const { PORT } = config.get('server')
const connectDB = require('./config/db')
const authRoute = require('./routes/auth.routes')
const usersRoutes = require("./routes/users.routes")
const {categoriesRoutes} = require("./routes/categories.routes")
// categoriesRoutes
app.use(express.json({ extended: false }))
app.use("../public", express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))

// const port =  === 'production' ?  process.env : 5000;
// connectDB()
app.get('/', (req, res) => {
    res.json({ message: "Wellcome to LAAM clone" })
})
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', usersRoutes)
// app.use('/api/v1/categories', categoriesRoutes)

// console.log(app)
app.listen(PORT, () => console.log(`server listen on http://localhost:${PORT}`))