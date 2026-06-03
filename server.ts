import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import apiRoutes from "./server/routes/index";
import { initDatabase } from "./server/database/db";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Initialize local persistent database store
  initDatabase();

  // 2. Body parsing middlewares first
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 3. API endpoints mounted FIRST
  app.use("/api", apiRoutes);

  // 4. Vite middleware integration for asset pipelines
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // 5. Host on 0.0.0.0 for ingress routing inside container
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Circular Economy Hub server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical failure booting the server:", err);
});
