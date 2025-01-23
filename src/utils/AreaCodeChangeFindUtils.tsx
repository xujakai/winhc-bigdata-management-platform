import {AreaCodeDataType} from "../data_types/AreaCodeDataTypes";
import {copyObject, deepEqual, removeProperties} from "./ObjectUtils";
import {message} from "antd";

export function explodeAreaCode(data: readonly AreaCodeDataType[], result: AreaCodeDataType[] = []): AreaCodeDataType[] {
    for (let i = 0; i < data.length; i++) {
        let areaCode = data[i]
        let copyAreaCode = copyObject(areaCode)
        copyAreaCode = removeProperties(copyAreaCode, ['children'])
        result.push(copyAreaCode)
        if (areaCode.children) {
            explodeAreaCode(areaCode.children, result)
        }
    }
    return result;
}

export function findDifference(oldData: AreaCodeDataType[], newData: AreaCodeDataType[]): AreaCodeDataType[] {
    const oldMap = new Map(oldData.map(item => [item.area_code, item]));
    let difList: AreaCodeDataType[] = []

    for (let i = 0; i < newData.length; i++) {
        let tmpData = newData[i]
        let flag = deepEqual(tmpData, oldMap.get(tmpData.area_code))
        if (!flag)
            difList.push(tmpData)
    }
    return difList
}

export interface AreaCodeLevelInfo {
    currentAreaCode: string;
    level: number;
    superior_area_code: string[];
    find: boolean;
}

export const findViewLevel = (data: AreaCodeDataType[], area_code: string, depth: number = 1, superior_area_code: string[] = []): AreaCodeLevelInfo | null => {
    let flag = data.some((element) => area_code === element.area_code);
    if (flag) {
        return {
            currentAreaCode: area_code,
            level: depth,
            superior_area_code: superior_area_code,
            find: true,
        } as AreaCodeLevelInfo;
    } else {
        for (let i = 0; i < data.length; i++) {
            let children = data[i].children;
            if (children) {
                let tmpFlag: AreaCodeLevelInfo | null = findViewLevel(children, area_code, depth + 1, [...superior_area_code, data[i].area_code as string])
                if (tmpFlag && tmpFlag.find) {
                    return tmpFlag;
                }
            }
        }
    }
    return null
}

export function rebuildSort(data: Array<AreaCodeDataType>): AreaCodeDataType[] {
    for (let i = 0; i < data.length; i++) {
        data[i].sort = i
    }
    return data;
}

export function removeByAreaCode(data: AreaCodeDataType[], area_code: string) {
    let index = data.findIndex(e => e.area_code === area_code)
    if (index >= 0) {
        data.splice(index, 1);
    } else {
        for (let i = 0; i < data.length; i++) {
            let children = data[i].children
            if (children)
                removeByAreaCode(children, area_code)
        }
    }
}

function insertData(data: AreaCodeDataType[], frontAreaCode: string[], areaCode: AreaCodeDataType, moveDown: boolean = false) {
    if (frontAreaCode.length === 1) {
        let index = data.findIndex(e => e.area_code === frontAreaCode[0])
        if (index >= 0 || moveDown) {
            data.splice(index + 1, 0, areaCode);
            rebuildSort(data)
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            if (data[i].area_code !== frontAreaCode[0]) {
                continue;
            }
            let children = data[i].children;
            if (children) {
                frontAreaCode.splice(0, 1)
                insertData(children, frontAreaCode, areaCode, moveDown)
            }
        }
    }
}

function leftMoveFunc(data: AreaCodeDataType[], currentData: AreaCodeDataType, levelInfo: AreaCodeLevelInfo): AreaCodeDataType[] {
    let currentCopyData: AreaCodeDataType = copyObject(currentData);
    currentCopyData.superior_area_code_view = levelInfo.superior_area_code[levelInfo.level - 3]
    removeByAreaCode(data, levelInfo.currentAreaCode)
    insertData(data, levelInfo.superior_area_code, currentCopyData)
    return data;
}

function getAroundAreaCode(data: AreaCodeDataType[], area_code: string): string | null {
    let index = data.findIndex(e => e.area_code === area_code)
    if (index === 0) {
        if (data.length === 1) {
            return null;
        }
        return data[1].area_code as string;
    } else if (index > 0) {
        return data[index - 1].area_code as string;
    } else {
        for (let i = 0; i < data.length; i++) {
            let children = data[i].children;
            if (children) {
                let tmp = getAroundAreaCode(children, area_code)
                if (tmp) {
                    return tmp;
                }
            }
        }
    }
    return null;
}

function rightMoveFunc(data: AreaCodeDataType[], currentData: AreaCodeDataType, levelInfo: AreaCodeLevelInfo): AreaCodeDataType[] {
    let currentCopyData: AreaCodeDataType = copyObject(currentData);
    let new_superior_area_code = getAroundAreaCode(data, levelInfo.currentAreaCode);
    if (new_superior_area_code === null) {
        return data;
    }
    currentCopyData.superior_area_code_view = new_superior_area_code
    removeByAreaCode(data, levelInfo.currentAreaCode)
    insertData(data, [...levelInfo.superior_area_code, new_superior_area_code, levelInfo.currentAreaCode], currentCopyData, true)
    return data;
}

export function moveLevel(allData: AreaCodeDataType[], currentData: AreaCodeDataType, levelInfo: AreaCodeLevelInfo, leftMove: boolean = false): AreaCodeDataType[] {
    if (levelInfo.level === 1 && leftMove) {
        return allData;
    }

    if (leftMove) {
        console.log("move left: ", currentData, levelInfo)
        leftMoveFunc(allData, currentData, levelInfo)
    } else {
        if (currentData.children && currentData.children.length > 0) {
            message.warning("该节点存在下游节点，移动可能会导致下游节点丢失！");
            return allData;
        }
        console.log("move right: ", currentData, levelInfo)
        rightMoveFunc(allData, currentData, levelInfo)
    }
    return copyObject(allData);
}