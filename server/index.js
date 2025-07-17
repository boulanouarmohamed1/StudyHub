require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ChatRoute = require("./routes/chat.routes");
const uploadRoutes = require("./routes/upload");

const app = express();
app.use(cors());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET"],
}));
app.use(express.json());

app.use("/", ChatRoute);
app.use("/", uploadRoutes);


app.listen(3001, () => console.log("Server running on port 3001"));
