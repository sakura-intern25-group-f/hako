import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

export function getOctokit(installationId: number) {
  const APP_ID = process.env.GITHUB_APP_ID;
  const PRIVATE_KEY = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, "\n");
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: APP_ID,
      privateKey: PRIVATE_KEY,
      installationId,
    },
  });
}
