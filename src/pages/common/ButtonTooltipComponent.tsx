import React from "react";
import {Button, Tooltip} from "antd";
import {TooltipPlacement} from "antd/es/tooltip";
import type {RenderFunction} from "antd/es/_util/getRenderPropValue";

interface ButtonTooltipComponentProps {
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    disabled?: boolean;
    inlineNode?: React.ReactNode;
    placement?: TooltipPlacement;
    title?: React.ReactNode | RenderFunction;
    buttonStyle?: React.CSSProperties;
}


const ButtonTooltip: React.FC<ButtonTooltipComponentProps> = ({
                                                                  onClick,
                                                                  inlineNode,
                                                                  placement = 'top',
                                                                  title,
                                                                  disabled = false,
                                                                  buttonStyle
                                                              }) => {
    return (
        <>
            {
                title ? <Tooltip placement={placement} title={title} style={buttonStyle}> <Button disabled={disabled}
                                                                              onClick={onClick}
                                                                              style={buttonStyle?{
                                                                                  height:'100%',
                                                                                  width:'100%'
                                                                              }:undefined}
                    >{inlineNode}</Button></Tooltip> :
                    <Button onClick={onClick}
                            disabled={disabled}
                            style={buttonStyle}>{inlineNode}</Button>
            }
        </>
    )
}


export default ButtonTooltip;