const path = require('path');
const fs = require('fs');
const { execSync, execFileSync } = require('child_process');
const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { error } = require('./helpers/eslint-factory');

const basePath = path.resolve(__dirname, '..');
const pathToTestJson = path.resolve(__dirname, 'result.json');
const pathToIndex = path.resolve(__dirname, '..', 'index.js');
const pathToEslint = path.resolve(__dirname, '..', 'node_modules', '.bin', 'eslint');

describe('smoke tests', function () {
  describe('support interface', function () {
    let esLintOutput = [];

    beforeEach(function () {
      esLintOutput.push(error);
    });

    afterEach(function () {
      esLintOutput = [];
    });

    describe('cmd', function () {
      it('as eslint formatter plugin', { timeout: 8000 }, function () {
        const result = execFileSync(pathToEslint, ['--format', pathToIndex, pathToIndex], {
          encoding: 'utf8',
          cwd: basePath,
        });
        assert.ok(result.includes('##teamcity'));
      });

      it('as standalone', function () {
        fs.writeFileSync(pathToTestJson, JSON.stringify(esLintOutput));
        try {
          const result = execFileSync('node', ['index.js', pathToTestJson], {
            encoding: 'utf8',
            cwd: basePath,
          });
          assert.ok(result.includes('##teamcity'));
        } finally {
          fs.unlinkSync(pathToTestJson);
        }
      });
    });

    describe('requirejs', function () {
      it('basic', function () {
        const result = require(pathToIndex)(esLintOutput);
        assert.ok(result.includes('##teamcity'));
      });

      it('with parameters', function () {
        const teamcityPropNames = {
          errorStatisticsName: 'EslintInspectionStatsE',
          warningStatisticsName: 'EslintInspectionStatsW',
        };

        const result = require(pathToIndex)(esLintOutput, teamcityPropNames);
        assert.ok(result.includes('ESLint Violations'));
        assert.ok(result.includes('EslintInspectionStatsE'));
        assert.ok(result.includes('EslintInspectionStatsW'));
      });
    });
  });
});
