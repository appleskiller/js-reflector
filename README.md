# js-reflector
js-reflector for Typescript

> An engineer built an airplane, and he recorded its structure.
>
> A pilot comes, starts the motor, flies to the sky.

# Why is Reflection

- First-Class-Value
- Know more at runtime
- Useful for increasing the flexibility

# Get started

### Give a definite name to the class
```javascript
import { metadata, util } from "js-reflector";

@metadata.className("namespace.BaseClass")
class BaseClass {

}

@metadata.className("namespace.SampleClass")
@metadata.superClass(BaseClass)
class SampleClass extends BaseClass {
    constructor(id: string) {
        this.id = id;
    }
    id: string;
}

console.log(util.getClassName(SampleClass));
// namespace.SampleClass
console.log(util.getClassByName('namespace.SampleClass'));
// [Function: SampleClass]
console.log(util.newInstance('namespace.SampleClass', "xxxxxxx").id);
// xxxxxxx
console.log(util.getSuperClass('namespace.SampleClass'));
// [Function: BaseClass]
console.log(util.getSuperClassName(SampleClass));
// namespace.BaseClass
```

### Add more metadata
```javascript
import { metadata, util } from "js-reflector";

@metadata('description', 'This is a SampleClass')
class SampleClass {

}

console.log(util.getClassSchema(SampleClass).description);
// This is a SampleClass
```

### Class metadata schema
```javascript
import { metadata, util } from "js-reflector";

@metadata.className("namespace.BaseClass")
class BaseClass {

}

@metadata.className("namespace.SampleClass")
@metadata.superClass(BaseClass)
class SampleClass {
    @metadata('meta', 'value')
    static staticSampleProperty: string;
    @metadata('meta', 'value')
    static staticSampleMethod() { }
    @metadata('meta', 'value')
    sampleProperty: string;
    @metadata('meta', 'value')
    sampleMethod() { }
}
console.log(util.getClassSchema(SampleClass));
// {
//     className: "namespace.SampleClass",
//     superClass: "namespace.BaseClass",
//     staticProperties: {
//         staticSampleProperty: {
//             name: "staticSampleProperty",
//             meta: "value"
//         },
//         staticSampleMethod: {
//             name: "staticSampleMethod",
//             isMethod: true,
//             meta: "value"
//         }
//     },
//     properties: {
//         sampleProperty: {
//             name: "sampleProperty",
//             meta: "value"
//         },
//         sampleMethod: {
//             name: "sampleMethod",
//             isMethod: true,
//             meta: "value"
//         }
//     }
// }
```

### Declared metadata
```javascript
@metadata("meta", "value")
@metadata.className("namespace.Base")
class Base {

}

@metadata.superClass(Base)
@metadata.className("namespace.Child")
class Child extends Base {

}

console.log(util.getClassSchema(Child));
// {
//     className: "namespace.Child",
//     superClass: "namespace.Base",
//     staticProperties: {},
//     properties: {}
// }
console.log(util.getClassSchema(Child, true));
// {
//     className: "namespace.Child",
//     superClass: "namespace.Base",
//     meta: "value",
//     staticProperties: {},
//     properties: {}
// }
```

### Inheritable & Mergeable metadata
```javascript
@metadata("will_be_inherited", "value")
@metadata("will_be_overwritten", "value")
class Base {
    @metadata("will_be_inherited", "value")
    @metadata("will_be_overwritten" , "value")
    prop;
}
@metadata("will_be_overwritten", "ChildValue")
@metadata.superClass(Base)
class Child extends Base {
    @metadata("will_be_overwritten" , "ChildValue")
    prop;
}
console.log(util.getClassSchema(Child, true).will_be_inherited);
// value
console.log(util.getClassSchema(Child, true).will_be_overwritten);
// ChildValue
console.log(util.getClassSchema(Child, true).properties['prop'].will_be_inherited);
// value
console.log(util.getClassSchema(Child, true).properties['prop'].will_be_overwritten);
// ChildValue
```

### Dynamic object reflection
```javascript
@metadata("sampleMeta", "value")
@metadata.className("descripbe.SampleClass")
class SampleClass {
    
}
var dynamicObject = {
    stringValue: "text",
    numberValue: 1,
    booleanValue: true,
    dateValue: new Date(),
    undefinedValue: undefined,
    nullValue: null,
    NaNValue: NaN,
    arrayValue: [],
    objectValue: {},
    functionValue: function () { },
    sampleValue: new SampleClass()
}
console.log(util.describe(dynamicObject, true));
// {
//     "type": "Object",
//     "properties": {
//         "stringValue": {
//             "name": "stringValue",
//             "type": "String"
//         },
//         "numberValue": {
//             "name": "numberValue",
//             "type": "Number"
//         },
//         "booleanValue": {
//             "name": "booleanValue",
//             "type": "Boolean"
//         },
//         "dateValue": {
//             "name": "dateValue",
//             "type": "Date"
//         },
//         "undefinedValue": {
//             "name": "undefinedValue",
//             "type": "Undefined"
//         },
//         "nullValue": {
//             "name": "nullValue",
//             "type": "Null"
//         },
//         "NaNValue": {
//             "name": "NaNValue",
//             "type": "Number"
//         },
//         "arrayValue": {
//             "name": "arrayValue",
//             "type": "Array"
//         },
//         "objectValue": {
//             "name": "objectValue",
//             "type": "Object"
//         },
//         "functionValue": {
//             "name": "functionValue",
//             "type": "Function"
//         },
//         "sampleValue": {
//             "sampleMeta": "value",
//             "name": "sampleValue",
//             "type": "descripbe.SampleClass"
//         }
//     }
// }
```

# Build
```
$ npm build
```
# Test

```
$ npm test
```

# Using in your Typescript project

You need set below options in tsconfig.json file:

```json
{
    "compilerOptions": {
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true
    }
}
```

# More practices

**This lib is very useful reflecting at runtime. However, [typescript-json-schema](https://github.com/YousefED/typescript-json-schema) is the best choice, if you need to generate fully and statically class schema.**

<!-- ## Using karma-sauceLabs-launcher
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

[karma-sauce-launcher](https://www.npmjs.com/package/karma-sauce-launcher) -->
