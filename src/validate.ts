import { getIssueTitleAndBody, getPullRequestTitleAndBody } from './utils';

export async function validateIssueTitleAndBody(
  issueType: string,
  issueNumber: number,
  titleRegex: RegExp | string | null,
  bodyRegex: RegExp | string | null,
): Promise<boolean> {
  if (!titleRegex && !bodyRegex) {
    return true;
  }
  if (issueType === 'issue' || issueType === 'both') {
    const { title, body } = await getIssueTitleAndBody(issueNumber);
    if (titleRegex && !validate(titleRegex, title)) {
      return false;
    }
    if (bodyRegex && !validate(bodyRegex, body)) {
      return false;
    }
    return true;
  }
  if (issueType === 'pull_request' || issueType === 'both') {
    const { title, body } = await getPullRequestTitleAndBody(issueNumber);
    if (titleRegex && !validate(titleRegex, title)) {
      return false;
    }
    if (bodyRegex && !validate(bodyRegex, body)) {
      return false;
    }
    return true;
  }
  throw new Error(`Invalid issue type: ${issueType}`);
}

function validate(match: string | RegExp | null, str: string): boolean {
  if (!match) {
    return true;
  }
  if (match instanceof RegExp) {
    return match.test(str);
  }
  return str.includes(match);
}
