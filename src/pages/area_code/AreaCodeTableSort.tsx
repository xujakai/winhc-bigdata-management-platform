import React, {Dispatch, SetStateAction, useContext, useMemo} from 'react';
import {Button, message, Space} from 'antd';
import {AreaCodeDataType} from '../../data_types/AreaCodeDataTypes'
import {HolderOutlined, LeftOutlined, RightOutlined,} from '@ant-design/icons';
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {AreaCodeLevelInfo, findViewLevel, moveLevel, rebuildSort} from "../../utils/AreaCodeChangeFindUtils";

import type {SyntheticListenerMap} from '@dnd-kit/core/dist/hooks/utilities';
import {DndContext, DragEndEvent} from '@dnd-kit/core';
import {restrictToVerticalAxis} from '@dnd-kit/modifiers';
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy,} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import ButtonTooltip from "../common/ButtonTooltipComponent";

interface ChildComponentProps {
    renderColumns: ProColumns<AreaCodeDataType>[];  // 父组件传递的回调函数

    loading: boolean;
    data: AreaCodeDataType[];
    setData: Dispatch<SetStateAction<readonly AreaCodeDataType[]>>;
}


const flattenTree = (nodes: AreaCodeDataType[]): string[] => {
    return nodes.flatMap((node) => [
        node.area_code,
        ...(node.children ? flattenTree(node.children) : []),
    ]).filter(e => e !== undefined);
};


interface RowContextProps {
    setActivatorNodeRef?: (element: HTMLElement | null) => void;
    listeners?: SyntheticListenerMap;
}

const RowContext = React.createContext<RowContextProps>({});

const DragHandle: React.FC = () => {
    const {setActivatorNodeRef, listeners} = useContext(RowContext);
    return (
        <Button
            type="text"
            // size="small"
            icon={<HolderOutlined />}
            style={{
                cursor: 'move',
                height: "60%",
                width: "40%"
            }}
            ref={setActivatorNodeRef}
            {...listeners}
        />
    );
};


interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string;
}

const Row: React.FC<RowProps> = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: props['data-row-key']});


    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging ? {position: 'relative', zIndex: 9999} : {}),
    };

    const contextValue = useMemo<RowContextProps>(
        () => ({setActivatorNodeRef, listeners}),
        [setActivatorNodeRef, listeners],
    );

    return (
        <RowContext.Provider value={contextValue}>
            <tr {...props} ref={setNodeRef} style={style} {...attributes} />
        </RowContext.Provider>
    );
};


interface MoveStatusType {
    flag: boolean,
    data: AreaCodeDataType[]
}

const moveAreaCodeTree = (data: AreaCodeDataType[], activeAreaCode: string, overAreaCode: string): MoveStatusType => {
    let childrenAreaCode = data.map(e => e.area_code)
    if (childrenAreaCode.includes(activeAreaCode) && childrenAreaCode.includes(overAreaCode)) {
        const activeIndex = data.findIndex((record) => record.area_code === activeAreaCode);
        const overIndex = data.findIndex((record) => record.area_code === overAreaCode);
        let reSortData = rebuildSort(arrayMove(data, activeIndex, overIndex))
        return {flag: true, data: reSortData}
    }
    return {flag: false, data: data}
}

const updateTreeStructure = (
    nodes: AreaCodeDataType[],
    activeId: string,
    overId: string
): MoveStatusType => {

    let move = moveAreaCodeTree(nodes, activeId, overId);
    if (move.flag) {
        return move
    } else {
        for (let i = 0; i < nodes.length; i++) {
            let tmpNode = nodes[i];
            if (tmpNode.children) {
                let tmpMove = updateTreeStructure(tmpNode.children, activeId, overId);
                if (tmpMove.flag) {
                    tmpNode.children = tmpMove.data
                    nodes[i] = tmpNode
                    return {flag: true, data: nodes}
                }
            } else
                break;
        }
    }
    return move;
};


const App: React.FC<ChildComponentProps> = ({data, setData, loading, renderColumns}) => {

    const onDragEnd = ({active, over}: DragEndEvent) => {
        let tmpActiveAreaCode = active.id as string;
        let tmpOverAreaCode = over?.id as string;
        if (tmpActiveAreaCode === undefined || tmpOverAreaCode === undefined) {
            return;
        }
        if (tmpActiveAreaCode.length !== tmpOverAreaCode.length) {
            message.warning('不允许跨层级拨动排序！')
            return;
        }

        if (active.id !== over?.id) {
            setData((prevData) => {
                    let dd = prevData as AreaCodeDataType[]
                    let move = updateTreeStructure(dd, tmpActiveAreaCode, tmpOverAreaCode)
                    if (!move.flag) {
                        message.warning('不允许在不同层级间拨动排序！')
                        return prevData;
                    }
                    return [...move.data]
                }
            );
        }
    };

    const getMoveButton = (text: any, record: AreaCodeDataType, index: number) => {
        let levelInfo = findViewLevel(data, record.area_code as string, 1) as AreaCodeLevelInfo

        let leftDisabled = levelInfo.level === 1;
        let liftTitle = leftDisabled ? "已处于省级，不允许上移" : null

        let rightDisabled = levelInfo.level >= 3;
        let rightTitle = rightDisabled ? "已处于区县级，不允许下移" : null

        // let rightDisabled = levelInfo.level >= 4;
        // let rightTitle = rightDisabled ? "已处于乡镇级，不允许下移" : null
        return <Space.Compact block>
            <ButtonTooltip title={liftTitle} disabled={leftDisabled}
                           onClick={() => {
                               setData((prevState) => moveLevel(prevState as AreaCodeDataType[], record, levelInfo, true))
                           }}
                           buttonStyle={{
                               height: "90%",
                               width: "100%"
                           }}
                           inlineNode={<LeftOutlined/>}/>
            <ButtonTooltip title={rightTitle} disabled={rightDisabled}
                           onClick={() => {
                               setData((prevState) => moveLevel(prevState as AreaCodeDataType[], record, levelInfo, false))
                           }}
                           buttonStyle={{
                               height: "90%",
                               width: "100%"
                           }}
                           inlineNode={<RightOutlined/>}/>
        </Space.Compact>
    }


    return (
        <>
            <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                <SortableContext items={flattenTree(data)}
                                 strategy={verticalListSortingStrategy}>
                    <ProTable<AreaCodeDataType>
                        search={false}
                        options={false}
                        rowKey="area_code"
                        components={{body: {row: Row}}}
                        columns={[{
                            key: 'sort',
                            align: 'center',
                            width: 80,
                            readonly: true,
                            render: () => <DragHandle/>
                        }, ...renderColumns.slice(1), {
                            title: '调整展示层级',
                            key: 'move',
                            align: 'center',
                            width: 80,
                            readonly: true,
                            render: getMoveButton
                        }]}
                        dataSource={data}
                        pagination={false}
                        loading={loading}
                    />
                </SortableContext>
            </DndContext>
        </>
    );
};

export default App;



