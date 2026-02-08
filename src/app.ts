import express, { Application } from "express";
import router from "./app/routes";
import cors from "cors";
import globlaErrorHandler from "./middleware/globalError";
import globalErrorHandler from "./middleware/globalError";

const app: Application = express();

app.use(
  cors({
    origin: ['https://independent-mart.vercel.app','http://localhost:3000','http://api.buybarionline.com'],
    credentials: true,
  })
);
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("server is listenting");
});

app.use(globalErrorHandler);

export default app;
