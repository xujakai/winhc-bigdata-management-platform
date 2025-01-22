import React, {useEffect, useState} from "react";
import {Button, Modal, NotificationArgsProps} from 'antd';
import axiosApi from '../../api/WinhcAxios';
import {ProCard} from "@ant-design/pro-components";


type NotificationPlacement = NotificationArgsProps['placement'];


interface ShowHttpResultComponentProps {
    requestInfo: Axios.AxiosXHRConfig<any>
    responseHandler: (e: Axios.AxiosXHR<any>) => NoticeData,
    disabled?: boolean;
    inlineNode?: React.ReactNode;
    placement?: NotificationPlacement;
    buttonStyle?: React.CSSProperties;
}

interface NoticeData {
    title: React.ReactNode,
    content: React.ReactNode,
}

const ShowHttpResultComponent: React.FC<ShowHttpResultComponentProps> = ({
                                                                             requestInfo,
                                                                             responseHandler,
                                                                             inlineNode,
                                                                             placement = 'top',
                                                                             disabled = false,
                                                                             buttonStyle
                                                                         }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [args, setArgs] = useState<NoticeData | null>(null)

    const openNotification = () => {
        setLoading(true)
        setIsModalOpen(true)
        axiosApi.request(requestInfo).then(e => {
            let res = responseHandler(e)
            setArgs(res)
            setLoading(false)
        })
    };

    useEffect(() => {


    }, [args]);


    return (
        <>
            <Button disabled={disabled} style={buttonStyle} onClick={openNotification}>
                {inlineNode}
            </Button>
            <Modal loading={loading} title={args?.title} open={isModalOpen} onOk={() => setIsModalOpen(false)}
                   onCancel={() => setIsModalOpen(false)} onClose={() => setIsModalOpen(false)}
                   width={1000}
            >
                <ProCard style={{width: '100%', height: 300, overflowY: 'auto'}}>
                    {args?.content}
                </ProCard>
            </Modal>
        </>
    )
}


export default ShowHttpResultComponent;