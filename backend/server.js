import express from 'express'
import cors from 'cors'
import 'dotenv/config.js'
import connectDB from './config/mongoDb.js'
import connectCloudinary from './config/cloudinary.js'
import inventoryRouter from './router/inventryRouter.js'


// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()


// middlewares
app.use(express.json())
app.use(cors())




//API Routes

app.use('/api/inventory', inventoryRouter);


app.get('/',(req,res)=>{

    res.send("API WORKING")
})

app.listen(port, ()=> console.log("Server Started",port))