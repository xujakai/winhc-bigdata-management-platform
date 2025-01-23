import {ProCard, ProFormTextArea, StepsForm,} from '@ant-design/pro-components';
import {message, Modal} from 'antd';
import {AreaCodeDataType, OriginalAreaCodeInfo} from "../../data_types/AreaCodeDataTypes";
import SelectOriginalAreaCodeInfo from "./SelectOriginalAreaCodeInfo";
import InputAreaCode from "./InputAreaCode"
import React, {useState} from "react";
import {addAreaCode, searchAreaPrefix} from "../../services/WinhcAreaCodeApi";
import {useNavigate} from "react-router-dom";


interface SubmitAreaCodeInfo {
    original_area_info?: OriginalAreaCodeInfo[] | null;
    target_area_info: AreaCodeDataType;
    description?: string | null;
    change_type?: string | null;
}

export default () => {
    const navigate = useNavigate();

    const [originalAreaInfo, setOriginalAreaInfo] = useState<OriginalAreaCodeInfo[]>([]);

    const [targetAreaInfo, setTargetAreaInfo] = useState<AreaCodeDataType>({});


    const checkAreaCode = async (data: string | null | undefined) => {
        if (data) {
            let res = await searchAreaPrefix<Map<string, any>>(data)
            console.log("checkAreaCode", data, res, Object.keys(res).length)
            if (Object.keys(res).length > 0) {
                return true
            }
        }
        return false
    }

    const submitAreaCode = async (values: Record<string, any>) => {
        console.log(values);


        if (await checkAreaCode(targetAreaInfo.area_code)) {
            message.error('目标区划和现有的冲突，请重填！')
            return
        }

        const flag = await checkAreaCode(targetAreaInfo.superior_area_code_view)
        console.log("checkAreaCode 2", flag)

        if (!targetAreaInfo.superior_area_code_view || !flag) {
            message.error('上级区划不存在！')
            return
        }
        let submitDesc: string | null = null

        Modal.info({
            title: "请简要描述本次变更的提交说明",
            content: (
                <ProCard style={{width: '100%', height: "300px"}}>
                    <ProFormTextArea
                        fieldProps={{
                            onChange: (e) => {
                                console.log('提交描述：', e.target.value)
                                submitDesc = e.target.value;
                            }
                        }}
                        name="submit_description"
                        width="lg"
                        placeholder="请输入备注"
                    /></ProCard>
            ),
            width: 1000,

            type: 'confirm',
            okCancel: true,
            onOk: () => {
                const data: SubmitAreaCodeInfo = {
                    original_area_info: originalAreaInfo,
                    target_area_info: targetAreaInfo,
                    description: submitDesc
                }
                console.log('提交变更数据:', JSON.stringify(data));

                addAreaCode<string>(data).then(e => {
                    // console.log('提交变更数据:', JSON.stringify(data));
                    // message.success(JSON.stringify(data));
                    message.success(e);
                    navigate('/area-code/view')
                })
            },
            onCancel: () => {
            },
        });


    }


    return (
        <>
            <StepsForm
                onFinish={submitAreaCode}
                formProps={{
                    validateMessages: {
                        required: '此项为必填项',
                    },
                }}
            >
                <StepsForm.StepForm
                    name="base"
                    title="第一步骤"
                    stepProps={{
                        description: '涉及变动的原行政区划',
                    }}
                    onFinish={async () => {
                        // await waitTime(2000);
                        return true;
                    }}
                >
                    <ProCard
                        // title="涉及变动的原行政区划"
                        // bordered
                        // headerBordered
                        // collapsible
                        style={{
                            marginBlockEnd: 16,
                            minWidth: 800,
                            maxWidth: '100%',
                        }}
                    >
                        <SelectOriginalAreaCodeInfo listeningDataSourceChange={setOriginalAreaInfo}/>

                        {/*<ProForm.Group title="节点" size={8}>*/}
                        {/*    <ProFormSelect*/}
                        {/*        width="sm"*/}
                        {/*        name="source"*/}
                        {/*        placeholder="选择来源节点"*/}
                        {/*    />*/}
                        {/*    <ProFormSelect*/}
                        {/*        width="sm"*/}
                        {/*        name="target"*/}
                        {/*        placeholder="选择目标节点"*/}
                        {/*    />*/}
                        {/*</ProForm.Group>*/}
                    </ProCard>

                    {/*<ProCard*/}
                    {/*    title="目标行政区划"*/}
                    {/*    bordered*/}
                    {/*    headerBordered*/}
                    {/*    collapsible*/}
                    {/*    style={{*/}
                    {/*        minWidth: 800,*/}
                    {/*        marginBlockEnd: 16,*/}
                    {/*    }}*/}
                    {/*>*/}


                    {/*<ProFormDigit*/}
                    {/*    name="xs"*/}
                    {/*    label="XS号表单"*/}
                    {/*    initialValue={9999}*/}
                    {/*    tooltip="悬浮出现的气泡。"*/}
                    {/*    placeholder="请输入名称"*/}
                    {/*    width="xs"*/}
                    {/*/>*/}
                    {/*<ProFormText*/}
                    {/*    name="s"*/}
                    {/*    label="S号表单"*/}
                    {/*    placeholder="请输入名称"*/}
                    {/*    width="sm"*/}
                    {/*/>*/}
                    {/*<ProFormDateRangePicker name="m" label="M 号表单"/>*/}
                    {/*<ProFormSelect*/}
                    {/*    name="l"*/}
                    {/*    label="L 号表单"*/}
                    {/*    fieldProps={{*/}
                    {/*        mode: 'tags',*/}
                    {/*    }}*/}
                    {/*    width="lg"*/}
                    {/*    initialValue={['吴家豪', '周星星']}*/}
                    {/*    options={['吴家豪', '周星星', '陈拉风'].map((item) => ({*/}
                    {/*        label: item,*/}
                    {/*        value: item,*/}
                    {/*    }))}*/}
                    {/*/>*/}
                    {/*</ProCard>*/}
                </StepsForm.StepForm>
                <StepsForm.StepForm name="checkbox" title="第二步骤" stepProps={{
                    description: '目标行政区划',
                }}>
                    <ProCard
                        style={{
                            minWidth: 800,
                            marginBlockEnd: 16,
                            maxWidth: '100%',
                        }}
                    >
                        <InputAreaCode areaCodeData={targetAreaInfo}
                                       sendDataToParent={setTargetAreaInfo}></InputAreaCode>
                    </ProCard>
                </StepsForm.StepForm>
                {/*<StepsForm.StepForm name="time" title="第三步骤">*/}
                {/*    <ProCard*/}
                {/*        style={{*/}
                {/*            marginBlockEnd: 16,*/}
                {/*            minWidth: 800,*/}
                {/*            maxWidth: '100%',*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        <ProFormCheckbox.Group*/}
                {/*            name="checkbox"*/}
                {/*            label="部署单元"*/}
                {/*            rules={[*/}
                {/*                {*/}
                {/*                    required: true,*/}
                {/*                },*/}
                {/*            ]}*/}
                {/*            options={['部署单元1', '部署单元2', '部署单元3']}*/}
                {/*        />*/}
                {/*        <ProFormSelect*/}
                {/*            label="部署分组策略"*/}
                {/*            name="remark"*/}
                {/*            rules={[*/}
                {/*                {*/}
                {/*                    required: true,*/}
                {/*                },*/}
                {/*            ]}*/}
                {/*            width="md"*/}
                {/*            initialValue="1"*/}
                {/*            options={[*/}
                {/*                {*/}
                {/*                    value: '1',*/}
                {/*                    label: '策略一',*/}
                {/*                },*/}
                {/*                {value: '2', label: '策略二'},*/}
                {/*            ]}*/}
                {/*        />*/}
                {/*        <ProFormSelect*/}
                {/*            label="Pod 调度策略"*/}
                {/*            name="remark2"*/}
                {/*            width="md"*/}
                {/*            initialValue="2"*/}
                {/*            options={[*/}
                {/*                {*/}
                {/*                    value: '1',*/}
                {/*                    label: '策略一',*/}
                {/*                },*/}
                {/*                {value: '2', label: '策略二'},*/}
                {/*            ]}*/}
                {/*        />*/}
                {/*    </ProCard>*/}
                {/*</StepsForm.StepForm>*/}
            </StepsForm>
        </>
    );
};