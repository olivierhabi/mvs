import express from "express";
import appRouter from "routes";

const app = express();

app.get("/", (req, res) =>
  res.status(200).json({ message: "Welcome to MyTop100Movies" })
);
app.use(express.json(), express.urlencoded({ extended: true }));
app.use(appRouter);

export default app;
