import express from "express";
import morgan from "morgan";
import { router } from "./routes/index.js";
import cors from "cors";
import eventStream from "./eventStream.js";
export const app = express();
export const sse = express();
const PORT = process.env.port || 3001;
const SSEPORT = 3002;

app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.json());
app.use("/api/", router);
app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});

sse.use(express.urlencoded({ extended: false }));
sse.get("/", eventStream);
sse.listen(SSEPORT, function () {
  console.log(`Server is running on port ${SSEPORT}`);
});
