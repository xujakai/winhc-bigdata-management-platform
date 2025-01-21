import api from './WinhcAxios';
import Axios from 'axios';
import {ReleaseSnapshotDataType} from "../data_types/ReleaseSnapshotDataType";
import IPromise = Axios.IPromise;

// 获取区域代码列表
export const getSnapshotByTimeRange = (subject: string, minData?: string | null | undefined, maxData?: string | null | undefined): IPromise<ReleaseSnapshotDataType[]> => {
    const data = new Map<string, string>()
    if (minData) {
        data.set('min', minData)
    }
    if (maxData) {
        data.set('max', maxData)
    }
    return api.get(`/snapshot/${subject}/time-range`, data as any) as unknown as IPromise<ReleaseSnapshotDataType[]>;
};


// 撤销事件
export const revokeLatestReleaseSnapshot = (subject: string): IPromise<string> => {
    return api.get(`/snapshot/${subject}/revoke-latest`) as unknown as IPromise<string>;
};
