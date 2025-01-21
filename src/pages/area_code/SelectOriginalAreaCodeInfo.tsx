import type {ProColumns} from '@ant-design/pro-components';
import {EditableProTable, ProCard, ProFormField,} from '@ant-design/pro-components';
import React, {useState} from 'react';
import {AreaCodeDataType} from "../../data_types/AreaCodeDataTypes";
import SearchAreaCodeItem from "./SearchAreaCode";
import {OriginalAreaCodeInfo} from "../../data_types/AreaCodeDataTypes";

interface DataSourceType extends AreaCodeDataType {
    id: number;
    cede_scope?: string;
}

interface ChildComponentProps {
    listeningDataSourceChange?: (data: OriginalAreaCodeInfo[]) => void;
}


const App: React.FC<ChildComponentProps> = ({listeningDataSourceChange}) => {

    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);


    const dataSourceOnChange = (value: readonly DataSourceType[]) => {
        setDataSource(value)
        if (listeningDataSourceChange) {
            listeningDataSourceChange(value.map((e) => {
                return {...e}
            }))
        }
    }

    const setValue = (index: number, data: AreaCodeDataType) => {
        console.log("子组件回传数据：", index, data)
        setDataSource(dataSource.map((entry, ii) => {
                return entry.id === index ? {id: index, ...data} : entry
            }
        ));
    };

    const cleanValue = (index: number) => {


    };
    const getNewId = () => {
        let maxNumber = -Infinity;
        dataSource.forEach(d => {
            if (d.id > maxNumber) {
                maxNumber = d.id;
            }
        });
        return Math.max(0, maxNumber + 1)
    }

    const columns: ProColumns<DataSourceType>[] = [
        {
            title: '区划code',
            dataIndex: 'area_code',
            tooltip: '涉及变动的原行政区划',
            width: '15%',
            renderFormItem: (_, {record}) => {
                return <SearchAreaCodeItem index={record?.id ? record?.id : 0} sendDataToParent={setValue}
                                           clearDataToParent={cleanValue}/>;
            },
        },
        {
            title: 'base',
            readonly: true,
            dataIndex: 'base',
        },
        {
            title: '省',
            readonly: true,
            dataIndex: 'province',
        },
        {
            title: '市',
            readonly: true,
            dataIndex: 'city',
        },
        {
            title: '区',
            readonly: true,
            dataIndex: 'district',
        },

        {
            title: '状态',
            key: 'cede_scope',
            dataIndex: 'cede_scope',
            valueType: 'select',
            tooltip: '全部划转表示本区全部废止，部分划转表示区划面积减少',
            // width: 260,
            editable: (value, row, index) => true,
            valueEnum: {
                ALL: {
                    text: '全部划转'
                },
                PART: {
                    text: '部分划转',
                },
                NONE: {
                    text: '无变化',
                },
            },
        },
        {
            title: '操作',
            valueType: 'option',
            width: 200,
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.id);
                        setDataSource(dataSource.map((entry, index) => {
                            console.log("edit", index, entry, record);
                            if (entry.id === record.id) {
                                return {
                                    id: record.id,
                                    cede_scope: record?.cede_scope,
                                }
                            } else {
                                return entry
                            }
                        }));

                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={() => {
                        setDataSource(dataSource.filter((item) => item.id !== record.id));
                    }}
                >
                    删除
                </a>,
            ],
        },
    ];

    return (
        <>
            <EditableProTable<DataSourceType>
                rowKey="id"
                // headerTitle="涉及变动的原行政区划"
                maxLength={6}
                scroll={{
                    x: 1400,
                }}
                recordCreatorProps={{
                    position: 'bottom',
                    // 每次新增的时候需要Key
                    record: () => {
                        return {
                            id: getNewId()
                        }
                    },
                    newRecordType: 'dataSource',
                }}
                loading={false}
                columns={columns}

                value={dataSource}
                onChange={dataSourceOnChange}
                editable={{
                    type: 'single',
                    editableKeys,
                    onSave: async (rowKey, data, row) => {
                        console.log('x111', data)
                    },
                    actionRender: (row, config, defaultDom) => [
                        defaultDom.save,
                        defaultDom.cancel,
                    ],
                    onChange: setEditableRowKeys,
                }}
            />
            {/*<ProCard title="表格数据" headerBordered collapsible defaultCollapsed>*/}
            {/*    <ProFormField*/}
            {/*        ignoreFormItem*/}
            {/*        fieldProps={{*/}
            {/*            style: {*/}
            {/*                width: '100%',*/}
            {/*            },*/}
            {/*        }}*/}
            {/*        mode="read"*/}
            {/*        valueType="jsonCode"*/}
            {/*        text={JSON.stringify(dataSource)}*/}
            {/*    />*/}
            {/*</ProCard>*/}
        </>
    )
}

export default App;


