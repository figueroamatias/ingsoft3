import { Router } from "express";
import { create, getAll } from "./movement.controller.js";

export const movementRouter = Router();

movementRouter.get("/", getAll);
movementRouter.post("/", create);
