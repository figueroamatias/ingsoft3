import { Router } from "express";
import { getAll } from "./category.controller.js";

export const categoryRouter = Router();

categoryRouter.get("/", getAll);
