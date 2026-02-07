const { describe, it, beforeEach, afterEach, mock } = require('node:test');
const assert = require('node:assert/strict');
const { error } = require('./helpers/eslint-factory');
const utils = require('../src/utils/index');
const format = require('../src/formatter');

describe('formatter', function () {
  describe('config', function () {
    let eslintInput = [];

    beforeEach(function () {
      eslintInput.push(error);
    });

    afterEach(function () {
      eslintInput = [];
    });

    describe('prop names', function () {
      it('sets the reporter', function () {
        const output = format(eslintInput, { reporter: 'inspections' });
        assert.ok(
          output.includes(
            "##teamcity[inspectionType id='no-console' category='ESLint Violations' name='no-console' description='ESLint Violations']"
          )
        );
        assert.ok(
          output.includes(
            "##teamcity[inspection typeId='no-console' message='line 1, col 1, |'|n|r|x|l|p|||[|]' file='testfile.js' line='1' SEVERITY='ERROR']"
          )
        );
      });

      it('sets the report name', function () {
        const output = format(eslintInput, { reportName: 'prop report name' });
        assert.ok(output.includes("##teamcity[testSuiteStarted name='prop report name']"));
        assert.ok(output.includes("##teamcity[testSuiteFinished name='prop report name']"));
      });

      it('sets the error count name', function () {
        const output = format(eslintInput, { errorStatisticsName: 'prop errors' });
        assert.ok(output.includes("##teamcity[buildStatisticValue key='prop errors' value='2']"));
      });

      it('sets the warning count name', function () {
        const output = format(eslintInput, { warningStatisticsName: 'prop warnings' });
        assert.ok(
          output.includes("##teamcity[buildStatisticValue key='prop warnings' value='0']")
        );
      });
    });

    describe('package.json', function () {
      beforeEach(function () {
        const jsonConfig = JSON.stringify({
          'eslint-formatter-teamcity': {
            reporter: 'inspections',
            'report-name': 'package.json report',
            'error-statistics-name': 'package.json errors',
            'warning-statistics-name': 'package.json warnings',
          },
        });
        mock.method(utils, 'loadPackageJson', () => jsonConfig);
      });

      afterEach(function () {
        mock.restoreAll();
      });

      it('sets the report type', function () {
        const output = format(eslintInput);
        assert.ok(
          output.includes(
            "##teamcity[inspection typeId='no-console' message='line 1, col 1, |'|n|r|x|l|p|||[|]' file='testfile.js' line='1' SEVERITY='ERROR']"
          )
        );
      });

      it('sets the report name', function () {
        const output = format(eslintInput);
        assert.ok(
          output.includes(
            "##teamcity[inspectionType id='no-console' category='package.json report' name='no-console' description='package.json report']"
          )
        );
      });

      it('sets the error count name', function () {
        const output = format(eslintInput);
        assert.ok(
          output.includes(
            "##teamcity[buildStatisticValue key='package.json errors' value='2']"
          )
        );
      });

      it('sets the warning count name', function () {
        const output = format(eslintInput);
        assert.ok(
          output.includes(
            "##teamcity[buildStatisticValue key='package.json warnings' value='0']"
          )
        );
      });
    });

    describe('process.env', function () {
      function cleanup() {
        delete process.env.ESLINT_TEAMCITY_REPORTER;
        delete process.env.ESLINT_TEAMCITY_REPORT_NAME;
        delete process.env.ESLINT_TEAMCITY_ERROR_STATISTICS_NAME;
        delete process.env.ESLINT_TEAMCITY_WARNING_STATISTICS_NAME;
      }

      beforeEach(() => cleanup());
      afterEach(() => cleanup());

      it('sets the report type', function () {
        process.env.ESLINT_TEAMCITY_REPORTER = 'inspections';
        const output = format(eslintInput);
        assert.ok(
          output.includes(
            "##teamcity[inspection typeId='no-console' message='line 1, col 1, |'|n|r|x|l|p|||[|]' file='testfile.js' line='1' SEVERITY='ERROR']"
          )
        );
      });

      it('sets the report name', function () {
        process.env.ESLINT_TEAMCITY_REPORT_NAME = 'process.env report';
        const output = format(eslintInput);
        assert.ok(output.includes("##teamcity[testSuiteStarted name='process.env report']"));
        assert.ok(output.includes("##teamcity[testSuiteFinished name='process.env report']"));
      });

      it('sets the error count name', function () {
        process.env.ESLINT_TEAMCITY_ERROR_STATISTICS_NAME = 'process.env errors';
        const output = format(eslintInput);
        assert.ok(
          output.includes(
            "##teamcity[buildStatisticValue key='process.env errors' value='2']"
          )
        );
      });

      it('sets the warning count name', function () {
        process.env.ESLINT_TEAMCITY_WARNING_STATISTICS_NAME = 'process.env warnings';
        const output = format(eslintInput);
        assert.ok(
          output.includes(
            "##teamcity[buildStatisticValue key='process.env warnings' value='0']"
          )
        );
      });
    });

    describe('defaults', function () {
      it('uses the error reporter', function () {
        const output = format(eslintInput);
        assert.ok(output.includes("##teamcity[testSuiteStarted name='ESLint Violations']"));
      });

      it('sets the report name', function () {
        const output = format(eslintInput);
        assert.ok(output.includes("##teamcity[testSuiteStarted name='ESLint Violations']"));
        assert.ok(output.includes("##teamcity[testSuiteFinished name='ESLint Violations']"));
      });

      it('sets the error count name', () => {
        const output = format(eslintInput);
        assert.ok(
          output.includes(
            "##teamcity[buildStatisticValue key='ESLint Error Count' value='2']"
          )
        );
      });

      it('sets the warning count name', function () {
        const output = format(eslintInput);
        assert.ok(
          output.includes(
            "##teamcity[buildStatisticValue key='ESLint Warning Count' value='0']"
          )
        );
      });
    });
  });
});
