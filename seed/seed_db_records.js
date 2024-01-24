import mongoose from "mongoose";
import data from "./records.js";
import Record from "../models/recordModel.js";
import "dotenv/config";

(async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    const records = data.map((item) => new Record(item));

    await Record.deleteMany();
    console.log("Data Deleted successfuly");

    await Record.insertMany(records);
    console.log("Data seeded successfuly");
  } catch (error) {
    console.log(`Error while seeding data: ${error}`);
  } finally {
    mongoose.connection.close();
  }
})();
