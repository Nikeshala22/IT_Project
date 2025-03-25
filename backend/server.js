import express from 'express'
import cors from 'cors'
import 'dotenv/config.js'
import connectDB from './config/mongoDb.js'
import connectCloudinary from './config/cloudinary.js'
import inventoryRouter from './router/inventryRouter.js'
import servicePackageRouter from './router/servicepackageRouter.js'
import appointmentRouter from './router/appointmentRouter.js'


// app config
const app = express()
const port = process.env.PORT || 3000
connectDB()
connectCloudinary()


// middlewares
app.use(express.json())
app.use(cors())




//API Routes

app.use('/api/inventory', inventoryRouter);
app.use('/api/service',servicePackageRouter);
app.use('/api/appointment',appointmentRouter);


app.get('/',(req,res)=>{

    res.send("API WORKING")
})

app.listen(port, ()=> console.log("Server Started",port))