import type { Octokit } from "@octokit/rest";

export async function addPRComment(
  octokit: Octokit,
  owner: string,
  repo: string,
  pullNumber: number,
  body: string,
): Promise<void> {
  try {
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: pullNumber,
      body,
    });
  } catch (error) {
    console.error("Failed to add comment:", error);
    throw error;
  }
}
