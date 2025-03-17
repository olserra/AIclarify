// Common Utility Types
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type DeepRequired<T> = {
    [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type DeepNonNullable<T> = {
    [P in keyof T]: T[P] extends object ? DeepNonNullable<T[P]> : NonNullable<T[P]>;
};

// Async Types
export type AsyncReturnType<T extends (...args: any) => Promise<any>> = Awaited<ReturnType<T>>;

// Function Types
export type FunctionParameters<T extends (...args: any) => any> = Parameters<T>;
export type FunctionReturnType<T extends (...args: any) => any> = ReturnType<T>;

// Object Types
export type ObjectKeys<T> = keyof T;
export type ObjectValues<T> = T[keyof T];
export type ObjectEntries<T> = [keyof T, T[keyof T]][];

// Array Types
export type ArrayElement<T> = T extends (infer U)[] ? U : never;
export type ArrayLength<T extends any[]> = T['length'];

// String Types
export type StringLength<T extends string> = T['length'];
export type StringChars<T extends string> = T extends `${infer F}${infer R}` ? F | StringChars<R> : never;

// Number Types
export type NumberRange<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : NumberRange<N, [...Acc, Acc['length']]>;

// Conditional Types
export type If<C extends boolean, T, F> = C extends true ? T : F;
export type IsNever<T> = [T] extends [never] ? true : false;
export type IsAny<T> = 0 extends (1 & T) ? true : false; 