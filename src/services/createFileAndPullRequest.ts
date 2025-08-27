import { Octokit } from "@octokit/rest";

export async function createBranch(
  octokit: Octokit,
  owner: string,
  repo: string,
  branchName: string,
  baseBranch: string = "main"
) {
  // 既存ブランチチェック
  try {
    await octokit.repos.getBranch({ owner, repo, branch: branchName });
    // 既にブランチが存在する場合は何もしない
    return;
  } catch (e: any) {
    // 存在しない場合のみ作成
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
}

export async function createFile(
  octokit: Octokit,
  owner: string,
  repo: string,
  filePath: string,
  content: string,
  branchName: string
) {
  // ファイル存在チェック
  let exists = false;
  try {
    await octokit.repos.getContent({
      owner,
      repo,
      path: filePath,
      ref: branchName,
    });
    exists = true;
  } catch (e: any) {
    exists = false;
  }
  if (exists) {
    // 既にファイルが存在する場合は何もしない
    return;
  }
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
  baseBranch: string = "main"
) {
  // PR重複チェック
  const { data: prs } = await octokit.pulls.list({
    owner,
    repo,
    state: "open",
    head: `${owner}:${branchName}`,
  });
  if (prs.length > 0) {
    // 既にPRが存在する場合は何もしない
    return prs[0];
  }
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
