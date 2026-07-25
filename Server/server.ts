import express from "express"


const app = express()
const PORT : number = 8000; 


app.listen(PORT, (err)=> {
    if (err) { 
        throw err
    } else { 
        console.log(`Server is running at ${PORT}`)
    }

})