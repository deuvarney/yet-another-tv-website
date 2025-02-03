import React, {ReactNode, useRef} from 'react';

type ArrowStepperPropType = {
    classLocator?: string;
    styles?: Record<string, string>
    children: ReactNode;
}


function ArrowStepper(props: ArrowStepperPropType) {
    const classLocator = props.classLocator || 'focusable';
    const arrowStepper = useRef<HTMLElement>(null);
    const styles = props.styles || {};

    const onKeyDown = (evt: React.KeyboardEvent) => {
        // TODO: Use centralized keyCode component
        if (evt.key === 'ArrowDown') {
            evt.stopPropagation();
            evt.preventDefault();
            const focusableElements = arrowStepper.current?.querySelectorAll(`.${classLocator}`) || [];
            for ( let i = 0; i<focusableElements.length; i++ ) {
                if (document.activeElement === focusableElements[i]) {
                    ((focusableElements[i+1] || focusableElements[0]) as HTMLElement).focus();
                    return;
                }
            }
        }

        if (evt.key === 'ArrowUp') {
            evt.stopPropagation();
            evt.preventDefault();
            const focusableElements = arrowStepper.current?.querySelectorAll(`.${classLocator}`) || [];
            for ( let i = 0; i<focusableElements.length; i++ ) {
                if (document.activeElement === focusableElements[i]) {
                    const element = (focusableElements[i-1] || focusableElements[focusableElements.length - 1] || focusableElements[0]);
                    (element as HTMLElement).focus();
                    return;
                }
            }
        }
    };

    return (
        <span ref={arrowStepper} tabIndex={-1} style={styles} onKeyDown={onKeyDown}>
            {props.children}
        </span>
    );
}

export default ArrowStepper;
