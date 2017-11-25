import * as assert from "assert";
import * as reflector from "../src/index";
var metadata = reflector.metadata;
var util = reflector.util;

@metadata("will_be_inherited", "value")
@metadata("will_be_overwritten", "value")
@metadata.className("declaredMetadata.spec.Base")
class Base {
    @metadata("will_be_overwritten" , "value")
    prop;
    @metadata("will_be_inherited" , "value")
    otherProp;
}
@metadata("will_be_overwritten", "ChildValue")
@metadata.superClass(Base)
class Child extends Base {
    @metadata("will_be_overwritten" , "ChildValue")
    prop;
}
@metadata("will_be_overwritten", "FinalValue")
@metadata.superClass(Child)
class Final extends Child {
    @metadata("will_be_overwritten" , "FinalValue")
    prop;
}

class SampleClass {
    @metadata.type(Final)
    @metadata("will_be_overwritten" , "SampleValue")
    sampleProp: Final;
}

describe("declared metadata - class", () => {
    it("should className is 'declaredMetadata.spec.Base' in metadata of Base", () => {
        assert.strictEqual("declaredMetadata.spec.Base", util.getClassSchema(Base, true).className);
    })
    it("should className is not 'declaredMetadata.spec.Base' in metadata of Child", () => {
        assert.notStrictEqual("declaredMetadata.spec.Base", util.getClassSchema(Child, true).className);
    })
    it("should className is not 'declaredMetadata.spec.Base' in metadata of Final", () => {
        assert.notStrictEqual("declaredMetadata.spec.Base", util.getClassSchema(Final, true).className);
    })
    it("should 'will_be_inherited' is 'value' in metadata of Base", () => {
        assert.strictEqual("value", util.getClassSchema(Base, true).will_be_inherited);
    })
    it("should 'will_be_inherited' is 'value' in metadata of Child", () => {
        assert.strictEqual("value", util.getClassSchema(Child, true).will_be_inherited);
    })
    it("should 'will_be_inherited' is 'value' in metadata of Final", () => {
        assert.strictEqual("value", util.getClassSchema(Final, true).will_be_inherited);
    })
    it("should 'will_be_overwritten' is 'value' in metadata of Child", () => {
        assert.strictEqual("value", util.getClassSchema(Base, true).will_be_overwritten);
    })
    it("should 'will_be_overwritten' is 'value' in metadata of Final", () => {
        assert.strictEqual("ChildValue", util.getClassSchema(Child, true).will_be_overwritten);
    })
    it("should 'will_be_overwritten' is 'value' in metadata of Base", () => {
        assert.strictEqual("FinalValue", util.getClassSchema(Final, true).will_be_overwritten);
    })
})
describe("declared metadata - property", () => {
    it("should 'will_be_inherited' is 'value' in otherProp metadata of Base", () => {
        var properties = util.getClassSchema(Base, true).properties;
        assert.strictEqual("value", properties["otherProp"].will_be_inherited);
    })
    it("should 'will_be_inherited' is 'value' in otherProp metadata of Child", () => {
        var properties = util.getClassSchema(Child, true).properties;
        assert.strictEqual("value", properties["otherProp"].will_be_inherited);
    })
    it("should 'will_be_inherited' is 'value' in otherProp metadata of Final", () => {
        var properties = util.getClassSchema(Final, true).properties;
        assert.strictEqual("value", properties["otherProp"].will_be_inherited);
    })
    it("should 'will_be_overwritten' is 'value' in prop metadata of Child", () => {
        var properties = util.getClassSchema(Base, true).properties;
        assert.strictEqual("value", properties["prop"].will_be_overwritten);
    })
    it("should 'will_be_overwritten' is 'value' in prop metadata of Final", () => {
        var properties = util.getClassSchema(Child, true).properties;
        assert.strictEqual("ChildValue", properties["prop"].will_be_overwritten);
    })
    it("should 'will_be_overwritten' is 'value' in prop metadata of Base", () => {
        var properties = util.getClassSchema(Final, true).properties;
        assert.strictEqual("FinalValue", properties["prop"].will_be_overwritten);
    })
    it("should type is Final in prop metadata of SampleClass", () => {
        var properties = util.getClassSchema(SampleClass, true).properties;
        var className = util.getClassName(Final);
        assert.strictEqual(className, properties["sampleProp"].type);
    })
    it("should 'will_be_inherited' is 'value' in prop metadata of SampleClass", () => {
        var properties = util.getClassSchema(SampleClass, true).properties;
        assert.strictEqual("value", properties["sampleProp"].will_be_inherited);
    })
    it("should 'will_be_overwritten' is 'value' in prop metadata of SampleClass", () => {
        var properties = util.getClassSchema(SampleClass, true).properties;
        assert.strictEqual("SampleValue", properties["sampleProp"].will_be_overwritten);
    })
})