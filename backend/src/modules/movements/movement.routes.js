import { Router } from "express";
import { create, getAll, getSummary } from "./movement.controller.js";

export const movementRouter = Router();

movementRouter.get("/", getAll);
movementRouter.get("/summary", getSummary);
movementRouter.post("/", create);
