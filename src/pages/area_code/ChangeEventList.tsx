import React, {useEffect, useState} from 'react';
import {Button, Descriptions, DescriptionsProps, message, Modal, Pagination, Timeline, Tooltip} from 'antd';
import {getChangeList, releaseSnapshot, revokeEvent} from "../../api/WinhcAreaCodeApi";
import {ChangeEventDataType} from "../../data_types/ChangeEventDataType";
import {TimelineItemProps} from "antd/es/timeline/TimelineItem";
import {ProCard, ProFormField} from "@ant-design/pro-components";
import {getSnapshotByTimeRange, revokeLatestReleaseSnapshot} from "../../api/WinhcReleaseSnapshotApi";
import {ReleaseSnapshotDataType} from "../../data_types/ReleaseSnapshotDataType";
import {findMax, findMin} from "../../utils/ArrayUtils";
import {addProperty} from "../../utils/ObjectUtils";
import {CheckCircleOutlined,} from '@ant-design/icons';
import {Simulate} from "react-dom/test-utils";
import ShowHttpResultComponent from "../common/ShowHttpResultComponent";
import ButtonTooltip from "../common/ButtonTooltipComponent";

interface RenderDataType {
    time: string,
    type: string,
    data: ChangeEventDataType | ReleaseSnapshotDataType
}

const event_mapping: Map<string, string> = new Map([
    ["AREA_CHANGE", "区划变更"],
    ["SHOW_VIEW", "展示字段变更"],
    ["SHOW_LEVEL", "显示顺序层级变更"]
]);

const getSnapshotShowCard = (data: ReleaseSnapshotDataType, opt?: React.ReactNode) => {
    const items: DescriptionsProps['items'] = [
        {
            // key: data.event_id + '_eventId',
            label: '事件ID',
            children: data.id,
        },
        {
            // key: data.event_id + '_event_type',
            label: '版本号',
            span: 'filled',
            children: data.release_version,
        },

        {
            // key: data.event_id + '_chain',
            label: '详情',
            span: 'filled',
            children: <>
                { noticeModal(data.change_chain, '变更路径【数据端使用】')}
                { noticeModal(data.compatible_content, '变更详情【后端使用】')}
                {<ShowHttpResultComponent inlineNode={"通用数据结构【全字段】"} requestInfo={{
                    method:"GET",
                    url:"/snapshot/area_code?source=common"
                }} responseHandler={(e)=>{
                    return {
                        title:'通用结构：/snapshot/area_code?source=common',
                        content:
                            <ProFormField
                                ignoreFormItem
                                fieldProps={{
                                    style: {
                                        width: '100%',
                                    },
                                }}
                                mode="read"
                                valueType="jsonCode"
                                text={JSON.stringify(e)}
                            />
                    }
                }}/> }
            </>,
        },

    ];

    if (opt) {
        items.push({
            // key: data.event_id + '_opt',
            label: '操作',
            children: opt,
        },)
    }

    return <>
        <Descriptions bordered items={items}/>
    </>
}
const getEventShowCard = (data: ChangeEventDataType, opt?: React.ReactNode) => {
    const items: DescriptionsProps['items'] = [
        {
            // key: data.event_id + '_eventId',
            label: '事件ID',
            children: data.event_id,
        },
        {
            // key: data.event_id + '_event_type',
            label: '事件类型',
            children: event_mapping.get(data.event_type),
            span: 'filled',
        },

        {
            // key: data.event_id + '_chain',
            label: '详细信息',
            span: 'filled',
            children: <>
                {noticeModal(data.change_chain, '变更路径【数据端使用】')}
            </>,
        },

    ];

    if (opt) {
        items.push({
            // key: data.event_id + '_opt',
            label: '操作',
            children: opt,
        },)
    }

    return <>
        <Descriptions bordered items={items}/>
    </>
}
const noticeModal = (content: string, title: string) => {
    const onClick = ()=>{
        Modal.info({
            title: title,
            content: (
                <ProCard  style={{width: '100%', height: 300, overflowY: 'auto'}}>
                    <ProFormField
                        ignoreFormItem
                        fieldProps={{
                            style: {
                                width: '100%',
                            },
                        }}
                        mode="read"
                        valueType="jsonCode"
                        text={content}
                    /></ProCard>
            ),
            width:1000,
            onOk() {
            },
        });
    }

    return <>
        <Button onClick={onClick}>{title}</Button>
    </>
};


