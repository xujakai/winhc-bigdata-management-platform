import React from 'react';
import {message} from 'antd';
import {AreaCodeDataType} from '../../data_types/AreaCodeDataTypes'
import {CellEditorTable, ProColumns} from "@ant-design/pro-components";

interface ChildComponentProps {
    renderColumns: ProColumns<AreaCodeDataType>[];  // 父组件传递的回调函数
    loading: boolean;
    data: readonly AreaCodeDataType[];
    setData: (data: readonly AreaCodeDataType[]) => void;
    editable: boolean;
}

const editableColumns: Set<String> = new Set<String>(
    ['base', 'province', 'city', 'district', 'province_show', 'city_show', 'district_show', 'province_code', 'city_code', 'district_code', 'level', 'deleted']
)


const App: React.FC<ChildComponentProps> = ({
                                                loading,
                                                data,
                                                setData,
                                                renderColumns,
                                                editable
                                            }) => {
    // const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);


    return (
        <>
            <CellEditorTable<AreaCodeDataType>
                rowKey='area_code'
                recordCreatorProps={
                    false
                }
                scroll={{
                    x: 960,
                }}
                columns={[...renderColumns.slice(0).map(e => {
                    e.readonly = !editableColumns.has(e.key as string) || editable;
                    if (e.key === 'area_code') {
                        e.tooltip = '行政区划code不允许修改'
                    }
                    if (e.key === 'sort') {
                        e.tooltip = '排序不允许修改'
                    }
                    return e;
                })]}
                loading={loading}
                value={data}
                bordered={false}

                pagination={false}
                editable={{
                    type: 'multiple',
                    onValuesChange: (record, recordList) => {
                        // message.success(JSON.stringify(record))
                        setData(recordList);
                    },
                    onChange: (editableKeys: React.Key[], editableRows) => {
                        message.success(JSON.stringify(editableRows))
                        // setEditableRowKeys(editableKeys)
                    },
                }}

            />
        </>
    );
};

export default App;