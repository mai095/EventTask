import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose
    .connect(process.env.CONNECTION_URL)
    .then(() => {
      console.log("Connected to DataBase");
    })
    .catch("Failtd connection to DataBase");
};
export default connectDB;
