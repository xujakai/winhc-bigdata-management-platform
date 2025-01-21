export interface ReleaseSnapshotDataType {
    id: number;
    subject: string;
    release_version: string;
    original_content: string;
    content: string;
    compatible_content: string;
    change_chain: string;

    description: string;
    update_time: string;
    create_time: string;
    deleted: number;
}