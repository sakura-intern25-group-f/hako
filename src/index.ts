import dotenv from "dotenv";
import path from "path";
import { serve } from "@hono/node-server";
import { routeApp } from "./routes.js";

dotenv.config({
  path: path.join(import.meta.dirname, "../assets", "build.env"),
});

const app = routeApp();

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
