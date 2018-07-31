const fs = require('fs');
const path = require('path');
const { EXTS, EXT_PATTERN } = require('./constants');

// package: run in root
// workspaces: run in root
module.exports = function jest(args, tool) {
  const workspacesEnabled = !!tool.package.workspaces;
  const setupFiles = [];
  const roots = [];
  const testRoot = args['test-dir'] || 'test';

  if (workspacesEnabled) {
    roots.push('<rootDir>/packages');
  } else {
    roots.push('<rootDir>/src', `<rootDir>/${testRoot}`);
  }

  const setupFilePath = path.join(process.cwd(), args.setup || `./${testRoot}/setup.js`);
  if (fs.existsSync(setupFilePath)) {
    setupFiles.push(setupFilePath);
  }
  if (args.react) {
    setupFiles.push(path.join(__dirname, './jest/enzyme.js'));
  }

  return {
    coverageDirectory: './coverage',
    coveragePathIgnorePatterns: ['/node_modules/', '/esm/', '/lib/', '/build/'],
    coverageReporters: ['lcov'],
    globals: {
      __DEV__: true,
    },
    moduleFileExtensions: EXTS.map(ext => ext.slice(1)), // no period
    roots,
    setupFiles,
    snapshotSerializers: ['enzyme-to-json/serializer'],
    testMatch: [`**/?(*.)+(spec|test).${EXT_PATTERN}`],
    testURL: 'http://localhost/',
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    verbose: !!args.verbose,
    // @TODO support coverage thresholds
  };
};
