import { getOctokit } from "../services/getOctokit.js";
import { createFileAndPullRequest } from "../services/createFileAndPullRequest.js";

export async function onInstallationCreated(
  installationId: number,
  repositories: any[]
) {
  const octokit = getOctokit(installationId);
  for (const repo of repositories) {
    console.dir(repo.owner);
    const owner = repo.owner;
    const repoName = repo.name;
    await createFileAndPullRequest(
      octokit,
      owner,
      repoName,
      "test.txt",
      "Hello, World!",
      "hako/configure",
      "Configure Hako",
      "Welcome to **Hako**! This is an onboarding PR to help you understand how to configure settings before regular Pull requests begin."
    );
  }
  return { ok: true };
}
