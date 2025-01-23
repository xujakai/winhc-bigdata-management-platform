import React, {useState} from 'react';
import {AutoComplete, Flex} from 'antd';
import {AreaCodeDataType} from "../../data_types/AreaCodeDataTypes"
import {searchAreaPrefix} from "../../services/WinhcAreaCodeApi";

interface ChildComponentProps {
    sendDataToParent: (index: number, data: AreaCodeDataType) => void;
    clearDataToParent: (index: number) => void;
    index: number;
    sendValueToParent?: (value: string) => void;
    style?: React.CSSProperties;
    initValue?: string | null;
}

const Title: React.FC<{ title?: string }> = ({title}) => (
    <Flex align="center" justify="space-between">
        {title}
    </Flex>
);

const renderItem = (areaCode: AreaCodeDataType) => ({
    value: areaCode.area_code,
    label: (
        <Flex align="center" justify="space-between">
            ({areaCode.area_code}){areaCode.city}-{areaCode.district}
        </Flex>
    ),
});

const SearchAreaCode: React.FC<ChildComponentProps> = ({
    sendDataToParent,
    clearDataToParent,
    sendValueToParent,
    index,
    style,
    initValue
}) => {
    const [searchOptions, setSearchOptions] = useState<any[]>([]);
    const [searchResult, setSearchResult] = useState<AreaCodeDataType[]>([]);

    const selectAreaCode = (value: string) => {
        const selectedArea = searchResult.find(e => e.area_code === value);
        if (selectedArea) {
            sendDataToParent(index, selectedArea);
        }
    };

    const cleanAreaCode = () => {
        clearDataToParent(index);
        setSearchResult([]);
        setSearchOptions([]);
    };

    const onChange = (value: string) => {
        if (sendValueToParent) {
            sendValueToParent(value);
        }
    };

    const searchAreaCode = async (value: string) => {
        if (!value) {
            setSearchOptions([]);
            setSearchResult([]);
            return;
        }

        try {
            const data = await searchAreaPrefix<{ [key: string]: AreaCodeDataType[] }>(value);
            const options = Object.entries(data).map(([key, values]) => ({
                label: <Title title={key}/>,
                options: values.map(v => {
                    setSearchResult(prev => [...prev, v]);
                    return renderItem(v);
                }),
            }));
            setSearchOptions(options);
        } catch (error) {
            console.error('搜索区域代码失败:', error);
        }
    };

    return (
        <AutoComplete
            value={initValue}
            style={style}
            onChange={onChange}
            popupClassName="certain-category-search-dropdown"
            options={searchOptions}
            onSearch={searchAreaCode}
            onSelect={selectAreaCode}
            onClear={cleanAreaCode}
            placeholder="输入area_code"
        />
    );
};

export default SearchAreaCode;