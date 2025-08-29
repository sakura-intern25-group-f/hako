import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(import.meta.dirname, "../../assets", "build.env"),
});

export function getOctokit(installationId: number) {
  const APP_ID = process.env.GITHUB_APP_ID;
  const PRIVATE_KEY = process.env.GITHUB_APP_PRIVATE_KEY;
  if (!APP_ID) {
    throw new Error("Missing required environment variable: GITHUB_APP_ID");
  }
  if (!PRIVATE_KEY) {
    throw new Error(
      "Missing required environment variable: GITHUB_APP_PRIVATE_KEY",
    );
  }
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: APP_ID,
      privateKey: PRIVATE_KEY,
      installationId,
    },
  });
}
