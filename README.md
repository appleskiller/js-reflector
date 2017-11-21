# reflector
Reflector for Typescript

## Build
```
$ webpack
```
## Test

### Using Mocha
```
$ npm test
```

### Using karma-sauceLabs-launcher
For run the tests across many browsers and platforms on Sauce Labs, you must make file 'karma.sauceLabs.json' in the project:
```json
{
	"testName": "your test name",
	"username": "your SauceLabs username",
	"accessKey": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```
The customLaunchers object configures individual browsers in file 'karma.conf.js', and the sauceLabs reporter allows your tests results to be properly displayed on https://saucelabs.com.

karma.conf.js
```javascript
var karma_sauceLabs = require("./karma.sauceLabs.json");

module.exports = function(config) {
	config.set({
		sauceLabs: karma_sauceLabs,
		customLaunchers: {
			sl_chrome: {
				base: 'SauceLabs',
				browserName: 'chrome',
				platform: 'Windows 7',
				version: '35'
			},
		},
		reporters: ['progress', 'saucelabs'],
		browsers: ['sl_chrome'],
	})
}
```

[all browser/platform combos](https://saucelabs.com/platforms)

[karma-sauce-launcher](https://www.npmjs.com/package/karma-sauce-launcher)
