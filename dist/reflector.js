/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// -----------------------------------------------------------
// Utils
// ===========================================================
function isDefined(value) {
    return value !== null && value !== undefined;
}
function isClass(obj) {
    return typeof obj === "function";
}
function isObject(x) {
    return typeof x === "object" && x !== null;
}
function mixin(target, source) {
    for (var key in source) {
        target[key] = source[key];
    }
    return target;
}
var count = 0;
function uniqueId(prefex) {
    return prefex + "_" + (count++);
}
var _Map = /** @class */ (function () {
    function _Map() {
        this._keys = [];
        this._values = [];
        this._cacheKey = {};
        this._cacheIndex = -1;
    }
    _Map.prototype._find = function (key) {
        if (this._cacheKey === key)
            return this._cacheIndex;
        var ind = this._keys.indexOf(key);
        if (ind >= 0) {
            this._cacheKey = key;
            this._cacheIndex = ind;
        }
        return ind;
    };
    _Map.prototype.get = function (key) {
        var ind = this._find(key);
        return ind >= 0 ? this._values[ind] : undefined;
    };
    _Map.prototype.set = function (key, value) {
        var ind = this._find(key);
        if (ind >= 0) {
            this._values[ind] = value;
        }
        else {
            this._keys.push(key);
            this._values.push(value);
        }
        return this;
    };
    _Map.prototype.delete = function (key) {
        var ind = this._find(key);
        if (ind >= 0) {
            this._keys.splice(ind, 1);
            this._values.splice(ind, 1);
            this._cacheKey = {};
            this._cacheIndex = -1;
            return true;
        }
        return false;
    };
    return _Map;
}());
var NULLTYPE = "Null";
var UNDEFINEDTYPE = "Undefined";
var name2Class = {};
var class2Schema = new _Map();
var class2DeclaredSchema = new _Map();
// -----------------------------------------------------------
// Hooks
// ===========================================================
/**
 * 钩子类型。registerMetadataHook方法type参数的有效枚举
 * @type {IHookTypes}
 */
exports.hookTypes = {
    CLASS: "classHook",
    STATIC_PROPERTY: "staticPropertyHook",
    PROPERTY: "propertyHook",
};
var hooks = {
    classHook: {},
    staticPropertyHook: {},
    propertyHook: {}
};
/**
 * 注册元信息描述钩子函数。在为类附加描述信息时，处理器会顺序调用已注册的钩子函数，将最终的返回结果注册为元信息值。
 *
 * @export
 * @param {string} type 钩子类型。reflector.hookTypes声明了可选类型
 * @param {string} key 元信息键名
 * @param {((value: any, classObject: Function | IClass, oriValue: any) => any)} hook 钩子函数。value为上一个钩子函数的返回值，oriValue为未处理的初始值
 */
function registerMetadataHook(type, key, hook) {
    if (!hooks[type] || !key || !hook)
        throw new TypeError();
    var array = hooks[type][key] = hooks[type][key] || [];
    array.push(hook);
}
exports.registerMetadataHook = registerMetadataHook;
// -----------------------------------------------------------
// metadata
// ===========================================================
// 排除不必merge到属性描述上的class描述
var ignorePropertySchemaMergeKeys = {
    type: true,
    className: true,
    superClass: true,
    properties: true,
    staticProperties: true,
};
// 排除不必merge到对象描述上的class描述
var ignoreObjectSchemaMergeKeys = {
    className: true,
    superClass: true,
    properties: true,
    staticProperties: true,
};
/**
 * 将类信息合入属性描述
 *
 * @param {IPropertySchema} schema
 * @param {IClassSchema} classSchema
 * @returns {void}
 */
function mergeClassSchemaToPropertySchema(schema, classSchema) {
    if (!schema || !classSchema)
        return;
    for (var key in classSchema) {
        if (key in schema || ignorePropertySchemaMergeKeys[key]) {
            continue;
        }
        else {
            schema[key] = classSchema[key];
        }
    }
}
/**
 * 合并属性描述
 *
 * @param {IPropertySchema} schema
 * @param {IPropertySchema} superSchema
 * @returns {IPropertySchema}
 */
function mergePropertySchema(schema, superSchema) {
    var result = {};
    var key;
    if (schema) {
        // merge schema
        for (key in schema) {
            result[key] = schema[key];
        }
    }
    if (superSchema) {
        // merge superschema
        for (key in superSchema) {
            if (key in result) {
                continue;
            }
            else {
                result[key] = superSchema[key];
            }
        }
    }
    return result;
}
function mergeClassSchemaProperties(properties, superProperties) {
    var result = {};
    var propertyName;
    for (propertyName in properties) {
        result[propertyName] = properties[propertyName];
    }
    if (superProperties) {
        for (propertyName in superProperties) {
            result[propertyName] = mergePropertySchema(result[propertyName], superProperties[propertyName]);
        }
    }
    return result;
}
/**
 * 合并类描述信息
 *
 * @param {IClassSchema} schema
 * @param {IClassSchema} superSchema
 * @returns {IClassSchema}
 */
