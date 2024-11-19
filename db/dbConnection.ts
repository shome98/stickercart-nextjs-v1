"use server"
import mongoose from 'mongoose';
type ConnectionObject = {
    isConnected?: number;
  };
  
  const connection: ConnectionObject = {};
const dbConnect = async () => {
    if (connection.isConnected) {
        console.log('Already connected to the database');
        return;
      }
    try {
        const db=await mongoose.connect(process.env.MONGODB_URI as string|| '', {});
        connection.isConnected = db.connections[0].readyState;
        console.log('MongoDB connected!!!');
    } catch (error) {
        console.error('MongoDB connection failed!!! ', error);
    }
};

export default dbConnect;