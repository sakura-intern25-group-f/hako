import { getOctokit } from "../services/getOctokit.js";
import {
  createBranch,
  createFile,
  createPullRequest,
} from "../services/createFileAndPullRequest.js";

export async function onInstallationCreated(
  installationId: number,
  repositories: any[]
) {
  const octokit = getOctokit(installationId);
  await Promise.all(
    repositories.map(async (repo) => {
      const owner = repo.full_name.split("/")[0];
      const repoName = repo.name;
      const branchName = "hako/configure";
      await createBranch(octokit, owner, repoName, branchName);
      await createFile(
        octokit,
        owner,
        repoName,
        "test.txt",
        "Hello, World!",
        branchName
      );
      await createPullRequest(
        octokit,
        owner,
        repoName,
        branchName,
        "Configure Hako",
        "Welcome to **Hako**! This is an onboarding PR to help you understand how to configure settings before regular Pull requests begin."
      );
    })
  );
  return { ok: true };
}
