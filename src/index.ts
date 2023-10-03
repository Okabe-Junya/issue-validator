import { getInput, setOutput, warning, setFailed, debug } from '@actions/core';

import { validateIssueTitleAndBody } from './validate';
import { getOctokit, context } from '@actions/github';

export async function run() {
  try {
    const title = getInput('title') || '';
    const titleRegexFlags = getInput('title-regex-flags' || '');
    const body = getInput('body') || '';
    const bodyRegexFlags = getInput('body-regex-flags') || '';
    const octokit = getOctokit(getInput('github-token', { required: true }));

    const issueType = getInput('issue-type') || 'issue';
    const issueNumber = context.issue.number;
    const isAutoClose = getInput('is-auto-close') || 'false';

    debug(
      `inputs: ${JSON.stringify({
        title,
        titleRegexFlags,
        body,
        bodyRegexFlags,
        issueType,
        issueNumber,
        isAutoClose,
      })}`,
    );

    let titleRegex: RegExp | string | null;
    let bodyRegex: RegExp | string | null;
    if (titleRegexFlags === 'true') {
      titleRegex = new RegExp(title);
    } else {
      titleRegex = title;
    }
    if (bodyRegexFlags === 'true') {
      bodyRegex = new RegExp(body);
    } else {
      bodyRegex = body;
    }

    debug(`regex: ${JSON.stringify({ titleRegex, bodyRegex })}`);

    const result = await validateIssueTitleAndBody(
      issueType,
      issueNumber,
      titleRegex,
      bodyRegex,
    );

    debug(`result: ${result}`);

    if (result === true) {
      setOutput('result', 'true');
    } else {
      if (isAutoClose === 'true') {
        warning(`Issue #${issueNumber} is not valid. Auto closing issue...`);
        // Add comment
        await octokit.rest.issues.createComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issueNumber,
          body: `Issue #${issueNumber} is not valid`,
        });

        // Close issue
        await octokit.rest.issues.update({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issueNumber,
          state: 'closed',
        });
      } else {
        warning(`Issue #${issueNumber} is not valid.`);
        // Add comment
        await octokit.rest.issues.createComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issueNumber,
          body: `Issue #${issueNumber} is not valid`,
        });
      }
    }
    /* eslint @typescript-eslint/no-explicit-any: 0,  @typescript-eslint/no-unsafe-argument: 0, @typescript-eslint/no-unsafe-member-access: 0, @typescript-eslint/no-floating-promises: 0 */
  } catch (error: any) {
    setFailed(error.message);
  }
}

run();
