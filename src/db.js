<<<<<<< HEAD
import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => console.log("DB Error", error));
db.once("open", () => console.log("Connected to DB"));
=======
import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => console.log("DB Error", error));
db.once("open", () => console.log("Connected to DB"));
>>>>>>> 3d56e735527d06c899ce66371cd52eb613986432
