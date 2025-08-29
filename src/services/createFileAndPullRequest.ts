import { Octokit } from "@octokit/rest";

export async function createBranch(
  octokit: Octokit,
  owner: string,
  repo: string,
  branchName: string,
  baseBranch: string = "main",
) {
  const { data: baseBranchData } = await octokit.repos.getBranch({
    owner,
    repo,
    branch: baseBranch,
  });
  const baseSha = baseBranchData.commit.sha;
  await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: baseSha,
  });
}

export async function createFile(
  octokit: Octokit,
  owner: string,
  repo: string,
  filePath: string,
  content: string,
  branchName: string,
) {
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: `Add ${filePath}`,
    content: Buffer.from(content).toString("base64"),
    branch: branchName,
  });
}

export async function createPullRequest(
  octokit: Octokit,
  owner: string,
  repo: string,
  branchName: string,
  prTitle: string,
  prBody: string,
  baseBranch: string = "main",
) {
  const pr = await octokit.pulls.create({
    owner,
    repo,
    title: prTitle,
    head: branchName,
    base: baseBranch,
    body: prBody,
  });
  return pr.data;
}
