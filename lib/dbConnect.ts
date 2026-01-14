import mongoose from "mongoose";

type ConnectionObject = {
     isConnected? : number;
}

const connection : ConnectionObject = {};

const dbConnect = async () : Promise<void> => {
     if (connection.isConnected) {
          console.log("Already connected to DB !!!");
          return;
     }

     try {
          const db = await mongoose.connect(process.env.MONGODB_URI || "");

          connection.isConnected = db.connections[0].readyState;

          console.log("DB Connected successfully !!!!");
          
     } catch (error:any) {
          console.error("DB ERROR | Database Connection Failed !",error.message)
          process.exit();
     }

}

export default dbConnect;