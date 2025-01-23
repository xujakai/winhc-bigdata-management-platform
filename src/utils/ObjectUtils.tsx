import cloneDeep from "lodash/cloneDeep";

export function addProperty<T, K extends string, V>(
    obj: T,
    key: K,
    value: V
): T & { [P in K]: V } {
    return {...obj, [key]: value} as T & { [P in K]: V };
}

export function removeProperties<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
): Omit<T, K> {
    const copy = {...obj};
    keys.forEach(key => {
        delete copy[key];
    });
    return copy;
}

export function copyObject<T>(obj: T): T {
    if (Array.isArray(obj)) {
        let tmp = obj as T[]
        return tmp.map(e => copyObject(e)) as T;
    }
    return cloneDeep(obj);
}

export function deepEqual(obj1: any | undefined, obj2: any | undefined) {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }
    return true;
}