import { api } from './api';
import { ReleaseSnapshotDataType } from "../data_types/ReleaseSnapshotDataType";

export const getSnapshotByTimeRange = (
    subject: string, 
    minData?: string | null | undefined, 
    maxData?: string | null | undefined
) => {
    const params: Record<string, string> = {};
    if (minData) {
        params.min = minData;
    }
    if (maxData) {
        params.max = maxData;
    }
    return api.get<ReleaseSnapshotDataType[]>(`/snapshot/${subject}/time-range`, { params });
};

export const revokeLatestReleaseSnapshot = (subject: string) => {
    return api.get<string>(`/snapshot/${subject}/revoke-latest`);
};