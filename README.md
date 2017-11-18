# reflector
Reflector for Typescript


## Testing

### Using Mocha
```
$ npm test
```

### Using karma-sauceLabs-launcher
For run the tests across many browsers and platforms on Sauce Labs, you must make file 'karma.sauceLabs.json' in the project:
```
{
	"testName": "your test name",
	"username": "your SauceLabs username",
	"accessKey": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```
The customLaunchers object configures individual browsers in file 'karma.conf.js', and the sauceLabs reporter allows your tests results to be properly displayed on https://saucelabs.com

[all browser/platform combos](https://saucelabs.com/platforms)

[karma-sauce-launcher](https://www.npmjs.com/package/karma-sauce-launcher)
