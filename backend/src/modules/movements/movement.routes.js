import { Router } from "express";
import { create, getAll, getSummary, remove } from "./movement.controller.js";

export const movementRouter = Router();

movementRouter.get("/", getAll);
movementRouter.get("/summary", getSummary);
movementRouter.post("/", create);
movementRouter.delete("/:id", remove);
