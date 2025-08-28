import { getOctokit } from "../services/getOctokit.js";
import {
  createBranch,
  createFile,
  createPullRequest,
} from "../services/createFileAndPullRequest.js";
import path from "path";
import fs from "fs";

const read_assets = (filename: string) =>
  fs.readFileSync(path.join(__dirname, "../assets", filename), "utf8");

const trigger_file_name = "hako.yml";
const trigger_file_body = read_assets(trigger_file_name);

const onboarding_file_name = "onboarding-pr.yml";
const onboarding_file_body = read_assets(onboarding_file_name);

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
        `.github/workflows/${trigger_file_name}`,
        trigger_file_body,
        branchName
      );
      await createPullRequest(
        octokit,
        owner,
        repoName,
        branchName,
        "Configure Hako",
        onboarding_file_body
      );
    })
  );
  return { ok: true };
}
