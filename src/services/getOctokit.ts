import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

export function getOctokit(installationId: number) {
  const PRIVATE_KEY = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!APP_ID) {
    throw new Error("Missing required environment variable: GITHUB_APP_ID");
  }
  if (!PRIVATE_KEY) {
    throw new Error("Missing required environment variable: GITHUB_APP_PRIVATE_KEY");
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
