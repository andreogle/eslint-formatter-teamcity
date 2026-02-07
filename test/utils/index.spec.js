const fs = require('fs');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const utils = require('../../src/utils');

describe('utils', function () {
  describe('loadPackageJson', () => {
    describe('success', function () {
      it('returns a string representation of package.json', function (t) {
        t.mock.method(fs, 'readFileSync', () => 'package.json contents');
        assert.strictEqual(utils.loadPackageJson(), 'package.json contents');
      });
    });

    describe('failure', function () {
      it('returns an empty object representation', function (t) {
        t.mock.method(fs, 'readFileSync', () => {
          throw new Error('ENOENT');
        });
        assert.strictEqual(utils.loadPackageJson(), '{}');
      });
    });
  });

  describe('escapeTeamCityString', function () {
    it('returns empty strings', function () {
      assert.strictEqual(utils.escapeTeamCityString(null), '');
    });

    it('replaces TeamCity special characters', function () {
      assert.strictEqual(
        utils.escapeTeamCityString("'\n\r\u0085\u2028\u2029|[]"),
        "|'|n|r|x|l|p|||[|]"
      );
    });
  });
});
