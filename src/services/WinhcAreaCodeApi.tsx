import api from './api';
import {ChangeEventDataType} from "../data_types/ChangeEventDataType";
import {IPage} from "../data_types/ResponseVoType";
import {ReleaseSnapshotDataType} from "../data_types/ReleaseSnapshotDataType";

// 获取区域代码列表
export const getAreaCodeList = <T = any>(): IPromise<T> => {
    return api.get('/winhc-area-code') as IPromise<T>;
};

export const searchAreaPrefix = <T = any>(prefix: string): IPromise<T> => {
    return api.get(`/winhc-area-code/search-prefix?prefix=${prefix}`) as IPromise<T>;
};
// 新增区域代码
export const addAreaCode = <T = any>(data: any): IPromise<T> => {
    return api.post('/winhc-area-code/add', data) as IPromise<T>;
};

// 更新区域代码层级
export const updateAreaCodeLevel = (list: any):IPromise<string> => {
    return api.post('/winhc-area-code/update-level', list) as unknown as IPromise<string>;
};

// 更新区域代码视图
export const updateAreaCodeView = (list: any):IPromise<string> => {
    return api.post('/winhc-area-code/update-view', list) as unknown as IPromise<string>;
};

// 撤销事件
export const revokeEvent = (eventId: string): IPromise<string> => {
    return api.get(`/winhc-area-code/revoke-event`, {
        params: {eventId}
    }) as unknown as IPromise<string>;
};

// 获取变更列表
export const getChangeList = (current = 1, size = 10): IPromise<IPage<ChangeEventDataType>> => {
    return api.get('/winhc-area-code/change-list', {
        params: {current, size}
    }) as unknown as IPromise<IPage<ChangeEventDataType>>;
};

// 发布快照
export const releaseSnapshot = (): IPromise<ReleaseSnapshotDataType> => {
    return api.get('/winhc-area-code/release-snapshot') as unknown as IPromise<ReleaseSnapshotDataType>;
};