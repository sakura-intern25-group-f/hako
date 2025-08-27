import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { createAppRun } from "./apprun.js";

const app = new Hono();

app.get("/", async (c) => {
  return c.text(await createAppRun());
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
