import {meta} from "./dec";
import {metadata, util} from "./reflector";

class base {

}
@meta("class")
@meta("class1")
@meta("class2")
class ClassExample extends base{
	constructor(parameters) {
		super();
	}
	@meta("private prop")
	private data: Date = new Date();
	@meta("public prop")
	public ccc = "";
	@meta("static prop")
	static ddd = "";
	@meta("static func")
	static func() {
		
	}
	@meta("static f")
	static f = function () {};
	@meta("ff")
	ff = function () {};
	@meta("method")
	method(aaa: number): string {
		return "";
	}
}