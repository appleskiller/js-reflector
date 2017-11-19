import * as assert from "assert";
import * as reflector from "../src/reflector";
var metadata = reflector.metadata;
var util = reflector.util;

@metadata("meta", "value")
@metadata("baseMeta", "value")
class Base {

}
@metadata("baseMeta", "childValue")
@metadata.superClass(Base)
class Child extends Base {

}
@metadata("baseMeta", "FinalValue")
@metadata.superClass(Child)
class Final extends Child {

}

describe("declared metadata - class", () => {
	it("should 'meta' is 'value' from metadata of Base class ", () => {
		assert.strictEqual("value", util.getClassSchema(Base, true).meta);
	})
	it("should 'meta' is 'value' from metadata of Child class ", () => {
		assert.strictEqual("value", util.getClassSchema(Child, true).meta);
	})
	it("should 'meta' is 'value' from metadata of Final class ", () => {
		assert.strictEqual("value", util.getClassSchema(Final, true).meta);
	})
	it("should 'baseMeta' is 'value' from metadata of Base class ", () => {
		assert.strictEqual("value", util.getClassSchema(Base, true).baseMeta);
	})
})