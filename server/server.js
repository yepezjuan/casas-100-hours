import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db("casas");
const clients = db.collection("clients");

app.use(express.static(path.join(__dirname, "../dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.post("/api/clients", async (req, res) => {
  try {
    const result = await clients.insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/clients", async (req, res) => {
  try {
    const allClients = await clients.find().toArray();
    res.json(allClients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/deleteClient", async (req, res) => {
  try {
    const result = await clients.deleteOne({ _id: new ObjectId(req.body._id) });
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
});

app.listen(3000, function () {
  console.log("listening on 3000");
});
