import mongoose from "mongoose";
import User from "../models/userModel.js";
import { faker } from "@faker-js/faker";
import "dotenv/config";

(async () => {
  try {
    await mongoose.connect(process.env.DB_URI);

    await User.deleteMany();
    console.log("Users purged");

    const { person, internet, helpers } = faker;

    const users = Array.from(
      { length: 5 },
      () =>
        new User({
          firstName: person.firstName(),
          lastName: person.lastName(),
          email: internet.exampleEmail(),
          password: internet.password(),
          role: helpers.arrayElement(["user", "admin"]),
        })
    );

    await User.create(users);
    console.log("Users data seeded successfully!");
  } catch (error) {
    console.error("Error while seeding data:", error);
  } finally {
    mongoose.connection.close();
  }
})();
