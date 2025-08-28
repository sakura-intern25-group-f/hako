import { Hono } from "hono";
import { onInstallationCreated } from "./usecases/onInstallationCreated.js";
import { getOctokit } from "./services/getOctokit.js";
import { addPRComment } from "./services/addPRComment.js";
import { Octokit } from "@octokit/rest";

export const routeApp = () => {
  const app = new Hono();
  app.post("/webhook", async (c) => {
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
  app.post("/pr-comment", async (c) => {
    const payload = await c.req.json();
    const { owner, repo, pullNumber, body } = payload;
    const octokit = new Octokit();
    try {
      await addPRComment(octokit, owner, repo, pullNumber, body);
      return c.json({ ok: true });
    } catch (error) {
      return c.json({ ok: false, error });
    }
  });

  return app;
};
