import {format } from "date-fns";

export function getNowDateTime(df: string = "yyyy-MM-dd HH:mm:ss"): string {
    return format(new Date(), df);

}