import "./env.js";
import { connectDB } from "./DB/db.js";
import app from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`App is running at port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDb", error);
  });
