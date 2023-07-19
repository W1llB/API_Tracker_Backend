import express from "express";
import morgan from "morgan";
import { router } from "./routes/index.js";
import cors from "cors";

export const app = express();
const PORT = process.env.port || 3001;

app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/sse", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // flush the headers to establish SSE with client
  console.log("client connected");

  let counter = 0;
  let interValID = setInterval(() => {
    counter++;
    if (counter >= 10) {
      clearInterval(interValID);
      res.end(); // terminates SSE session
      return;
    }
    const sseId = new Date().toDateString();
    res.write(
      `data: ${JSON.stringify({
        num: counter,
        id: sseId,
      })}\n\n`
    ); // res.write() instead of res.send()
  }, 10000);

  // If client closes connection, stop sending events
  res.on("close", () => {
    console.log("client dropped me");
    clearInterval(interValID);
    res.end();
  });
});
app.use("/api/", router);
app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
