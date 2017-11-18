// https://www.npmjs.com/package/karma-webpack
// For many testcases this can result in many big files. The alterative configuration creates a single bundle with all testcases.
// 
// require all modules ending in ".spec" from the
// current directory and all subdirectories
var testsContext = require.context(".", true, /.spec.ts$/);
testsContext.keys().forEach(testsContext);