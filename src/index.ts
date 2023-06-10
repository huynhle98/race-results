import express, { Application, urlencoded } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import Routers from "./routes/routers";
import { connectToDatabase } from "./services/database.service";

const PORT = process.env.PORT || 4800;

const app: Application = express();

app.use(express.json());
app.use(morgan("tiny")); //use to show request logger(Combined, Common, Short, Dev)
app.use(express.static("swagger"));
app.use(
  urlencoded({
    extended: true,
  })
);

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

app.use(Routers);

app.listen(PORT, () => {
  connectToDatabase()
    .then(() => {
      console.log("Database connection successfully");
    })
    .catch((error: Error) => {
      console.error("Database connection failed", error);
      process.exit();
    });
  console.log("Server is running on port", PORT);
});