function mergeSchema(schema, superSchema) {
    var result = {};
    var key;
    for (key in schema) {
        result[key] = schema[key];
    }
    for (key in superSchema) {
        // merge properties
        if (key === "properties") {
            result[key] = mergeClassSchemaProperties(result[key], superSchema[key]);
        }
        else if (key === "staticProperties") {
            result[key] = mergeClassSchemaProperties(result[key], null);
        }
        else if (key in result) {
            continue;
        }
        else {
            result[key] = superSchema[key];
        }
    }
    return result;
}
/**
 * 创建null描述
 *
 * @param {string} propName
 * @param {IPropertySchema} propertySchema
 * @param {boolean} isStatic
 * @returns {IPropertySchema}
 */
function createNullValueSchema(propName, propertySchema, isStatic) {
    if (!propertySchema)
        return { name: propName, type: NULLTYPE, isMethod: false, isStatic: isStatic };
    var result = {};
    // merge schema
    for (var key in propertySchema) {
        result[key] = propertySchema[key];
    }
    result.type = propertySchema.type || NULLTYPE;
    result.isStatic = isStatic;
    return result;
}
/**
 * 创建undefined描述
 *
 * @param {string} propName
 * @param {IPropertySchema} propertySchema
 * @param {boolean} isStatic
 * @returns {IPropertySchema}
 */
function createUndefinedValueSchema(propName, propertySchema, isStatic) {
    if (!propertySchema)
        return { name: propName, type: UNDEFINEDTYPE, isMethod: false, isStatic: isStatic };
    var result = {};
    // merge schema
    for (var key in propertySchema) {
        result[key] = propertySchema[key];
    }
    result.type = propertySchema.type || UNDEFINEDTYPE;
    result.isStatic = isStatic;
    return result;
}
/**
 * 创建函数描述
 *
 * @param {string} propName
 * @param {IPropertySchema} propertySchema
 * @param {boolean} isStatic
 * @returns {IPropertySchema}
 */
function createFunctionValueSchema(propName, propertySchema, isStatic) {
    if (!propertySchema)
        return { name: propName, type: "Function", isMethod: false, isStatic: isStatic };
    var result = {};
    // merge schema
    for (var key in propertySchema) {
        result[key] = propertySchema[key];
    }
    result.type = propertySchema.type || "Function";
    result.isStatic = isStatic;
    return result;
}
/**
 * 创建对象属性描述。
 *
 * @param {*} value
 * @param {IPropertySchema} propertySchema
 * @returns {IPropertySchema}
 */
function createObjectPropertySchema(propName, value, propertySchema, isStatic) {
    if (value === null)
        return createNullValueSchema(propName, propertySchema, isStatic);
    else if (value === undefined)
        return createUndefinedValueSchema(propName, propertySchema, isStatic);
    else if (typeof value === "function")
        return createFunctionValueSchema(propName, propertySchema, isStatic);
    var result = {};
    var key;
    // merge schema
    if (propertySchema) {
        for (key in propertySchema) {
            result[key] = propertySchema[key];
        }
    }
    // merge metadata by classObject
    var classObject = value.constructor;
    var classSchema = getOrCreateDeclaredClassSchema(classObject);
    mergeClassSchemaToPropertySchema(result, classSchema);
    result.type = classSchema.className;
    result.isStatic = isStatic;
    return result;
}
/**
 * 创建对象类型描述
 *
 * @param {IClassSchema} schema
 * @returns {IObjectSchema}
 */
function createObjectSchema(schema) {
    var result = {
        type: schema.className,
        properties: {}
    };
    for (var key in schema) {
        if (ignoreObjectSchemaMergeKeys[key] || key in result) {
            continue;
        }
        result[key] = schema[key];
    }
    return result;
}
/**
 * 获取或创建类描述
 *
 * @param {(Function | IClass)} classObject
 * @returns {IClassSchema}
 */
function getOrCreateClassSchema(classObject) {
    var schema = class2Schema.get(classObject);
    if (!schema) {
        var className = uniqueId('unnamed_class');
        schema = {
            className: className,
            superClass: "Object",
            staticProperties: {},
            properties: {}
        };
        name2Class[className] = classObject;
        class2Schema.set(classObject, schema);
    }
    return schema;
}
/**
 * 获取或创建全部可枚举成员的类描述
 *
 * @param {(Function | IClass)} classObject
 * @returns {IClassSchema}
 */
