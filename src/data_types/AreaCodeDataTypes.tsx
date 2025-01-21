import type {TableColumnsType} from "antd";

export interface AreaCodeDataType {
    area_code?: string;           // 行政区划 code
    base?: string;                // 基础信息
    province?: string;            // 省份名称
    city?: string | null;                // 城市名称
    district?: string | null;            // 区县名称
    province_show?: string;       // 显示省份
    city_show?: string | null;           // 显示城市
    district_show?: string | null;       // 显示区县
    province_code?: string;       // 省份代码
    city_code?: string | null;           // 城市代码
    district_code?: string | null;       // 区县代码
    superior_area_code_view?: string | null;               // 层级
    level?: number;               // 层级
    sort?: number;                // 排序优先级
    deleted?: number;             // 是否删除
    children?: AreaCodeDataType[] | null;
    description?:string;
}

export interface OriginalAreaCodeInfo extends AreaCodeDataType {
    coleScope?: string;
}

