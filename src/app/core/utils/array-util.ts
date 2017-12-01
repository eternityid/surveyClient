import { find, filter, max, maxBy, keyBy, difference, remove, last, uniq, uniqBy, sortBy } from "lodash";
import { ObjectUtil } from "./object-util";

export class ArrayUtil {
    public static find<T>(
        collection: T[] | null | undefined,
        predicate: (item: T) => boolean,
        fromIndex?: number
    ): T | undefined {
        return find(collection, predicate, fromIndex);
    }

    public static findSelect<T, TSelect>(
        collection: T[] | null | undefined,
        predicate: (item: T) => boolean,
        selectCallback: (item: T) => TSelect,
        fromIndex?: number
    ): TSelect | undefined {
        let item = find(collection, predicate, fromIndex);
        return item ? selectCallback(item) : undefined;
    }

    public static filter<T>(
        collection: T[] | null | undefined,
        predicate: (item: T) => boolean
    ): T[] {
        return filter(collection, predicate);
    }

    public static selectMany<T, S>(
        collection: T[] | null | undefined,
        selectCallback: (item: T) => S[]
    ): S[] {
        if (collection == null) return [];
        let listOfChildList = collection.map(selectCallback);
        return listOfChildList.reduce((prevValue, currentValue) => prevValue.concat(currentValue));
    }

    public static max<T>(
        collection: ArrayLike<T> | null | undefined
    ): T | undefined {
        return max(collection);
    }

    public static maxBy<T>(
        collection: ArrayLike<T> | null | undefined,
        iteratee: (item: T) => number
    ): T | undefined {
        return maxBy(collection, iteratee);
    }

    public static keyBy<T>(
        collection: ArrayLike<T> | null | undefined,
        iteratee: (item: T) => string | number
    ): Dictionary<T> {
        return keyBy(collection, iteratee);
    }

    public static includesAll<T>(superset: T[], subset: T[]): boolean {
        return difference(subset, superset).length === 0;
    }

    public static includesAny<T>(superset: T[], subset: T[]): boolean {
        for (var i = 0; i < subset.length; i++) {
            var subsetItem = subset[i];
            if (superset.includes(subsetItem)) return true;
        }
        return false;
    }

    public static all<T>(
        collection: ArrayLike<T> | null | undefined,
        predicate: (item: T) => boolean
    ): boolean {
        return ArrayUtil.any(collection, (item: T) => !predicate(item)) ? false : true;
    }

    public static any<T>(
        collection: ArrayLike<T> | null | undefined,
        predicate: (item: T) => boolean
    ): boolean {
        if (collection == null) return false;
        for (var i = 0; i < collection.length; i++) {
            var element = collection[i];
            if (predicate(element)) return true;
        }
        return false;
    }

    public static remove<T>(
        collection: T[],
        predicate: (item: T) => boolean
    ): T[] {
        if (collection == null) return collection;
        remove(collection, predicate);
        return collection;
    }

    public static add<T>(
        collection: T[] | null | undefined,
        addItem: T,
        condition?: (addItem: T, collection: ArrayLike<T> | null | undefined) => boolean
    ): T[] | null | undefined {
        if (collection == null) return collection;
        if (condition == undefined || condition(addItem, collection)) {
            collection.push(addItem);
            return collection;
        }
        return collection;
    }

    public static last<T>(
        collection: ArrayLike<T> | null | undefined
    ): T | undefined {
        if (collection == null) return undefined;
        return last(collection);
    }

    public static distinct<T>(
        collection: ArrayLike<T>
    ): T[] {
        return uniq(collection);
    }

    public static distinctBy<T>(
        collection: ArrayLike<T>,
        iteratee: (value: T, index: number, collection: ArrayLike<T>) => {} | null | undefined
    ): T[] {
        return uniqBy(collection, iteratee);
    }

    public static sortBy<T>(
        collection: T[],
        iteratee: (value: T, index: number, collection: ArrayLike<T>) => {} | null | undefined
    ): T[] {
        return sortBy(collection, iteratee);
    }

    public static concatAll<T>(
        ...collection: T[][]
    ): T[] {
        let result: T[] = [];
        collection.forEach(item => {
            result = result.concat(item);
        })
        return result;
    }
}