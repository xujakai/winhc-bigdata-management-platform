import { api } from './api';
import { ChangeEventDataType } from "../data_types/ChangeEventDataType";
import { IPage } from "../data_types/ResponseVoType";
import { ReleaseSnapshotDataType } from "../data_types/ReleaseSnapshotDataType";

export const getAreaCodeList = <T = any>() => {
    return api.get<T>('/winhc-area-code');
};

export const searchAreaPrefix = <T = any>(prefix: string) => {
    return api.get<T>(`/winhc-area-code/search-prefix?prefix=${prefix}`);
};

export const addAreaCode = <T = any>(data: any) => {
    return api.post<T>('/winhc-area-code/add', data);
};

export const updateAreaCodeLevel = (list: any) => {
    return api.post<string>('/winhc-area-code/update-level', list);
};

export const updateAreaCodeView = (list: any) => {
    return api.post<string>('/winhc-area-code/update-view', list);
};

export const revokeEvent = (eventId: string) => {
    return api.get<string>(`/winhc-area-code/revoke-event`, {
        params: {eventId}
    });
};

export const getChangeList = (current = 1, size = 10) => {
    return api.get<IPage<ChangeEventDataType>>('/winhc-area-code/change-list', {
        params: {current, size}
    });
};

export const releaseSnapshot = () => {
    return api.get<ReleaseSnapshotDataType>('/winhc-area-code/release-snapshot');
};