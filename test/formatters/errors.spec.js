const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const formatErrors = require('../../src/formatters/errors');
const { error, warning, fatalError, unknownError } = require('../helpers/eslint-factory');

describe('error formatting', function () {
  const reportConfig = {
    reportName: 'ESLint Violations',
    errorStatisticsName: 'ESLintErrorCount',
    warningStatisticsName: 'ESLintWarningCount',
  };

  describe('test suite name', function () {
    it('should include the test suite name header', function () {
      assert.strictEqual(
        formatErrors([], reportConfig)[0],
        "##teamcity[testSuiteStarted name='ESLint Violations']"
      );
    });

    it('should include the test suite name footer', function () {
      assert.strictEqual(
        formatErrors([], reportConfig)[1],
        "##teamcity[testSuiteFinished name='ESLint Violations']"
      );
    });
  });

  describe('unknown error output', function () {
    it('omits the ruleId if it is null', function () {
      const results = [unknownError];
      assert.strictEqual(
        formatErrors(results, reportConfig)[1],
        "##teamcity[testStarted name='ESLint Violations: testfile-unknown.js']"
      );
      assert.strictEqual(
        formatErrors(results, reportConfig)[2],
        "##teamcity[testFailed name='ESLint Violations: testfile-unknown.js' message='line 1, col 1, Some unknown error']"
      );
    });
  });

  describe('fatal error output', function () {
    it('should include filename at the start of each file test', function () {
      const results = [fatalError];
      assert.strictEqual(
        formatErrors(results, reportConfig)[1],
        "##teamcity[testStarted name='ESLint Violations: testfile-fatal.js']"
      );
    });

    it('should include all errors within their respective file', function () {
      const results = [fatalError];
      assert.strictEqual(
        formatErrors(results, reportConfig)[2],
        "##teamcity[testFailed name='ESLint Violations: testfile-fatal.js' message='line 1, col 1, Some fatal error (no-eval)']"
      );
    });

    it('should include filename at the end of each file test', function () {
      const results = [fatalError];
      assert.strictEqual(
        formatErrors(results, reportConfig)[3],
        "##teamcity[testFinished name='ESLint Violations: testfile-fatal.js']"
      );
    });
  });

  describe('error output', function () {
    it('should include filename at the start of each file test', function () {
      const results = [error];
      assert.strictEqual(
        formatErrors(results, reportConfig)[1],
        "##teamcity[testStarted name='ESLint Violations: testfile.js']"
      );
    });

    it('should include all errors within their respective file', function () {
      const results = [error];
      assert.strictEqual(
        formatErrors(results, reportConfig)[2],
        "##teamcity[testFailed name='ESLint Violations: testfile.js' message='line 1, col 1, |'|n|r|x|l|p|||[|] (no-console)|nline 2, col 1, This is a test error. (no-unreachable)']"
      );
    });

    it('should include filename at the end of each file test', function () {
      const results = [error];
      assert.strictEqual(
        formatErrors(results, reportConfig)[3],
        "##teamcity[testFinished name='ESLint Violations: testfile.js']"
      );
    });
  });

  describe('output with directory paths', function () {
    it('should render slashes in the service messages', function () {
      const results = [{ ...fatalError, filePath: 'path\\with\\backslash\\file.js' }];
      const outputList = formatErrors(results, reportConfig);
      assert.strictEqual(
        outputList[1],
        "##teamcity[testStarted name='ESLint Violations: path/with/backslash/file.js']"
      );
      assert.strictEqual(
        outputList[2],
        "##teamcity[testFailed name='ESLint Violations: path/with/backslash/file.js' message='line 1, col 1, Some fatal error (no-eval)']"
      );
    });
  });

  describe('warning output', function () {
    it('should include filename at the start of each file test', function () {
      const results = [warning];
      assert.strictEqual(
        formatErrors(results, reportConfig)[1],
        "##teamcity[testStarted name='ESLint Violations: testfile-warning.js']"
      );
    });

    it('should include all warnings within their respective file', function () {
      const results = [warning];
      assert.strictEqual(
        formatErrors(results, reportConfig)[2],
        "##teamcity[testStdOut name='ESLint Violations: testfile-warning.js' out='warning: line 1, col 1, Some warning (eqeqeq)|nline 2, col 2, This is a test warning. (complexity)']"
      );
    });

    it('should include filename at the end of each file test', function () {
      const results = [warning];
      assert.strictEqual(
        formatErrors(results, reportConfig)[3],
        "##teamcity[testFinished name='ESLint Violations: testfile-warning.js']"
      );
    });
  });

  describe('build statistics', function () {
    it('should contain total error count', function () {
      const results = [warning, error];
      assert.strictEqual(
        formatErrors(results, reportConfig)[8],
        "##teamcity[buildStatisticValue key='ESLintErrorCount' value='2']"
      );
    });

    it('should contain total warning count', function () {
      const results = [warning, error];
      assert.strictEqual(
        formatErrors(results, reportConfig)[9],
        "##teamcity[buildStatisticValue key='ESLintWarningCount' value='2']"
      );
    });
  });
});
