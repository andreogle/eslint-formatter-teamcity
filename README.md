# eslint-formatter-teamcity

[![NPM version](https://badge.fury.io/js/eslint-formatter-teamcity.svg)](https://www.npmjs.com/package/eslint-formatter-teamcity)
[![Build Status](https://github.com/andreogle/eslint-formatter-teamcity/actions/workflows/continuous-build.yml/badge.svg)](https://github.com/andreogle/eslint-formatter-teamcity/actions/workflows/continuous-build.yml)
[![Coverage Status](https://coveralls.io/repos/github/andreogle/eslint-formatter-teamcity/badge.svg?branch=main)](https://coveralls.io/github/andreogle/eslint-formatter-teamcity?branch=main)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-formatter-teamcity.svg)](https://npm-stat.com/charts.html?package=eslint-formatter-teamcity)

> A small [ESLint](https://github.com/eslint/eslint) formatter plugin.
ESLint violations are output nicely in the
[TeamCity](https://www.jetbrains.com/teamcity/) build error format. Tested with
TeamCity 9.1.x/10.0.x/2017+ and ESLint 1+

## Installation

```sh
npm install eslint-formatter-teamcity --save-dev
```

## Usage

There are 3 ways to use eslint-formatter-teamcity:

### 1. As a regular ESLint formatter plugin:

```sh
eslint --format teamcity myfiletolint.js
```

### 2. Running against a generated ESLint JSON report:

Generate an ESLint JSON report:

```sh
eslint -f json -o result.json app/myjavascriptdirectory
```

Run eslint-formatter-teamcity against your new report:

```sh
node ./node_modules/eslint-formatter-teamcity/index.js result.json
```

### 3. Importing and running directly from inside your JavaScript code:

```javascript
// ESM
import eslintTeamcity from 'eslint-formatter-teamcity';

// CommonJS
const eslintTeamcity = require('eslint-formatter-teamcity');

console.log(eslintTeamcity(eslintOutput));
```

## Configuration

There are two different formatters you can use to report with. They have no material
impact on the output - they're just different ways of viewing the same data. The "Code Inspection" tab will only
appear if you have configured eslint-formatter-teamcity to use the inspections reporter.

Errors (default)             |  Inspections
:-------------------------:|:-------------------------:
![Example Errors Report](https://i.imgur.com/3AzQeMy.png)  |  ![Example Inspections Report](https://i.imgur.com/JXzBuaV.png)

There are several ways that you can configure eslint-formatter-teamcity. **You don't have to configure anything by default**, you just have the option to if you would like.
Settings are looked for in the following priority:

### 1. As a second argument

If you run eslint-formatter-teamcity by importing it in JavaScript, you can pass a second argument to the function:

```js
import eslintTeamcity from 'eslint-formatter-teamcity';

const options = {
  reporter: 'inspections', // default: 'errors'
  reportName: 'My ESLint Violations', // default: 'ESLint Violations'
  errorStatisticsName: 'My ESLint Error Count', // default: 'ESLint Error Count'
  warningStatisticsName: 'My ESLint Warning Count', // default: 'ESLint Warning Count'
};
console.log(eslintTeamcity(eslintOutput, options));
```

### 2. From your package.json

If you have a package.json file in the **current directory**, you can add an extra "eslint-formatter-teamcity" property to it:

```json
...,
"eslint-formatter-teamcity": {
  "reporter": "inspections",
  "report-name": "My ESLint Violations",
  "error-statistics-name": "My ESLint Error Count",
  "warning-statistics-name": "My ESLint Warning Count"
},
...
```

### 3. ENV variables

```sh
export ESLINT_TEAMCITY_REPORTER=inspections
export ESLINT_TEAMCITY_REPORT_NAME="My Formatting Problems"
export ESLINT_TEAMCITY_ERROR_STATISTICS_NAME="My Error Count"
export ESLINT_TEAMCITY_WARNING_STATISTICS_NAME="My Warning Count"
```

You can also output your current settings to the log if you set:

```sh
export ESLINT_TEAMCITY_DISPLAY_CONFIG=true
```

## TeamCity Usage

The simplest way to run eslint-formatter-teamcity is from an NPM script in a build step. You could setup a script similar to this:

```json
"scripts": {
  "lint:teamcity": "eslint ./src --format teamcity"
}
```

Kick off a new build (by deploying again) and you should see your build errors - assuming you have any!

## Extras

eslint-formatter-teamcity will also output statistic values which you can use in TeamCity to track your progress in resolving errors!

Graphs can be setup from the Build -> Statistics tab.
![Example Statistics Output](http://i.imgur.com/oHbiuZE.png)

## Development

The quickest way to get a TeamCity server setup is to use [Docker](https://www.docker.com) and [ngrok](https://ngrok.com/):

1. Run ngrok

```sh
ngrok http 8111
```

2. Start TeamCity server and an agent

```sh
docker run -itd --name teamcity-server  \
    -v <path to data directory>:/data/teamcity_server/datadir \
    -v <path to logs directory>:/opt/teamcity/logs  \
    -p 8111:8111 \
    jetbrains/teamcity-server

docker run -itd --name teamcity-agent-1  \
    -e SERVER_URL="http://<ngrok id>.ngrok.io"  \
    -v <path to agent data>:/data/teamcity_agent/conf  \
    jetbrains/teamcity-agent
```

NOTE: You can't use `localhost` in SERVER_URL as it will refer to the container.

If you fork the repo and are testing on your local TeamCity instance, it may help to run `rm -rf node_modules` in a
build step as TeamCity seems to cache versions between commits.

## Issues

I will try keep this project up to date, but please log any issues
[here](https://github.com/andreogle/eslint-formatter-teamcity/issues).
Any pull requests are also welcome!
