import { Octokit } from "@octokit/rest";

export async function createPullRequest(
  octokit: Octokit,
  owner: string,
  repo: string
) {
  try {
    await octokit.pulls.create({
      owner,
      repo,
      title: "Configure Hako",
      head: "main",
      base: "main",
      body: "Welcome to Hako. This is an onboarding PR to help you understand how to configure settings before regular Pull requests begin.",
    });
    return true;
  } catch (e) {
    console.error(`Failed to create PR for ${owner}/${repo}:`, e);
    return false;
  }
}
