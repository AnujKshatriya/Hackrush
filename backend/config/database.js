import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        console.log(process.env.MONGODB_URI)
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("DB connected")
    } catch (error) {
        console.log(error)
    }
}

export default connectDB