function getOrCreateDeclaredClassSchema(classObject) {
    var declaredSchema = class2DeclaredSchema.get(classObject);
    if (!declaredSchema) {
        var schema = getOrCreateClassSchema(classObject);
        var superSchema = null;
        var superClass = name2Class[schema.superClass];
        if (superClass) {
            superSchema = getOrCreateDeclaredClassSchema(superClass);
        }
        declaredSchema = mergeSchema(schema, superSchema);
        var key, type, typeSchema;
        // static properties
        var staticProperties = declaredSchema.staticProperties;
        for (key in staticProperties) {
            type = staticProperties[key].type;
            if (type && name2Class[type]) {
                typeSchema = getOrCreateDeclaredClassSchema(name2Class[type]);
                mergeClassSchemaToPropertySchema(staticProperties[key], typeSchema);
            }
        }
        // properties
        var properties = declaredSchema.properties;
        for (key in properties) {
            type = properties[key].type;
            if (type && name2Class[type]) {
                typeSchema = getOrCreateDeclaredClassSchema(name2Class[type]);
                mergeClassSchemaToPropertySchema(properties[key], typeSchema);
            }
        }
        class2DeclaredSchema.set(classObject, declaredSchema);
    }
    return declaredSchema;
}
/**
 * 获取或创建属性描述
 *
 * @param {(Function | IClass)} classObject
 * @param {string} propName
 * @param {boolean} isMethod
 * @param {boolean} isStatic
 * @returns {IPropertySchema}
 */
function getOrCreatePropertySchema(classObject, propName, isMethod, isStatic) {
    var schema = getOrCreateClassSchema(classObject);
    var properties = isStatic ? schema.staticProperties : schema.properties;
    if (!properties[propName])
        properties[propName] = {
            name: propName,
            isStatic: isStatic,
            isMethod: isMethod,
        };
    return properties[propName];
}
/**
 * 获得制定对象的描述值。取值时依次调用钩子函数。
 *
 * @param {((value: any, classObject: Function | IClass, oriValue: any) => any[])} hookArray
 * @param {*} value
 * @param {(Function | IClass)} classObject
 * @returns {*}
 */
function getMetadataValue(hookArray, value, classObject) {
    if (!hookArray || !hookArray.length)
        return value;
    var oriValue = value;
    for (var i = 0; i < hookArray.length; i++) {
        hookArray[i] && (value = hookArray[i](value, classObject, oriValue));
    }
    return value;
}
/**
 * 类装饰器
 *
 * @param {string} key
 * @param {(Function | IClass)} classObject
 * @param {*} [value]
 */
function classDecorator(key, classObject, value) {
    var schema = getOrCreateClassSchema(classObject);
    schema[key] = getMetadataValue(hooks.classHook[key], value, classObject);
}
/**
 * 静态属性装饰器
 *
 * @param {string} key
 * @param {(Function | IClass)} classObject
 * @param {string} memberName
 * @param {boolean} isMethod
 * @param {*} [value]
 */
function staticPropertyDecorator(key, classObject, memberName, isMethod, value) {
    var schema = getOrCreatePropertySchema(classObject, memberName, isMethod, true);
    schema[key] = getMetadataValue(hooks.staticPropertyHook[key], value, classObject);
}
/**
 * 属性装饰器
 *
 * @param {string} key
 * @param {Object} classProto
 * @param {string} memberName
 * @param {boolean} isMethod
 * @param {*} [value]
 */
