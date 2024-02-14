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

### Outputs

| Output Name | Description           |
| ----------- | --------------------- |
| `result`    | Result of validation. |

### RegExp

If you want to use regular expressions, set `title-regex-flags` and `body-regex-flags` to `"true"`.

issue-validator uses the `RegExp` object to validate the title and body, so you can use the same syntax as the `RegExp` object.

document: [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)

## Example

When created a new issue/pr with the title starting with `SPAM`, the issue/pr will be closed automatically.

```yaml
name: issue validator
on:
  workflow_dispatch:
  issues:
    types: [opened, edited]

permissions:
  issues: write

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
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Thank you for considering contributing to this project.

When contributing to this repository, please first discuss the change you wish to make via issue before making a change.
