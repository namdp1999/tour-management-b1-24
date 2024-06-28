import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import sequelize from "./config/database";
import Tour from "./models/tour.model";

sequelize;

const app: Express = express();
const port: (number | string) = `${process.env.PORT}` || 3000;

app.set("views", "./views");
app.set("view engine", "pug");

app.get("/tours", async (req: Request, res: Response) => {
  // SELECT * FROM tours WHERE deleted = false AND status = "active";
  const tours = await Tour.findAll({
    where: {
      deleted: false,
      status: "active"
    },
    raw: true
  });

  console.log(tours);

  res.render("client/pages/tours/index", {
    pageTitle: "Danh sách tour",
    tours: tours
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});