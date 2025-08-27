import { Octokit } from "@octokit/rest";

/**
 * 指定ファイルを新規ブランチで作成し、コミット・PRを作成する
 */
export async function createFileAndPullRequest(
  octokit: Octokit,
  owner: string,
  repo: string,
  filePath: string,
  content: string,
  branchName: string,
  prTitle: string,
  prBody: string
) {
  const { data: baseBranch } = await octokit.repos.getBranch({
    owner,
    repo,
    branch: "main",
  });
  const baseSha = baseBranch.commit.sha;

  await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: baseSha,
  });

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: `Add ${filePath}`,
    content: Buffer.from(content).toString("base64"),
    branch: branchName,
  });

  const pr = await octokit.pulls.create({
    owner,
    repo,
    title: prTitle,
    head: branchName,
    base: "main",
    body: prBody,
  });
  return pr.data;
}
