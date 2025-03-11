import {
  getIssueTitleAndBody,
  getPullRequestTitleAndBody,
  getIssueLabels,
  getPullRequestLabels,
} from "./utils"

export async function validateIssueTitleAndBody(
  issueType: string,
  issueNumber: number,
  titleRegex: RegExp | string | null,
  bodyRegex: RegExp | string | null,
  requiredLabels: string[] = [],
  forbiddenLabels: string[] = [],
): Promise<boolean> {
  if (
    !titleRegex &&
    !bodyRegex &&
    requiredLabels.length === 0 &&
    forbiddenLabels.length === 0
  ) {
    return true
  }

  if (issueType === "issue" || issueType === "both") {
    const { title, body } = await getIssueTitleAndBody(issueNumber)
    const labels = await getIssueLabels(issueNumber)

    if (titleRegex && !validate(titleRegex, title)) {
      return false
    }
    if (bodyRegex && !validate(bodyRegex, body)) {
      return false
    }
    if (!validateLabels(labels, requiredLabels, forbiddenLabels)) {
      return false
    }
    return true
  }

  if (issueType === "pull_request" || issueType === "both") {
    const { title, body } = await getPullRequestTitleAndBody(issueNumber)
    const labels = await getPullRequestLabels(issueNumber)

    if (titleRegex && !validate(titleRegex, title)) {
      return false
    }
    if (bodyRegex && !validate(bodyRegex, body)) {
      return false
    }
    if (!validateLabels(labels, requiredLabels, forbiddenLabels)) {
      return false
    }
    return true
  }

  throw new Error(`Invalid issue type: ${issueType}`)
}

function validate(match: string | RegExp | null, str: string): boolean {
  if (!match) {
    return true
  }
  if (match instanceof RegExp) {
    return match.test(str)
  }
  return str.includes(match)
}

function validateLabels(
  currentLabels: string[],
  requiredLabels: string[],
  forbiddenLabels: string[],
): boolean {
  // Check if all required labels are present
  if (!requiredLabels.every((label) => currentLabels.includes(label))) {
    return false
  }

  // Check if any forbidden labels are present
  if (forbiddenLabels.some((label) => currentLabels.includes(label))) {
    return false
  }

  return true
}
