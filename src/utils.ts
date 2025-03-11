import * as core from "@actions/core"
import * as github from "@actions/github"

export async function getIssueTitleAndBody(
  issueNumber: number,
): Promise<{ title: string; body: string }> {
  const octokit = github.getOctokit(core.getInput("github-token", { required: true }))
  const { data: issue } = await octokit.rest.issues.get({
    ...github.context.repo,
    issue_number: issueNumber,
  })
  return {
    title: issue.title,
    body: issue.body || "",
  }
}

export async function getPullRequestTitleAndBody(
  prNumber: number,
): Promise<{ title: string; body: string }> {
  const octokit = github.getOctokit(core.getInput("github-token", { required: true }))
  const { data: pr } = await octokit.rest.pulls.get({
    ...github.context.repo,
    pull_number: prNumber,
  })
  return {
    title: pr.title,
    body: pr.body || "",
  }
}

export async function getIssueLabels(issueNumber: number): Promise<string[]> {
  const octokit = github.getOctokit(core.getInput("github-token", { required: true }))
  const { data: issue } = await octokit.rest.issues.get({
    ...github.context.repo,
    issue_number: issueNumber,
  })
  return issue.labels.map((label: any) =>
    typeof label === "string" ? label : label.name,
  )
}

export async function getPullRequestLabels(
  prNumber: number,
): Promise<string[]> {
  const octokit = github.getOctokit(core.getInput("github-token", { required: true }))
  const { data: pr } = await octokit.rest.pulls.get({
    ...github.context.repo,
    pull_number: prNumber,
  })
  return pr.labels.map((label: any) =>
    typeof label === "string" ? label : label.name,
  )
}