const App: React.FC = () => {
    const [changeEventData, setChangeEventData] = useState<ChangeEventDataType[]>([])
    const [releaseSnapshotData, setReleaseSnapshotData] = useState<ReleaseSnapshotDataType[]>([])

    const [itemsData, setItemsData] = useState<TimelineItemProps[]>([]);

    const [timeRangeMax, setTimeRangeMax] = useState<string | null>(null);
    const [timeRangeMin, setTimeRangeMin] = useState<string | null>(null);


    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState<number>(0);
    const [reload, setReload] = useState<boolean>(true);

    const [releaseSnapshotFlag, setReleaseSnapshotFlag] = useState<boolean>(false);
    const [releaseSnapshotLoadingText, setReleaseSnapshotLoadingText] = useState<string>("发布快照");


    const getRevokeButton = (ableRevoke: boolean, lable: string, id: string | number, onClickFunc: (id: string | number) => void) => {
        return <>
            <ButtonTooltip title={ableRevoke ? null : `请按次序${lable}`} disabled={!ableRevoke}
                           onClick={() => onClickFunc(id)} inlineNode={`撤销${lable}`}/>
        </>
    }


    const revokeEventLog = (event_id: string | number) => {
        revokeEvent(event_id as string).then(e => {
            message.success(e);
            setReload(!reload);
        })
    }

    const revokeReleaseSnapshot = (event_id: string | number) => {
        revokeLatestReleaseSnapshot('area_code').then(e => {
            message.success(e);
            setReload(!reload)
        })
    }

    const pageChange = (page: number, pageSize: number) => {
        // message.success(`${page}, ${pageSize}`);
        setPage(page);
        setPageSize(pageSize)
    }

    useEffect(() => {
        let ced = changeEventData.map(v => {
            return {
                time: v.create_time,
                type: 'event',
                data: v
            }
        })
        let rsd = releaseSnapshotData.map(v => {
            return {
                time: v.create_time,
                type: 'snapshot',
                data: v
            }
        })


        let allData = [...ced, ...rsd]
        allData.sort((a, b) => {
            // return b.time.localeCompare(a.time)
            return a.time.localeCompare(b.time)
        })
        console.log("allData", allData)

        let minTimeRange = findMin(allData.filter(e => e.type === 'event'), (item) => item.time);
        let maxTimeRange = findMax(allData.filter(e => e.type === 'event'), (item) => item.time);
        if (minTimeRange && minTimeRange.time !== timeRangeMin) {
            setTimeRangeMin(minTimeRange.time);
        }
        if (maxTimeRange && maxTimeRange.time !== timeRangeMax) {
            setTimeRangeMax(maxTimeRange.time);
        }

        console.log('timeRangeMax:', maxTimeRange?.time, 'timeRangeMin', minTimeRange?.time);

        setReleaseSnapshotFlag(allData.at(-1)?.type !== 'event')

        let tmp_data = [];
        for (let i = 0; i < allData.length; i++) {
            let e = allData[i];
            let revokeFlag = i === allData.length - 1;
            let timeLineItem = {
                // key: e.data.event_id,
                label: e.data.create_time,
            }
            if (e.type === 'snapshot') {
                let snapshotEventData = e.data as ReleaseSnapshotDataType
                timeLineItem = addProperty(timeLineItem, 'dot', <><CheckCircleOutlined/></>)
                timeLineItem = addProperty(timeLineItem, 'color', 'green')
                timeLineItem = addProperty(timeLineItem, 'children', getSnapshotShowCard(snapshotEventData, getRevokeButton(revokeFlag, "发布", snapshotEventData.id, revokeReleaseSnapshot)))

            } else if (e.type === 'event') {
                let changeEventData = e.data as ChangeEventDataType
                timeLineItem = addProperty(timeLineItem, 'children', getEventShowCard(changeEventData, getRevokeButton(revokeFlag, "变更", changeEventData.event_id, revokeEventLog)))
            }

            tmp_data.push(timeLineItem)
        }


        setItemsData(tmp_data)

    }, [changeEventData, releaseSnapshotData])


    useEffect(() => {
        getChangeList().then(
            e => {
                setChangeEventData(e.records)
                setTotal(e.total)
            }
        )
        return () => {
            setItemsData([])
        }
    }, [page, pageSize, reload]); //不监听，只加载一次

    useEffect(() => {
        if (timeRangeMin == null && timeRangeMax == null) {
            return
        }
        console.log('useEffect===>  timeRangeMax:', timeRangeMax, 'timeRangeMin', timeRangeMin);
        getSnapshotByTimeRange('area_code', timeRangeMin, timeRangeMax).then(e => {
            setReleaseSnapshotData(e)
        })
    }, [timeRangeMax, timeRangeMin, reload]);//监听时间范围变化


    return (
        <>

            <Timeline
                style={{
                    // transform: 'translateX(-500px)',
                }}
                mode={'alternate'}
                items={itemsData}
                pending={page === 1}
                pendingDot={<Button onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
                    setReleaseSnapshotLoadingText('Loading')
                    releaseSnapshot().then(e => {
                        setReload(!reload);
                        setReleaseSnapshotLoadingText('发布快照')
                    })
                }} disabled={releaseSnapshotFlag}
                                    loading={releaseSnapshotLoadingText === 'Loading'}>{releaseSnapshotLoadingText}</Button>}
                reverse={true}
            />

            <Pagination total={total} onChange={pageChange} align={'center'} defaultCurrent={page}/>
        </>
    );
};

export default App;