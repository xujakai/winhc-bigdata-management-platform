export function findMin<T>(arr: T[], keySelector: (item: T) => number | string): T | undefined {
    if (arr.length === 0) return undefined;
    return arr.reduce((minItem, currentItem) =>
        keySelector(currentItem) < keySelector(minItem) ? currentItem : minItem
    );
}

export function findMax<T>(arr: T[], keySelector: (item: T) => number | string): T | undefined {
    if (arr.length === 0) return undefined;
    return arr.reduce((maxItem, currentItem) =>
        keySelector(currentItem) > keySelector(maxItem) ? currentItem : maxItem
    );
}
