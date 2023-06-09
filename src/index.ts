import express, { Application } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import Routers from "./routes";

const PORT = process.env.PORT || 4300;

const app: Application = express();

app.use(express.json());
app.use(morgan("tiny")); //use to show request logger(Combined, Common, Short, Dev)
app.use(express.static("public"));

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
  console.log("Server is running on port", PORT);
});