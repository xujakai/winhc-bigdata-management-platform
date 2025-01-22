import { api } from './api';
import { ChangeEventDataType } from "../data_types/ChangeEventDataTypes";
import { IPage } from "../data_types/ResponseVoType";
import { ReleaseSnapshotDataType } from "../data_types/ReleaseSnapshotDataType";

// 获取区域代码列表
export const getAreaCodeList = <T = any>() => {
    return api.get<T>('/winhc-area-code');
};

export const searchAreaPrefix = <T = any>(prefix: string) => {
    return api.get<T>(`/winhc-area-code/search-prefix?prefix=${prefix}`);
};

// 新增区域代码
export const addAreaCode = <T = any>(data: any) => {
    return api.post<T>('/winhc-area-code/add', data);
};

// 更新区域代码层级
export const updateAreaCodeLevel = (list: any) => {
    return api.post<string>('/winhc-area-code/update-level', list);
};

// 更新区域代码视图
export const updateAreaCodeView = (list: any) => {
    return api.post<string>('/winhc-area-code/update-view', list);
};

// 撤销事件
export const revokeEvent = (eventId: string) => {
    return api.get<string>(`/winhc-area-code/revoke-event`, {
        params: {eventId}
    });
};

// 获取变更列表
export const getChangeList = (current = 1, size = 10) => {
    return api.get<IPage<ChangeEventDataType>>('/winhc-area-code/change-list', {
        params: {current, size}
    });
};

// 发布快照
export const releaseSnapshot = () => {
    return api.get<ReleaseSnapshotDataType>('/winhc-area-code/release-snapshot');
};