export function meta(name): any {
	return function () {
		console.log(name);
		console.log(arguments);
		console.log(typeof arguments[0]);

		if (arguments[1] === "data") {
			
		}
	}
}