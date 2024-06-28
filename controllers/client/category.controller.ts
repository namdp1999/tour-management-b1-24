import { Request, Response } from "express";

// [GET] /categories
export const index = async (req: Request, res: Response) => {
  res.render("client/pages/categories/index", {
    pageTitle: "Danh mục tour",
  });
}