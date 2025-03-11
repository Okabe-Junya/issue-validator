import * as core from "@actions/core"
import * as github from "@actions/github"
import { validateIssueTitleAndBody } from "./validate"

async function run(): Promise<void> {
  try {
    const title = core.getInput("title")
    const body = core.getInput("body")
    const titleRegexFlag = core.getInput("title-regex-flags") === "true"
    const bodyRegexFlag = core.getInput("body-regex-flags") === "true"
    const issueType = core.getInput("issue-type")
    const isAutoClose = core.getInput("is-auto-close") === "true"
    const isMatch = core.getInput("is-match") === "true"
    const requiredLabels = core
      .getInput("required-labels")
      .split(",")
      .filter(Boolean)
    const forbiddenLabels = core
      .getInput("forbidden-labels")
      .split(",")
      .filter(Boolean)

    const titleRegex = titleRegexFlag ? new RegExp(title) : title || null
    const bodyRegex = bodyRegexFlag ? new RegExp(body) : body || null

    const issueNumber =
      github.context.payload.issue?.number ||
      github.context.payload.pull_request?.number
    if (!issueNumber) {
      throw new Error("No issue or pull request number found")
    }

    const result = await validateIssueTitleAndBody(
      issueType,
      issueNumber,
      titleRegex,
      bodyRegex,
      requiredLabels,
      forbiddenLabels,
    )

    const finalResult = isMatch ? result : !result
    core.setOutput("result", finalResult.toString())

    if (!finalResult && isAutoClose) {
      const octokit = github.getOctokit(core.getInput("github-token"))
      await octokit.rest.issues.update({
        ...github.context.repo,
        issue_number: issueNumber,
        state: "closed",
      })
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
