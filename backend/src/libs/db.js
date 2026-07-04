import mongoose from "mongoose";
import dns from "dns";
  

export const connectDB = async () => {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    await mongoose.connect(process.env.MONGO_CONNECTIONSTRING);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
