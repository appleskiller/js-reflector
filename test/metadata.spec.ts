import * as assert from "assert";
import * as reflector from "../src/reflector";
var metadata = reflector.metadata;
var util = reflector.util;

@metadata.className("metadata.spec.SampleClass")
@metadata.superClass(Object)
@metadata("meta", "value")
class SampleClass {
}

class NoMetaClass {
}
@metadata.superClass(NoMetaClass)
class OtherClass extends NoMetaClass {
	@metadata("meta", "value")
	static staticProperty;
	
	@metadata("meta", "value")
	static staticMethod() { }
	@metadata("meta", "value")
	@metadata.type(SampleClass)
	prop: SampleClass;
	@metadata("meta", "value")
	method() { }
}

describe("reflector.metadata - class", () => {
	describe("#metadata.className('metadata.spec.SampleClass')", () => {
		it("should className is metadata.spec.SampleClass", () => {
			assert.strictEqual("metadata.spec.SampleClass", util.getClassName(SampleClass))
		})
	})
	describe("#metadata.superClass()", () => {
		it("should superClass of SampleClass is Object", () => {
			assert.strictEqual(Object, util.getSuperClass(SampleClass))
		})
		it("should superClass name of SampleClass is 'Object'", () => {
			assert.strictEqual("Object", util.getSuperClassName(SampleClass))
		})
		it("should superClass name of OtherClass is 'unnamed_class_x'", () => {
			assert.strictEqual(0, util.getSuperClassName(OtherClass).indexOf("unnamed_class"))
		})
	})
	describe("#metadata('meta', 'value')", () => {
		it("should meta is value", () => {
			assert.strictEqual("value", util.getClassSchema(SampleClass).meta)
		})
	})
})
describe("reflector.metadata - static member", () => {
	describe("#OtherClass.staticProperty", () => {
		it("should staticProperty is static property", () => {
			var schema = util.getClassSchema(OtherClass);
			assert.strictEqual(true, !!schema.staticProperties["staticProperty"]);
			assert.strictEqual("staticProperty", schema.staticProperties["staticProperty"].name);
			assert.strictEqual(undefined, schema.staticProperties["staticProperty"].type);
			assert.strictEqual(true, schema.staticProperties["staticProperty"].isStatic);
			assert.strictEqual(false, schema.staticProperties["staticProperty"].isMethod);
		})
	})
	describe("#OtherClass.staticMethod", () => {
		it("should staticMethod is static method", () => {
			var schema = util.getClassSchema(OtherClass);
			assert.strictEqual(true, !!schema.staticProperties["staticMethod"]);
			assert.strictEqual("staticMethod", schema.staticProperties["staticMethod"].name);
			assert.strictEqual(undefined, schema.staticProperties["staticMethod"].type);
			assert.strictEqual(true, schema.staticProperties["staticMethod"].isStatic);
			assert.strictEqual(true, schema.staticProperties["staticMethod"].isMethod);
		})
	})
})

describe("reflector.metadata - member", () => {
	describe("#OtherClass.prop", () => {
		it("should prop is property, and type is metadata.spec.SampleClass", () => {
			var schema = util.getClassSchema(OtherClass);
			assert.strictEqual(true, !!schema.properties["prop"]);
			assert.strictEqual("prop", schema.properties["prop"].name);
			assert.strictEqual("metadata.spec.SampleClass", schema.properties["prop"].type);
			assert.strictEqual(false, schema.properties["prop"].isStatic);
			assert.strictEqual(false, schema.properties["prop"].isMethod);
		})
	})
	describe("#OtherClass.method", () => {
		it("should method is method", () => {
			var schema = util.getClassSchema(OtherClass);
			assert.strictEqual(true, !!schema.properties["method"]);
			assert.strictEqual("method", schema.properties["method"].name);
			assert.strictEqual(undefined, schema.properties["method"].type);
			assert.strictEqual(false, schema.properties["method"].isStatic);
			assert.strictEqual(true, schema.properties["method"].isMethod);
		})
	})
})