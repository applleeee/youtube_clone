import "dotenv/config";
import app from "./server";
import "./db";
import "./models/video";
import "./models/User";

const PORT = 4000;

const handleLisenting = () =>
  console.log(`server listenting on port http://localhost:${PORT}`);
app.listen(PORT, handleLisenting);
