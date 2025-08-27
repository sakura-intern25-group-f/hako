import { getOctokit } from "../services/getOctokit.js";
import { createPullRequest } from "../services/createPullRequest.js";

export async function onInstallationCreated(
  installationId: number,
  repositories: any[]
) {
  const octokit = getOctokit(installationId);
  for (const repo of repositories) {
    const owner = repo.owner.login;
    const repoName = repo.name;
    await createPullRequest(octokit, owner, repoName);
  }
  return { ok: true };
}
