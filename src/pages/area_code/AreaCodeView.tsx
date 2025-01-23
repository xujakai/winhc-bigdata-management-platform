import React, {useEffect, useState} from 'react';
import {Button, message, Segmented, Space} from "antd";
import {AreaCodeDataType} from "../../data_types/AreaCodeDataTypes";
import AreaCodeSort from "./AreaCodeTableSort"
import AreaCodeEdit from "./AreaCodeTableEdit"
import {getAreaCodeList, updateAreaCodeLevel, updateAreaCodeView} from "../../services/WinhcAreaCodeApi";
import {copyObject} from "../../utils/ObjectUtils";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {explodeAreaCode, findDifference} from "../../utils/AreaCodeChangeFindUtils";

const areaLevelEnum: Record<number, { text: string; status?: string }> = {
    1: {text: '省级'},
    2: {text: '地级市'},
    3: {text: '区县'},
    4: {text: '乡镇'},
};

const columns: ProColumns<AreaCodeDataType>[] = [
    {
        key: 'handShank',
        align: 'center',
        dataIndex: '11',
        width: 80,
        readonly: true,
        editable: false,
        render: () => <>&nbsp;</>
    },
    {
        title: '行政区划code',
        dataIndex: 'area_code',
        width: 150,
        key: 'area_code',
        readonly: true,
    },
    {
        title: 'base',
        dataIndex: 'base',
        key: 'base',
        width: '5%',
    },
    {
        title: '省份名称',
        dataIndex: 'province',
        key: 'province',
        width: '10%',
    },
    {
        title: '城市名称',
        dataIndex: 'city',
        key: 'city',
    },
    {
        title: '区县名称',
        dataIndex: 'district',
        key: 'district',
    },
    {
        title: '显示省份',
        dataIndex: 'province_show',
        key: 'province_show',
    },
    {
        title: '显示城市',
        dataIndex: 'city_show',
        key: 'city_show',
    },
    {
        title: '显示区县',
        dataIndex: 'district_show',
        key: 'district_show',
    },
    {
        title: '省份代码',
        dataIndex: 'province_code',
        key: 'province_code',
    },
    {
        title: '城市代码',
        dataIndex: 'city_code',
        key: 'city_code',
    },
    {
        title: '区县代码',
        dataIndex: 'district_code',
        key: 'district_code',
    },
    {
        title: '层级',
        dataIndex: 'level',
        key: 'level',
        valueType: 'select',
        valueEnum: areaLevelEnum,
    },
    {
        title: '是否删除',
        dataIndex: 'deleted',
        key: 'deleted',
        valueType: 'select',
        width: '8%',
        valueEnum: {
            0: {
                text: '存续-展示'
            },
            1: {
                text: '存续-不展示',
                status: 'Default',
            },
            9: {
                text: '删除',
                status: 'Error',
            },
        },
    },
];

const AreaCodeView: React.FC = () => {
    const [data, setData] = useState<readonly AreaCodeDataType[]>([]);
    const [backupData, setBackupData] = useState<AreaCodeDataType[]>([])
    const [loading, setLoading] = useState(true);
    const [optType, setOptType] = useState<string>('view');
    const [awaitSubmitData, setAwaitSubmitData] = useState<AreaCodeDataType[]>([]);
    const [reload, setReload] = useState<boolean>(true);
    const [renderColumns, setRenderColumns] = useState<ProColumns<AreaCodeDataType>[]>(columns);

    const saveChange = async () => {
        try {
            if (optType === 'edit') {
                const response = await updateAreaCodeView(awaitSubmitData);
                message.success(response);
                setAwaitSubmitData([]);
                setOptType("view");
                setReload(!reload);
            }
            if (optType === 'sort') {
                const response = await updateAreaCodeLevel(awaitSubmitData);
                message.success(response);
                setAwaitSubmitData([]);
                setOptType("view");
                setReload(!reload);
            }
            setAwaitSubmitData([]);
        } catch (error) {
            message.error('保存失败：' + (error instanceof Error ? error.message : '未知错误'));
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getAreaCodeList<AreaCodeDataType[]>();
                setData(response);
                setBackupData(copyObject(response));
            } catch (error) {
                message.error('获取数据失败：' + (error instanceof Error ? error.message : '未知错误'));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [reload]);

    useEffect(() => {
        const oldData = explodeAreaCode(backupData);
        const newData = explodeAreaCode(data);
        const diffData = findDifference(oldData, newData);
        setAwaitSubmitData(diffData);
    }, [data, backupData]);

    useEffect(() => {
        if (optType === 'sort') {
            setRenderColumns([...columns]);
        } else if (optType === 'edit') {
            setRenderColumns(columns);
        } else {
            setRenderColumns(columns);
            setData(copyObject(backupData));
        }
    }, [optType, backupData]);

    return (
        <>
            <Space align="center" style={{marginBottom: 16}}>
                <Segmented
                    value={optType}
                    onChange={setOptType}
                    options={[
                        {label: '展示', value: 'view'},
                        {label: '编辑', value: 'edit'},
                        {label: '层级/排序', value: 'sort'},
                    ]}
                />
                {optType !== 'view' && (
                    <Button 
                        disabled={awaitSubmitData.length === 0}
                        onClick={saveChange}
                    >
                        保存
                    </Button>
                )}
            </Space>
            {optType === 'sort' ? (
                <AreaCodeSort
                    renderColumns={renderColumns}
                    data={data as AreaCodeDataType[]} 
                    loading={loading}
                    setData={setData}
                />
            ) : optType === 'edit' ? (
                <AreaCodeEdit 
                    renderColumns={renderColumns}
                    data={data} 
                    loading={loading}
                    setData={setData} 
                    editable={optType !== 'edit'}
                />
            ) : (
                <ProTable 
                    columns={columns} 
                    dataSource={data} 
                    loading={loading} 
                    pagination={false} 
                    search={false}
                    options={false}
                    rowKey="area_code" 
                />
            )}
        </>
    );
};

export default AreaCodeView;