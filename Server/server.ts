import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'




dotenv.config()

const app = express()
const PORT : number = 8000; 




app.use(cors({
    origin:process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}))


app.get('/health', (req,res) => {
    res.json({
        status : 'ok', 
        message : 'Api is Running'
    })
})

app.listen(PORT, (err)=> {
    if (err) { 
        throw err
    } else { 
        console.log(`Server is running at ${PORT}`)
    }

})