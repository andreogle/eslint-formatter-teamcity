const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const formatInspections = require('../../src/formatters/inspections');
const { error, warning, fatalError, unknownError } = require('../helpers/eslint-factory');

describe('inspection formatting', function () {
  const reportConfig = {
    reportName: 'ESLint Violations',
    inspectionCountName: 'ESLintInspectionCount',
    errorStatisticsName: 'ESLintErrorCount',
    warningStatisticsName: 'ESLintWarningCount',
  };

  describe('unknown error output', function () {
    it('sets id and name to <none> if ruleId is null', function () {
      const results = [unknownError];
      const outputList = formatInspections(results, reportConfig);
      assert.strictEqual(
        outputList[0],
        "##teamcity[inspectionType id='<none>' category='ESLint Violations' name='<none>' description='ESLint Violations']"
      );
    });

    it('sets typeId to <none> if ruleId is null', function () {
      const results = [unknownError];
      const outputList = formatInspections(results, reportConfig);
      assert.strictEqual(
        outputList[1],
        "##teamcity[inspection typeId='<none>' message='line 1, col 1, Some unknown error' file='testfile-unknown.js' line='1' SEVERITY='ERROR']"
      );
    });
  });

  describe('fatal error output', function () {
    it('should include the inspection types', function () {
      const results = [fatalError];
      const outputList = formatInspections(results, reportConfig);
      assert.strictEqual(
        outputList[0],
        "##teamcity[inspectionType id='no-eval' category='ESLint Violations' name='no-eval' description='ESLint Violations']"
      );
    });

    it('should include the inspections', function () {
      const results = [fatalError];
      const outputList = formatInspections(results, reportConfig);
      assert.ok(
        outputList[1].includes(
          "##teamcity[inspection typeId='no-eval' message='line 1, col 1, Some fatal error' file='testfile-fatal.js' line='1' SEVERITY='ERROR']"
        )
      );
    });
  });

  describe('error output', function () {
    it('should include the inspection types', function () {
      const results = [error];
      const outputList = formatInspections(results, reportConfig);
      assert.strictEqual(
        outputList[0],
        "##teamcity[inspectionType id='no-console' category='ESLint Violations' name='no-console' description='ESLint Violations']"
      );
      assert.strictEqual(
        outputList[2],
        "##teamcity[inspectionType id='no-unreachable' category='ESLint Violations' name='no-unreachable' description='ESLint Violations']"
      );
    });

    it('should include the inspections', function () {
      const results = [error];
      const outputList = formatInspections(results, reportConfig);
      assert.strictEqual(
        outputList[1],
        "##teamcity[inspection typeId='no-console' message='line 1, col 1, |'|n|r|x|l|p|||[|]' file='testfile.js' line='1' SEVERITY='ERROR']"
      );
      assert.strictEqual(
        outputList[3],
        "##teamcity[inspection typeId='no-unreachable' message='line 2, col 1, This is a test error.' file='testfile.js' line='2' SEVERITY='ERROR']"
      );
    });
  });

  describe('output with directory paths', function () {
    it('should render slashes in the service messages', function () {
      const results = [{ ...fatalError, filePath: 'path\\with\\backslash\\file.js' }];
      const outputList = formatInspections(results, reportConfig);
      assert.strictEqual(
        outputList[1],
        "##teamcity[inspection typeId='no-eval' message='line 1, col 1, Some fatal error' file='path/with/backslash/file.js' line='1' SEVERITY='ERROR']"
      );
    });
  });

  describe('warning output', function () {
    it('should include the inspection types', function () {
      const results = [warning];
      const outputList = formatInspections(results, reportConfig);
      assert.strictEqual(
        outputList[0],
        "##teamcity[inspectionType id='eqeqeq' category='ESLint Violations' name='eqeqeq' description='ESLint Violations']"
      );
      assert.strictEqual(
        outputList[2],
        "##teamcity[inspectionType id='complexity' category='ESLint Violations' name='complexity' description='ESLint Violations']"
      );
    });

    it('should include the inspections', function () {
      const results = [warning];
      const outputList = formatInspections(results, reportConfig);
      assert.strictEqual(
        outputList[1],
        "##teamcity[inspection typeId='eqeqeq' message='line 1, col 1, Some warning' file='testfile-warning.js' line='1' SEVERITY='WARNING']"
      );
      assert.strictEqual(
        outputList[3],
        "##teamcity[inspection typeId='complexity' message='line 2, col 2, This is a test warning.' file='testfile-warning.js' line='2' SEVERITY='WARNING']"
      );
    });
  });

  describe('build statistics', function () {
    it('should contain total error count', function () {
      const results = [warning, error];
      const outputList = formatInspections(results, reportConfig);
      assert.strictEqual(
        outputList[8],
        "##teamcity[buildStatisticValue key='ESLintErrorCount' value='2']"
      );
    });

    it('should contain total warning count', function () {
      const results = [warning, error];
      const outputList = formatInspections(results, reportConfig);
      assert.strictEqual(
        outputList[9],
        "##teamcity[buildStatisticValue key='ESLintWarningCount' value='2']"
      );
    });
  });
});