function propertyDecorator(key, classProto, memberName, isMethod, value) {
    var classObject = classProto.constructor;
    var schema = getOrCreatePropertySchema(classProto.constructor, memberName, isMethod, false);
    schema[key] = getMetadataValue(hooks.propertyHook[key], value, classObject);
}
exports.metadata = function (key, value) {
    function internalDecorator(target, targetKey, desc) {
        if (isClass(target)) {
            if (!targetKey) {
                classDecorator(key, target, value);
            }
            else {
                // 如果desc === undefined则认为是一个静态成员属性，否则为成员方法
                staticPropertyDecorator(key, target, targetKey, (desc !== undefined), value);
            }
        }
        else if (isDefined(targetKey) && isObject(target)) {
            // 如果desc === undefined则认为是一个成员属性，否则为成员方法
            propertyDecorator(key, target, targetKey, (desc !== undefined), value);
        }
        else {
            throw new TypeError();
        }
    }
    return internalDecorator;
};
mixin(exports.metadata, {
    // -----------------------------------------------------------
    // Common Class Schema metadata
    // ===========================================================
    className: function (value) {
        if (!value)
            throw ReferenceError();
        return exports.metadata("className", value);
    },
    superClass: function (value) {
        if (!value)
            throw ReferenceError();
        var className = isClass(value) ? exports.util.getClassName(value) : value;
        return exports.metadata("superClass", className);
    },
    // -----------------------------------------------------------
    // Common Property Schema metadata
    // ===========================================================
    type: function (value) {
        if (!value)
            throw ReferenceError();
        var className = isClass(value) ? exports.util.getClassName(value) : value;
        return exports.metadata("type", className);
    }
});
// -----------------------------------------------------------
// Internal Schema
// ===========================================================
function registerPrimitiveType(className, classObject) {
    name2Class[className] = classObject;
    var schema = getOrCreateClassSchema(classObject);
    schema.className = className;
    class2DeclaredSchema.set(classObject, mixin({}, schema));
}
registerPrimitiveType("Object", Object);
registerPrimitiveType("Array", Array);
registerPrimitiveType("Function", Function);
registerPrimitiveType("Date", Date);
registerPrimitiveType("Number", Number);
registerPrimitiveType("String", String);
registerPrimitiveType("Boolean", Boolean);
// -----------------------------------------------------------
// Util
// ===========================================================
// register className hook
registerMetadataHook(exports.hookTypes.CLASS, "className", function (value, classObject, oriValue) {
    name2Class[value] = classObject;
    return value;
});
exports.util = {
    getClass: function (obj) {
        if (isClass(obj))
            return obj;
        if (isDefined(obj))
            return obj.constructor;
        throw new ReferenceError();
    },
    getClassName: function (classObject) {
        return exports.util.getClassSchema(classObject).className;
    },
    getClassByName: function (className) {
        return name2Class[className];
    },
    getSuperClass: function (classObject) {
        var superClass = exports.util.getClassSchema(classObject).superClass;
        return exports.util.getClassByName(superClass);
    },
    getSuperClassName: function (classObject) {
        return exports.util.getClassSchema(classObject).superClass;
    },
    newInstance: function (className) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var classObject = exports.util.getClassByName(className);
        if (isClass(classObject)) {
            switch (args.length) {
                case 0: return new classObject();
                case 1: return new classObject(args[0]);
                case 2: return new classObject(args[0], args[1]);
                case 3: return new classObject(args[0], args[1], args[2]);
                case 4: return new classObject(args[0], args[1], args[2], args[3]);
                case 5: return new classObject(args[0], args[1], args[2], args[3], args[4]);
                case 6: return new classObject(args[0], args[1], args[2], args[3], args[4], args[5]);
                case 7: return new classObject(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
                case 8: return new classObject(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
            }
            throw new Error("Constructor parameter no more than 8.");
        }
        else {
            throw new Error("No Class was found by '" + className + "'");
        }
    },
    getClassSchema: function (classObject, declared) {
        return declared ? getOrCreateDeclaredClassSchema(classObject) : getOrCreateClassSchema(classObject);
    },
    describe: function (obj, allMembers) {
        if (obj === null)
            return { type: NULLTYPE, properties: {} };
        if (obj === undefined)
            return { type: UNDEFINEDTYPE, properties: {} };
        var isClassObject = isClass(obj);
        var classObject = isClassObject ? obj : obj.constructor;
        var classSchema = exports.util.getClassSchema(classObject, true);
        var result = createObjectSchema(classSchema);
        var propertiesSchema = isClassObject ? classSchema.staticProperties : classSchema.properties;
        // properties
        var value;
        for (var key in obj) {
            value = obj[key];
            if (allMembers || propertiesSchema[key]) {
                result.properties[key] = createObjectPropertySchema(key, value, propertiesSchema[key], isClassObject);
            }
        }
        return result;
    },
    describeProperty: function (obj, propertyName, value) {
        if (!isDefined(obj))
            throw new ReferenceError();
        var isClassObject = isClass(obj);
        var value = arguments.length === 3 ? value : obj[propertyName];
        var classObject = isClassObject ? obj : obj.constructor;
        var classSchema = exports.util.getClassSchema(classObject, true);
        var propertiesSchema = isClassObject ? classSchema.staticProperties : classSchema.properties;
        return createObjectPropertySchema(propertyName, value, propertiesSchema[propertyName], isClassObject);
    }
};


/***/ })
/******/ ]);
//# sourceMappingURL=reflector.js.map