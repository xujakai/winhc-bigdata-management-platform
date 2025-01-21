import React, {useState} from 'react';
import {AutoComplete, Flex} from 'antd';
import {AreaCodeDataType} from "../../data_types/AreaCodeDataTypes"
import {searchAreaPrefix} from "../../api/WinhcAreaCodeApi";


interface ChildComponentProps {
    sendDataToParent: (index: number, data: AreaCodeDataType) => void;  // 父组件传递的回调函数
    clearDataToParent: (index: number) => void;  // 父组件传递的回调函数
    index: number;
    sendValueToParent?: (value: string) => void;
    style?: React.CSSProperties
    initValue?: string | null
}


const Title: React.FC<Readonly<{ title?: string }>> = (props) => (
    <Flex align="center" justify="space-between">
        {props.title}
    </Flex>
);

const renderItem = (area_code: AreaCodeDataType) => ({
    value: area_code.area_code,
    label: (
        <Flex align="center" justify="space-between">
            ({area_code.area_code}){area_code.city}-{area_code.district}
        </Flex>
    ),
});


const App: React.FC<ChildComponentProps> = ({
                                                sendDataToParent,
                                                clearDataToParent,
                                                sendValueToParent,
                                                index,
                                                style,
                                                initValue
                                            }) => {
    const [search_options, setSearchOptions] = useState<any[]>([]);
    const [search_result, setSearchResult] = useState<AreaCodeDataType[]>([]);

    const selectAreaCode = (value: string, option: any) => {

        console.log("search_result:", search_result)
        console.log("click:", value, option)
        sendDataToParent(index, search_result.filter(e => e.area_code === value).pop() as AreaCodeDataType);
    }

    const cleanAreaCode = () => {
        clearDataToParent(index);
    }

    const onChange = (value: string) => {
        console.log('input val: ', value)
        if (sendValueToParent) {
            sendValueToParent(value)
        }
    }

    const searchAreaCode = (value: string) => {
        searchAreaPrefix<{ [key: string]: AreaCodeDataType[] }>(value).then(data => {
            let tmpOptions: any[];
            tmpOptions = []
            Object.entries(data).forEach(([key, value]) => {
                let tmpO: any[] = [];
                value.forEach(v => {
                    tmpO.push(renderItem(v))
                    setSearchResult((prevItems) => [...prevItems, v])
                });
                tmpOptions.push(
                    {
                        label: <Title title={key}/>,
                        options: tmpO,
                    }
                )
            });
            setSearchOptions(tmpOptions)
        });
    };


    return (
        <AutoComplete
            value={initValue}
            style={{...style}}
            onChange={onChange}
            popupClassName="certain-category-search-dropdown"
            options={search_options}
            onSearch={searchAreaCode}
            onSelect={selectAreaCode}
            onClear={cleanAreaCode}
            placeholder="输入area_code"
        />
    )
}


export default App;