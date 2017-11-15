import * as assert from "assert";
import * as reflector from "../src/reflector";
var metadata = reflector.metadata;
var util = reflector.util;

@metadata.className("metadata.spec.SampleClass")
@metadata.superClass(Object)
@metadata("customMetadata", "value")
class SampleClass {
	
}

describe("reflector.metadata - class", () => {
	describe("#metadata.className('metadata.spec.SampleClass')", () => {
		it("should className is metadata.spec.SampleClass", () => {
			assert.equal("metadata.spec.SampleClass", util.getClassName(SampleClass))
		})
	})
	describe("#metadata.superClass(Object)", () => {
		it("should superClass is Object", () => {
			assert.equal(Object, util.getSuperClass(SampleClass))
		})
		it("should superClass name is 'Object'", () => {
			assert.equal("Object", util.getSuperClassName(SampleClass))
		})
	})
	describe("#metadata('customMetadata', 'value')", () => {
		it("should customMetadata is value", () => {
			assert.equal("value", util.getClassSchema(SampleClass).customMetadata)
		})
	})
})