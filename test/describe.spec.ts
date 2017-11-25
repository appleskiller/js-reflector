import * as assert from "assert";
import * as reflector from "../src/index";
var metadata = reflector.metadata;
var util = reflector.util;

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
    functionValue: function () {},
    sampleValue: new SampleClass()
}

describe("reflector.util - describe a dynamic object", () => {
    var schema = util.describe(dynamicObject, true);
    var properties = schema.properties;
    it("should type of dynamicObject is 'Object'", () => {
        assert.strictEqual("Object", schema.type);
    })
    it("should type of stringValue is 'String'", () => {
        assert.strictEqual("String", properties.stringValue.type);
    })
    it("should type of numberValue is 'Number'", () => {
        assert.strictEqual("Number", properties.numberValue.type);
    })
    it("should type of booleanValue is 'Boolean'", () => {
        assert.strictEqual("Boolean", properties.booleanValue.type);
    })
    it("should type of dateValue is 'Date'", () => {
        assert.strictEqual("Date", properties.dateValue.type);
    })
    it("should type of undefinedValue is 'Undefined'", () => {
        assert.strictEqual("Undefined", properties.undefinedValue.type);
    })
    it("should type of nullValue is 'Null'", () => {
        assert.strictEqual("Null", properties.nullValue.type);
    })
    it("should type of NaNValue is 'Number'", () => {
        assert.strictEqual("Number", properties.NaNValue.type);
    })
    it("should type of arrayValue is 'Array'", () => {
        assert.strictEqual("Array", properties.arrayValue.type);
    })
    it("should type of objectValue is 'Object'", () => {
        assert.strictEqual("Object", properties.objectValue.type);
    })
    it("should type of functionValue is 'Function'", () => {
        assert.strictEqual("Function", properties.functionValue.type);
    })
    it("should type of sampleValue is 'descripbe.SampleClass'", () => {
        assert.strictEqual("descripbe.SampleClass", properties.sampleValue.type);
    })
    it("should value of sampleMeta metadata in sampleValue is 'value'", () => {
        assert.strictEqual("value", properties.sampleValue.sampleMeta);
    })
})