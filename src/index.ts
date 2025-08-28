import { serve } from "@hono/node-server";
import { routeApp } from "./routes.js";

const app = routeApp();

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
