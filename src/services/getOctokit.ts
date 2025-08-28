import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { readAsset } from "./readAsset.js";

export function getOctokit(installationId: number) {
  const build_env = readAsset("build.env").split("\n");
  const APP_ID = build_env[0];
  const PRIVATE_KEY = build_env[1];
  if (!APP_ID) {
    throw new Error("Missing required environment variable: GITHUB_APP_ID");
  }
  if (!PRIVATE_KEY) {
    throw new Error(
      "Missing required environment variable: GITHUB_APP_PRIVATE_KEY"
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
