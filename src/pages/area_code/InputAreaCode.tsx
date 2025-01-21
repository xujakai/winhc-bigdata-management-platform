import React from 'react';
import {Form} from 'antd';
import {AreaCodeDataType} from "../../data_types/AreaCodeDataTypes"
import {ProForm, ProFormSelect, ProFormText, ProFormTextArea,} from '@ant-design/pro-components';

import SearchAreaCodeItem from "./SearchAreaCode";

interface ChildComponentProps {
    sendDataToParent: (data: AreaCodeDataType) => void;  // 父组件传递的回调函数
    areaCodeData: AreaCodeDataType;
}

const App: React.FC<ChildComponentProps> = ({sendDataToParent, areaCodeData}) => {
    const [form] = Form.useForm();

    const licenseAreaCodeChange = (key: string, value: string | null) => {
        let myMap = new Map();
        myMap.set(key, value)
        let aa = Object.fromEntries(myMap)
        valuesChange(aa, null)
        form.setFieldsValue(aa);

    }

    const setValue = (index: number, data: AreaCodeDataType) => {
        sendDataToParent(data)
        form.setFieldsValue(data);
    }
    const cleanValue = (index: number) => {
        sendDataToParent({})
        form.setFieldsValue({});
    }

    const valuesChange = (changedValues: any, values: any) => {
        console.log('xjk', changedValues)

        console.log("xjk2", {...areaCodeData, ...changedValues})
        sendDataToParent({
            ...areaCodeData,
            ...changedValues
        })
        console.log('updated:', areaCodeData)
    }


    return (<>
        <ProForm
            submitter={false}
            form={form}
            onValuesChange={valuesChange}
        >
            <ProForm.Group>
                <ProFormText
                    name="area_code"
                    label="目标区划code"
                    initialValue={areaCodeData.area_code}
                    tooltip="最长为6位"
                    placeholder="请输入code"
                >
                    <SearchAreaCodeItem index={-1} sendDataToParent={setValue}
                                        clearDataToParent={cleanValue}
                                        sendValueToParent={(value: string) => licenseAreaCodeChange('area_code', value)}
                                        style={{width: 330}}/>
                </ProFormText>
            </ProForm.Group>
            <ProForm.Group>
                <ProFormText
                    width="md"
                    name="base"
                    label="base"
                    initialValue={areaCodeData.base}
                    placeholder="请输入base"
                />

                <ProFormText
                    width="md"
                    name="province"
                    label="省"
                    initialValue={areaCodeData.province}
                    placeholder="请输入省"
                />
                <ProFormText
                    width="md"
                    name="city"
                    label="市"
                    initialValue={areaCodeData.city}
                    placeholder="请输入市"
                />
                <ProFormText
                    width="md"
                    name="district"
                    label="区"
                    initialValue={areaCodeData.district}
                    placeholder="请输入区"
                />
            </ProForm.Group>
            <ProForm.Group title={'展示字段'}>
                <ProFormText
                    width="md"
                    name="province_show"
                    label="省-展示字段"
                    initialValue={areaCodeData.province_show}
                    placeholder="请输入省"
                />
                <ProFormText
                    width="md"
                    name="city_show"
                    label="市-展示字段"
                    initialValue={areaCodeData.city_show}
                    placeholder="请输入市"
                />
                <ProFormText
                    width="md"
                    name="district_show"
                    label="区-展示字段"
                    initialValue={areaCodeData.district_show}
                    placeholder="请输入区"
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormText
                    name="superior_area_code_view"
                    label="上级区划code"
                    initialValue={areaCodeData.superior_area_code_view}
                    tooltip="最长为6位"
                    placeholder="请输入code"
                >
                    <SearchAreaCodeItem index={-1}
                                        sendDataToParent={(index, value) => licenseAreaCodeChange('superior_area_code_view', value.area_code ? value.area_code : null)}
                                        clearDataToParent={(value) => licenseAreaCodeChange('superior_area_code_view', null)}
                                        sendValueToParent={(value: string) => licenseAreaCodeChange('superior_area_code_view', value)}
                                        style={{width: 300}}/>
                </ProFormText>
                <ProFormSelect
                    options={[
                        {
                            value: 1,
                            label: '省级',
                        },
                        {
                            value: 2,
                            label: '地级市',
                        },
                        {
                            value: 3,
                            label: '区县',
                        },
                        {
                            value: 4,
                            label: '乡镇',
                        },
                    ]}
                    width="xs"
                    name="level"
                    label="区划层级"
                />

            </ProForm.Group><ProForm.Group>
            <ProFormTextArea
                name="description"
                label="备注"
                width="lg"
                placeholder="请输入备注"
            />
        </ProForm.Group></ProForm>
    </>)

}

export default App;