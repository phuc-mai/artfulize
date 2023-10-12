import mongoose from "mongoose";

let isConnected = false // Track the connection

export const connectToDB = async() => {
  mongoose.set('strictQuery', true)

  if (isConnected) {
    console.log("MongoDB is connected successfully!")
    return
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "Artfulize",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    isConnected = true
    
    console.log("MongoDB connected")
  } catch (error) {
    console.log(error)
  }
}