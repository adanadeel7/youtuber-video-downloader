import mongoose from "mongoose";
import dotenv from 'dotenv'

const connectDB = async() => { 
    const isProduction = process.env.NODE_ENV || 'production'
    const mongoUri : any = process.env.MONGODB_URI 

    if (isProduction && !mongoUri) { 
        console.error('Mongo_Uri is missing in production environment variables')
        process.exit(1)
    }

    try {
        const conn = await mongoose.connect(mongoUri , {
        serverSelectionTimeoutMS: 5000,})

        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (err:any) {
        console.error(`Error connecting to mongoDB: ${err.message}`)
        if (isProduction) { 
            process.exit(1)
        }
    }



}

export default connectDB;