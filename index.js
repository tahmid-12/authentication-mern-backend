import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDb.js";
import authRoutes from "./routes/route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log("App is running at port:", PORT);
});

// opgpJHGSbSImzD0z 

// mongodb+srv://mdtahmidchowdhury12:opgpJHGSbSImzD0z@cluster0.1yd73.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0