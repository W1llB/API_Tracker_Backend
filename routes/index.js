import express from "express";
import { createApi, getApis, deleteApi } from "../models/index.js";
const router = express.Router();

router.get("/", async function (req, res) {
  const result = await getApis();
  if (result == undefined) {
    return res.json({ success: false });
  }
  return res.json({ success: true, payload: result });
});

router.post("/", async function (req, res) {
  /* test for empty body */
  if (JSON.stringify(req.body) === "{}") {
    res.status(400);
    return res.json({ success: false });
  }
  const result = await createApi(req.body);
  if (result == undefined) {
    res.status(400);
    return res.json({ success: false });
  }
  return res.status(201).json({ success: true, payload: result });
});

router.delete("/:id", async function (req, res) {
  const result = await deleteApi(req.params.id);
  if (req.params.id === undefined) {
    return res
      .status(404)
      .json({ success: false, payload: "type the id that exists" });
  }
  if (result.length !== 0) {
    return res.status(200).json({ success: true, payload: result });
  } else {
    return res
      .status(404)
      .json({ success: false, payload: "please enter an id that exists" });
  }
});

export { router };
