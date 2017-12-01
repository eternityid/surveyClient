import { clone, cloneDeep, keys, values, assign } from "lodash";

export class ObjectUtil {
    public static clone<T>(value: T): T {
        if (value == null || value == undefined) return value;
        return clone(value);
    }
    public static cloneDeep<T>(value: T, deepLevel?: number): T {
        if (deepLevel == undefined) return cloneDeep(value);
        if (value == null || value == undefined) return value;

        let result = clone(value);
        cloneInsideRecursively(result, deepLevel);

        return result;

        function cloneInsideRecursively(source: any, maxDeepLevel: number, currentDeepLevel: number = 1) {
            if (typeof (source) != "object" || currentDeepLevel > maxDeepLevel) return;
            Object.keys(source).map(key => {
                source[key] = clone(source[key]);
                cloneInsideRecursively(source[key], maxDeepLevel, currentDeepLevel + 1);
            });
        }
    }

    public static keys<T extends (string | number)>(object?: Dictionary<any>): T[] {
        return keys(object)
            .map((key: any) => <T>(!isNaN(<any>key) ? parseInt(key) : key));
    }

    public static values<T>(object?: Dictionary<T> | Dictionary<T> | ArrayLike<T> | null | undefined): T[] {
        return values(object);
    }

    public static isDifferent<T>(value1: T, value2: T) {
        if (value1 == null && value2 == null) return false;
        if (value1 == null && value2 != null) return true;
        if (value1 != null && value2 == null) return true;
        return JSON.stringify(value1) != JSON.stringify(value2);
    }

    public static boxingFn<T>(fn?: (...args: any[]) => T, ...fnArgs: any[]) {
        return () => {
            return fn ? fn(fnArgs) : undefined;
        };
    }

    public static assign<T extends object>(target: T, source: T): T {
        assign(target, source);
        return target;
    }

    public static assignDeep<T extends object>(target: T, source: T, cloneSource: boolean = false): T {
        return mapObject(target, source, cloneSource);
    }

    public static setDeep<T extends object>(target: T, source: T, cloneSource: boolean = false): T {
        return mapObject(target, source, cloneSource, true);
    }
}

function mapObject<T extends object>(target: T, source: T, cloneSource: boolean = false, makeTargetEqualSource: boolean = false) {
    let sourceKeys = Object.keys(source);

    sourceKeys.forEach(key => {
        if (ObjectUtil.isDifferent(target[key], source[key])) {
            if (target[key] == null || source[key] == null || typeof (target[key]) != "object") {
                target[key] = cloneSource ? ObjectUtil.cloneDeep(source[key]) : source[key];
            } else {
                if (cloneSource) target[key] = ObjectUtil.clone(target[key]);

                if (target[key] instanceof Array && source[key] instanceof Array) {
                    let targetArray: any[] = target[key];
                    let sourceArray: any[] = source[key];

                    if (targetArray.length > sourceArray.length) targetArray.splice(sourceArray.length);
                    for (let i = 0; i < sourceArray.length; i++) {
                        if (ObjectUtil.isDifferent(targetArray[i], sourceArray[i])) {
                            targetArray[i] = cloneSource ? ObjectUtil.cloneDeep(sourceArray[i]) : sourceArray[i];
                        }
                    }
                } else {
                    mapObject(target[key], source[key], cloneSource, makeTargetEqualSource);
                }
            }
        }
    });

    if (makeTargetEqualSource) {
        removeTargetKeysNotInSource(target, source);
    }

    return target;
}

function removeTargetKeysNotInSource<T extends object>(target: T, source: T) {
    if (target == undefined || source == undefined) return;

    let targetKeys = Object.keys(target);
    let sourceKeys = Object.keys(source);

    sourceKeys.forEach(key => {
        if (!targetKeys.includes(key)) delete source[key];
    });
}