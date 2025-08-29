import { getOctokit } from "../services/getOctokit.js";
import {
  createBranch,
  createFile,
  createPullRequest,
} from "../services/createFileAndPullRequest.js";
import { createSecret } from "../services/createSecrets.js";
import { readAsset } from "../services/readAsset.js";

const trigger_file_name = "hako.yml";
const trigger_file_body = readAsset(trigger_file_name);

const onboarding_file_name = "onboarding-pr.md";
const onboarding_file_body = readAsset(onboarding_file_name);

export async function onInstallationCreated(
  installationId: number,
  repositories: any[],
) {
  const octokit = getOctokit(installationId);
  await Promise.all(
    repositories.map(async (repo) => {
      const owner = repo.full_name.split("/")[0];
      const repoName = repo.name;
      const branchName = "hako/configure";

      await createSecret(
        octokit,
        owner,
        repoName,
        "SAKURACR_REGISTRY",
        process.env.SAKURACR_REGISTRY!,
      );
      await createSecret(
        octokit,
        owner,
        repoName,
        "SAKURACR_USER",
        process.env.SAKURACR_USER!,
      );
      await createSecret(
        octokit,
        owner,
        repoName,
        "SAKURACR_PASSWORD",
        process.env.SAKURACR_PASSWORD!,
      );
      await createSecret(
        octokit,
        owner,
        repoName,
        "SAKURA_API_TOKEN",
        process.env.SAKURA_API_TOKEN!,
      );
      await createSecret(
        octokit,
        owner,
        repoName,
        "SAKURA_API_SECRET",
        process.env.SAKURA_API_SECRET!,
      );

      await createBranch(octokit, owner, repoName, branchName);
      await createFile(
        octokit,
        owner,
        repoName,
        `.github/workflows/${trigger_file_name}`,
        trigger_file_body,
        branchName,
      );
      await createPullRequest(
        octokit,
        owner,
        repoName,
        branchName,
        "Configure Hako",
        onboarding_file_body,
      );
    }),
  );
  return { ok: true };
}
