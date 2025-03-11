# issue validator

![license](https://img.shields.io/github/license/Okabe-Junya/issue-validator) [![test](https://github.com/Okabe-Junya/issue-validator/actions/workflows/test.yml/badge.svg)](https://github.com/Okabe-Junya/issue-validator/actions/workflows/test.yml) [![eslint](https://github.com/Okabe-Junya/issue-validator/actions/workflows/reviewdog.yml/badge.svg)](https://github.com/Okabe-Junya/issue-validator/actions/workflows/reviewdog.yml) [![CodeQL](https://github.com/Okabe-Junya/issue-validator/actions/workflows/codeql.yml/badge.svg)](https://github.com/Okabe-Junya/issue-validator/actions/workflows/codeql.yml)

## About

This is a simple issue validator github action that checks if the issue/pr title and body are valid.

## Usage

### Inputs

| Input Name          | Description                                                                                                                                | Required | Default Value |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ------------- |
| `title`             | Title for the issue/pr.                                                                                                                    | No       | `''`          |
| `body`              | Body for the issue/pr.                                                                                                                     | No       | `''`          |
| `title-regex-flags` | Regex flags for title. Use regex by setting to `"true"`.                                                                                   | No       | `'false'`     |
| `body-regex-flags`  | Regex flags for body. Use regex by setting to `"true"`.                                                                                    | No       | `'false'`     |
| `issue-type`        | Validate for issue or pull request. Default is `"issue"`.                                                                                  | No       | `'issue'`     |
| `is-auto-close`     | Auto close issue if not meeting conditions.                                                                                                | No       | `'false'`     |
| `is-match`          | If set to `"true"`, the title and body must match the condition. If set to `"false"`, the title and body must **not** match the condition. | No       | `'true'`      |
| `github-token`      | GitHub token for authentication. Required for auto-closing issues.                                                                          | Yes      | N/A           |
| `required-labels`   | Comma-separated list of required labels. The issue/PR must have all these labels to pass validation.                                        | No       | `''`          |
| `forbidden-labels`  | Comma-separated list of forbidden labels. The issue/PR must not have any of these labels to pass validation.                                | No       | `''`          |

### Outputs

| Output Name | Description           |
| ----------- | --------------------- |
| `result`    | Result of validation. |

### RegExp

If you want to use regular expressions, set `title-regex-flags` and `body-regex-flags` to `"true"`.

issue-validator uses the `RegExp` object to validate the title and body, so you can use the same syntax as the `RegExp` object.

document: [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)

## Example

When created a new issue/pr with the title starting with `SPAM`, or with a `wip` label, the issue/pr will be closed automatically.

```yaml
name: issue validator
on:
  workflow_dispatch:
  issues:
    types: [opened, edited, labeled, unlabeled]
  pull_request:
    types: [opened, edited, labeled, unlabeled]

permissions:
  issues: write
  pull_requests: write

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: Okabe-Junya/issue-validator@latest
        with:
          title: '^SPAM'
          is-auto-close: 'true'
          issue-type: 'both'
          github-token: ${{ secrets.GITHUB_TOKEN }}
          forbidden-labels: 'wip'
```

### Label Validation

You can use `required-labels` and `forbidden-labels` to validate the labels on issues and pull requests. For example:

```yaml
- uses: Okabe-Junya/issue-validator@latest
  with:
    required-labels: 'bug,priority'  # Issue/PR must have both 'bug' and 'priority' labels
    forbidden-labels: 'wip,invalid'  # Issue/PR must not have 'wip' or 'invalid' labels
    is-auto-close: 'true'
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Thank you for considering contributing to this project.

When contributing to this repository, please first discuss the change you wish to make via issue before making a change.
