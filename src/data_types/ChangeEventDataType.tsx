export interface ChangeEventDataType {
    event_id: string;
    subject: string;
    event_type: string;
    change_chain: string;

    description: string;
    update_time: string;
    create_time: string;
    deleted: number;
}