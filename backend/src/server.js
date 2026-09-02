import { app } from "./app.js";
import { getJwtSecret } from "./config/auth.js";

const port = Number(process.env.PORT) || 3000;

getJwtSecret();

app.listen(port, () => {
  console.log(`Backend disponible en http://localhost:${port}`);
});
