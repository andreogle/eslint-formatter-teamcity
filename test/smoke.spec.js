const path = require('path');
const { expect } = require('chai');
const sh = require('shelljs');
const fs = require('fs-extra');
const { error } = require('./helpers/eslint-factory');

const basePath = path.resolve(__dirname, '..');
const pathToTestJson = path.resolve(__dirname, 'result.json');
const pathToIndex = path.resolve(__dirname, '..', 'index.js');

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
      it('as eslint formatter plugin', function () {
        this.timeout(8000);
        const result = sh.exec(`eslint --format '${pathToIndex}' ${pathToIndex}`);
        expect(result.stdout).to.contain('##teamcity');
      });

      it('as standalone', function () {
        fs.writeJSONSync(pathToTestJson, esLintOutput);
        const result = sh.exec(`cd ${basePath}; node index.js ${pathToTestJson}`);
        expect(result.stdout).to.contain('##teamcity');
        expect(result.stderr).to.equal('');

        sh.rm(pathToTestJson);
      });
    });

    describe('requirejs', function () {
      it('basic', function () {
        const result = require(pathToIndex)(esLintOutput);
        expect(result).to.contain('##teamcity');
      });

      it('with parameters', function () {
        const teamcityPropNames = {
          errorStatisticsName: 'EslintInspectionStatsE',
          warningStatisticsName: 'EslintInspectionStatsW',
        };

        const result = require(pathToIndex)(esLintOutput, teamcityPropNames);
        expect(result).to.contain('ESLint Violations');
        expect(result).to.contain('EslintInspectionStatsE');
        expect(result).to.contain('EslintInspectionStatsW');
      });
    });
  });
});
