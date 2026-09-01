import { Router } from "express";
import { create, getAll } from "./category.controller.js";

export const categoryRouter = Router();

categoryRouter.get("/", getAll);
categoryRouter.post("/", create);
