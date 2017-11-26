/**
  * js-reflector v1.0.1
  * (c) 2017-2017 Appleskiller
  * @license MIT
  */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

Object.defineProperty(exports, "__esModule", { value: true });
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
function isMethodDesc(desc) {
    return !!desc && typeof desc.get !== "function" && typeof desc.set !== "function";
}
var count = 0;
function uniqueId(prefex) {
    return prefex + "_" + (count++);
}
var _Map = (function () {
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
function registerMetadataHook(type, key, hook) {
    if (!hooks[type] || !key || !hook)
        throw new TypeError();
    var array = hooks[type][key] = hooks[type][key] || [];
    array.push(hook);
}
exports.registerMetadataHook = registerMetadataHook;
var ignorePropertySchemaMergeKeys = {
    type: true,
    className: true,
    superClass: true,
    properties: true,
    staticProperties: true,
};
var ignoreObjectSchemaMergeKeys = {
    className: true,
    superClass: true,
    properties: true,
    staticProperties: true,
};
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
function mergePropertySchema(schema, superSchema) {
    var result = {};
    var key;
    if (schema) {
        for (key in schema) {
            result[key] = schema[key];
        }
    }
    if (superSchema) {
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
function mergeSchema(schema, superSchema) {
    var result = {};
    var key;
    for (key in schema) {
        result[key] = schema[key];
    }
    for (key in superSchema) {
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
function createNullValueSchema(propName, propertySchema, isStatic) {
    if (!propertySchema)
        return { name: propName, type: NULLTYPE, isMethod: false, isStatic: isStatic };
    var result = {};
    for (var key in propertySchema) {
        result[key] = propertySchema[key];
    }
    result.name = propName;
    result.isMethod = !!(propertySchema && propertySchema.isMethod);
    result.type = propertySchema.type || NULLTYPE;
    result.isStatic = isStatic;
    return result;
}
function createUndefinedValueSchema(propName, propertySchema, isStatic) {
    if (!propertySchema)
        return { name: propName, type: UNDEFINEDTYPE, isMethod: false, isStatic: isStatic };
    var result = {};
    for (var key in propertySchema) {
        result[key] = propertySchema[key];
    }
    result.name = propName;
    result.isMethod = !!(propertySchema && propertySchema.isMethod);
    result.type = propertySchema.type || UNDEFINEDTYPE;
    result.isStatic = isStatic;
    return result;
}
function createFunctionValueSchema(propName, propertySchema, isStatic) {
    if (!propertySchema)
        return { name: propName, type: "Function", isMethod: false, isStatic: isStatic };
    var result = {};
    for (var key in propertySchema) {
        result[key] = propertySchema[key];
    }
    result.name = propName;
    result.isMethod = !!(propertySchema && propertySchema.isMethod);
    result.type = propertySchema.type || "Function";
    result.isStatic = isStatic;
    return result;
}
function createObjectPropertySchema(propName, value, propertySchema, isStatic) {
    if (value === null)
        return createNullValueSchema(propName, propertySchema, isStatic);
    else if (value === undefined)
        return createUndefinedValueSchema(propName, propertySchema, isStatic);
    else if (typeof value === "function")
        return createFunctionValueSchema(propName, propertySchema, isStatic);
    var result = {};
    var key;
    if (propertySchema) {
        for (key in propertySchema) {
            result[key] = propertySchema[key];
        }
    }
    var classObject = value.constructor;
    var classSchema = getOrCreateDeclaredClassSchema(classObject);
    mergeClassSchemaToPropertySchema(result, classSchema);
    result.name = propName;
    result.isMethod = !!(propertySchema && propertySchema.isMethod);
    result.type = classSchema.className;
    result.isStatic = isStatic;
    return result;
}
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
        var staticProperties = declaredSchema.staticProperties;
        for (key in staticProperties) {
            type = staticProperties[key].type;
            if (type && name2Class[type]) {
                typeSchema = getOrCreateDeclaredClassSchema(name2Class[type]);
                mergeClassSchemaToPropertySchema(staticProperties[key], typeSchema);
            }
        }
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
function getMetadataValue(hookArray, value, classObject) {
    if (!hookArray || !hookArray.length)
        return value;
    var oriValue = value;
    for (var i = 0; i < hookArray.length; i++) {
        hookArray[i] && (value = hookArray[i](value, classObject, oriValue));
    }
    return value;
}
function classDecorator(key, classObject, value) {
    var schema = getOrCreateClassSchema(classObject);
    schema[key] = getMetadataValue(hooks.classHook[key], value, classObject);
}
function staticPropertyDecorator(key, classObject, memberName, isMethod, value) {
    var schema = getOrCreatePropertySchema(classObject, memberName, isMethod, true);
    schema[key] = getMetadataValue(hooks.staticPropertyHook[key], value, classObject);
}
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
                staticPropertyDecorator(key, target, targetKey, isMethodDesc(desc), value);
            }
        }
        else if (isDefined(targetKey) && isObject(target)) {
            propertyDecorator(key, target, targetKey, isMethodDesc(desc), value);
        }
        else {
            throw new TypeError();
        }
    }
    return internalDecorator;
};
mixin(exports.metadata, {
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
    type: function (value) {
        if (!value)
            throw ReferenceError();
        var className = isClass(value) ? exports.util.getClassName(value) : value;
        return exports.metadata("type", className);
    }
});
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
