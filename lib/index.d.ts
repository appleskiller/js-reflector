export interface IClass extends Function {
    new (...args: any[]): IClass;
}
export interface IPropertySchema {
    [key: string]: any;
    name: string;
    isStatic: boolean;
    isMethod: boolean;
    type?: string;
}
export interface IClassSchema {
    [key: string]: any;
    className: string;
    superClass: string;
    staticProperties: {
        [key: string]: IPropertySchema;
    };
    properties: {
        [key: string]: IPropertySchema;
    };
}
export interface IObjectSchema {
    type: string;
    properties: {
        [key: string]: IPropertySchema;
    };
}
export interface IHookTypes {
    CLASS: string;
    STATIC_PROPERTY: string;
    PROPERTY: string;
}
export interface IMetadataStatic {
    (key: string, value?: any): Function;
    className(value: string): Function;
    superClass(value: string | Function | IClass): Function;
    type(value: string | Function | IClass): Function;
}
export interface IReflectorUtil {
    getClass(obj: any): IClass;
    getClassName(classObject: Function | IClass): string;
    getClassByName(className: string): IClass;
    getSuperClass(classObject: Function | IClass): IClass;
    getSuperClassName(classObject: Function | IClass): string;
    newInstance(className: string, ...args: any[]): any;
    getClassSchema(classObject: Function | IClass, declared?: boolean): IClassSchema;
    describe(obj: any, allMembers?: boolean): IObjectSchema;
    describeProperty(obj: any, propertyName: string, value: any): IPropertySchema;
}
export declare var hookTypes: IHookTypes;
export declare function registerMetadataHook(type: string, key: string, hook: (value: any, classObject: Function | IClass, oriValue: any) => any): void;
export declare var metadata: IMetadataStatic;
export declare var util: IReflectorUtil;
