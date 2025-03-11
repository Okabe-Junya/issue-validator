import * as utils from "./utils"
import { validateIssueTitleAndBody } from "./validate"

jest.mock("./utils")

describe("validateIssueTitleAndBody", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("returns true if only title_regex is set and title matches", async () => {
    // mock implementation of getIssueTitleAndBody
    const mockGetIssueTitleAndBody = jest.fn().mockReturnValue({
      title: "sample issue title",
      body: "sample issue body",
    })

    // mock implementation of getPullRequestTitleAndBody
    const mockGetPullRequestTitleAndBody = jest.fn().mockReturnValue({
      title: "sample pull request title",
      body: "sample pull request body",
    })

    const utils = require("./utils")
    utils.getIssueTitleAndBody = mockGetIssueTitleAndBody
    utils.getPullRequestTitleAndBody = mockGetPullRequestTitleAndBody

    // run the test
    // 'sample' という文字列が title に含まれているかどうか検証する
    const result = await validateIssueTitleAndBody("issue", 1, /sample/, null)
    expect(result).toBe(true)
    expect(mockGetIssueTitleAndBody).toHaveBeenCalledWith(1)
    expect(mockGetPullRequestTitleAndBody).not.toHaveBeenCalled()
  })

  it("returns true if only body_regex is set and body matches", async () => {
    // mock implementation of getIssueTitleAndBody
    const mockGetIssueTitleAndBody = jest.fn().mockReturnValue({
      title: "sample issue title",
      body: "sample issue body",
    })

    // mock implementation of getPullRequestTitleAndBody
    const mockGetPullRequestTitleAndBody = jest.fn().mockReturnValue({
      title: "sample pull request title",
      body: "sample pull request body",
    })

    const utils = require("./utils")
    utils.getIssueTitleAndBody = mockGetIssueTitleAndBody
    utils.getPullRequestTitleAndBody = mockGetPullRequestTitleAndBody

    // run the test
    // 'sample' という文字列が body に含まれているかどうか検証する
    const result = await validateIssueTitleAndBody("issue", 1, null, /sample/)
    expect(result).toBe(true)
    expect(mockGetIssueTitleAndBody).toHaveBeenCalledWith(1)
    expect(mockGetPullRequestTitleAndBody).not.toHaveBeenCalled()
  })

  it("returns true if both title_regex and body_regex are set and both match", async () => {
    // mock implementation of getIssueTitleAndBody
    const mockGetIssueTitleAndBody = jest.fn().mockReturnValue({
      title: "sample issue title",
      body: "sample issue body",
    })

    // mock implementation of getPullRequestTitleAndBody
    const mockGetPullRequestTitleAndBody = jest.fn().mockReturnValue({
      title: "sample pull request title",
      body: "sample pull request body",
    })

    const utils = require("./utils")
    utils.getIssueTitleAndBody = mockGetIssueTitleAndBody
    utils.getPullRequestTitleAndBody = mockGetPullRequestTitleAndBody

    // run the test
    // 'sample' という文字列が title と body に含まれているかどうか検証する
    const result = await validateIssueTitleAndBody(
      "issue",
      1,
      /sample/,
      /sample/,
    )
    expect(result).toBe(true)
    expect(mockGetIssueTitleAndBody).toHaveBeenCalledWith(1)
    expect(mockGetPullRequestTitleAndBody).not.toHaveBeenCalled()
  })

  describe("label validation", () => {
    beforeEach(() => {
      // Mock title and body responses for both issue and PR
      ;(utils.getIssueTitleAndBody as jest.Mock).mockResolvedValue({
        title: "Test Issue",
        body: "Test Body",
      })
      ;(utils.getPullRequestTitleAndBody as jest.Mock).mockResolvedValue({
        title: "Test PR",
        body: "Test Body",
      })
    })

    it("should pass when required labels are present", async () => {
      ;(utils.getIssueLabels as jest.Mock).mockResolvedValue(["bug", "enhancement"])
      const result = await validateIssueTitleAndBody("issue", 1, null, null, ["bug"], [])
      expect(result).toBe(true)
    })

    it("should fail when required labels are missing", async () => {
      ;(utils.getIssueLabels as jest.Mock).mockResolvedValue(["enhancement"])
      const result = await validateIssueTitleAndBody("issue", 1, null, null, ["bug"], [])
      expect(result).toBe(false)
    })

    it("should pass when no forbidden labels are present", async () => {
      ;(utils.getIssueLabels as jest.Mock).mockResolvedValue(["enhancement"])
      const result = await validateIssueTitleAndBody("issue", 1, null, null, [], ["bug"])
      expect(result).toBe(true)
    })

    it("should fail when forbidden labels are present", async () => {
      ;(utils.getIssueLabels as jest.Mock).mockResolvedValue(["bug", "enhancement"])
      const result = await validateIssueTitleAndBody("issue", 1, null, null, [], ["bug"])
      expect(result).toBe(false)
    })

    it("should handle pull request labels correctly", async () => {
      ;(utils.getPullRequestLabels as jest.Mock).mockResolvedValue(["feature", "ready"])
      const result = await validateIssueTitleAndBody(
        "pull_request",
        1,
        null,
        null,
        ["feature"],
        ["wip"]
      )
      expect(result).toBe(true)
    })
  })
})
