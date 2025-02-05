import React, { forwardRef, useState } from 'react';
import { Button } from '../button/Button';
import { classNames } from '../utils/Utils';

export const InplaceDisplay = (props) => props.children;
export const InplaceContent = (props) => props.children;

export const Inplace = forwardRef((props, ref) => {
    const [activeState, setActiveState] = useState(false);
    const active = props.onToggle ? props.active : activeState;

    const shouldUseInplaceContent = (child) => child && child.props.__TYPE === 'InplaceContent';
    const shouldUseInplaceDisplay = (child) => child && child.props.__TYPE === 'InplaceDisplay';

    const open = (event) => {
        if (props.disabled) {
            return;
        }

        props.onOpen && props.onOpen(event);

        if (props.onToggle) {
            props.onToggle({
                originalEvent: event,
                value: true
            });
        }
        else {
            setActiveState(true);
        }
    }

    const close = (event) => {
        props.onClose && props.onClose(event);

        if (props.onToggle) {
            props.onToggle({
                originalEvent: event,
                value: false
            });
        }
        else {
            setActiveState(false);
        }
    }

    const onDisplayKeyDown = (event) => {
        if (event.key === 'Enter') {
            open(event);
            event.preventDefault();
        }
    }

    const createDisplay = (content) => {
        const className = classNames('p-inplace-display', {
            'p-disabled': props.disabled
        });

        return (
            <div className={className} onClick={open} onKeyDown={onDisplayKeyDown} tabIndex={props.tabIndex} aria-label={props.ariaLabel}>
                {content}
            </div>
        )
    }

    const createCloseButton = () => {
        if (props.closable) {
            return <Button type="button" className="p-inplace-content-close" icon="pi pi-times" onClick={close} />
        }

        return null;
    }

    const createContent = (content) => {
        const closeButton = createCloseButton();

        return (
            <div className="p-inplace-content">
                {content}
                {closeButton}
            </div>
        )
    }

    const createChildren = () => {
        return (
            React.Children.map(props.children, (child) => {
                if (active && shouldUseInplaceContent(child)) {
                    return createContent(child);
                }
                else if (!active && shouldUseInplaceDisplay(child)) {
                    return createDisplay(child);
                }
            })
        );
    }

    const children = createChildren();
    const className = classNames('p-inplace p-component', {
        'p-inplace-closable': props.closable
    }, props.className);

    return (
        <div className={className}>
            {children}
        </div>
    )
});

InplaceDisplay.defaultProps = {
    __TYPE: 'InplaceDisplay'
}

InplaceContent.defaultProps = {
    __TYPE: 'InplaceContent'
}

Inplace.defaultProps = {
    __TYPE: 'Inplace',
    style: null,
    className: null,
    active: false,
    closable: false,
    disabled: false,
    tabIndex: 0,
    ariaLabel: null,
    onOpen: null,
    onClose: null,
    onToggle: null
}
