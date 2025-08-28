import { getOctokit } from "../services/getOctokit.js";
import {
  createBranch,
  createFile,
  createPullRequest,
} from "../services/createFileAndPullRequest.js";
import path from "path";
import fs from "fs";

const trigger_file_name = "trigger.yml";
const trigger_path = path.join(process.cwd(), trigger_file_name);
const trigger_file_body = fs.readFileSync(trigger_path, "utf8");

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
        trigger_file_name,
        trigger_file_body,
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
