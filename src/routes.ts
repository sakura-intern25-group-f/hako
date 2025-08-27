import { Hono } from "hono";
import { onInstallationCreated } from "./usecases/onInstallationCreated.js";

export const routeApp = () => {
  const app = new Hono();
  app.post("/webhook", async (c) => {
    console.log(
      `Received webhook: ${JSON.stringify(await c.req.json(), null, 2)}`
    );
    const payload = await c.req.json();
    const event = c.req.header("x-github-event");

    if (event === "installation" && payload.action === "created") {
      const installationId = payload.installation.id;
      const repositories = payload.repositories;
      const result = await onInstallationCreated(installationId, repositories);
      return c.json(result);
    }
    return c.json({ ok: false });
  });

  return app;
};
