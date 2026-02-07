const fs = require('fs');

const escapeReplacements = new Map([
  ['|', '||'],
  ["'", "|'"],
  ['\n', '|n'],
  ['\r', '|r'],
  ['\u0085', '|x'], // TeamCity 6
  ['\u2028', '|l'], // TeamCity 6
  ['\u2029', '|p'], // TeamCity 6
  ['[', '|['],
  [']', '|]'],
]);

const escapePattern = new RegExp([...escapeReplacements.keys()].map((k) => k.replace(/[|[\]\\]/g, '\\$&')).join('|'), 'g');

/**
 * Attempt to load package.json within the current directory.
 * @returns {string} The string representation of package.json
 */
const loadPackageJson = () => {
  try {
    return fs.readFileSync('package.json', 'utf8');
  } catch (e) {
    console.warn('Unable to load config from package.json');
    // Return the string representation of an empty JSON object,
    // as it will be parsed outside of this method
    return '{}';
  }
};

/**
 * Escape special characters with the respective TeamCity escaping.
 * See below link for list of special characters:
 * https://confluence.jetbrains.com/display/TCD10/Build+Script+Interaction+with+TeamCity
 * @param {string} str The raw message to display in TeamCity build log.
 * @returns {string} An error message formatted for display in TeamCity
 */
const escapeTeamCityString = (str) => {
  if (!str) {
    return '';
  }

  return str.replace(escapePattern, (match) => escapeReplacements.get(match));
};

module.exports = { loadPackageJson, escapeTeamCityString };
