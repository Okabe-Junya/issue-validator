import { expect, jest } from "@jest/globals"
import { getIssueTitleAndBody, getPullRequestTitleAndBody } from "./utils"

describe("getIssueTitleAndBody", () => {
  it("returns title and body", async () => {
    // mock implementation of getInput
    const mockGetInput = jest.fn().mockReturnValue("github-token")
    // mock implementation of getOctokit
    const mockGetOctokit = jest.fn().mockReturnValue({
      rest: {
        issues: {
          get: jest.fn().mockReturnValue({
            data: {
              title: "sample issue title",
              body: "sample issue body",
            },
          }),
        },
      },
    })

    // mock implementation of context
    const mockContext = {
      repo: {
        owner: "sample owner",
        repo: "sample repo",
      },
    }

    // set mock implementations
    const core = require("@actions/core")
    const github = require("@actions/github")
    core.getInput = mockGetInput
    github.getOctokit = mockGetOctokit
    github.context = mockContext

    // run the test
    const mockIssueNumber = 1
    const { title, body } = await getIssueTitleAndBody(mockIssueNumber)

    // assert the results
    expect(title).toBe("sample issue title")
    expect(body).toBe("sample issue body")
    expect(mockGetInput).toHaveBeenCalledWith("github-token", {
      required: true,
    })
    expect(mockGetOctokit).toHaveBeenCalledWith("github-token")
  })
})

describe("getPullRequestTitleAndBody", () => {
  it("returns title and body", async () => {
    // mock implementation of getInput
    const mockGetInput = jest.fn().mockReturnValue("github-token")

    // mock implementation of getOctokit
    const mockGetOctokit = jest.fn().mockReturnValue({
      rest: {
        pulls: {
          get: jest.fn().mockReturnValue({
            data: {
              title: "sample pull request title",
              body: "sample pull request body",
            },
          }),
        },
      },
    })

    // mock implementation of context
    const mockContext = {
      repo: {
        owner: "sample owner",
        repo: "sample repo",
      },
    }

    // set mock implementations
    const core = require("@actions/core")
    const github = require("@actions/github")
    core.getInput = mockGetInput
    github.getOctokit = mockGetOctokit
    github.context = mockContext

    // run the test
    const mockPullNumber = 1
    const { title, body } = await getPullRequestTitleAndBody(mockPullNumber)

    // assert the results
    expect(title).toBe("sample pull request title")
    expect(body).toBe("sample pull request body")
    expect(mockGetInput).toHaveBeenCalledWith("github-token", {
      required: true,
    })
    expect(mockGetOctokit).toHaveBeenCalledWith("github-token")
  })
})
