import React from 'react';
import './styles.scss';

interface ContentContainerProps {
    children: React.ReactNode;
    className?: string;
}




export function ContentContainerLabelValue(props: ContentContainerProps){
    return (
        <span className={`content-container-label-value ${props.className || ''}`}>{props.children}</span>
    );
}

export function ContentContainerLabel(props: ContentContainerProps) {
    return (
        <p className={`content-container-label ${props.className || ''}`}>{props.children}</p>
    );
}

export function ContextContainerText_H1(props: ContentContainerProps){
    return (
        <h1 className={`content-container-text-h1 ${props.className || ''}`}>{props.children}</h1>   
    )
}

export function ContextContainerText_H2(props: ContentContainerProps){
    return (
        <h1 className={`content-container-text-h2 ${props.className || ''}`}>{props.children}</h1>   
    )
}


export default function ContentContainer(props: ContentContainerProps) {
    return (
        <div className={`content-container ${props.className || ''}`}>
            {props.children}
        </div>
    );
}
