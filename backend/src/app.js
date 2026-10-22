import express from "express";
import { checkDatabaseConnection } from "./config/database.js";
import { AppError } from "./errors/app-error.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { notFound } from "./middlewares/not-found.js";
import { categoryRouter } from "./modules/categories/category.routes.js";
import { movementRouter } from "./modules/movements/movement.routes.js";

export const app = express();

app.use(express.json());

app.get("/health", async (_request, response, next) => {
  try {
    await checkDatabaseConnection();
    response.json({
      status: "ok",
      database: "connected",
      version:
        process.env.APP_VERSION ?? process.env.RENDER_GIT_COMMIT ?? "development",
    });
  } catch {
    next(new AppError("La base de datos no está disponible.", 503));
  }
});

app.get("/api/falla", () => {
  throw new Error("Falla de prueba TP9");
});

app.use("/api/categories", categoryRouter);
app.use("/api/movements", movementRouter);

app.use(notFound);
app.use(errorHandler);
