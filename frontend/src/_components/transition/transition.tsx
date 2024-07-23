// components/TransitionWrapper.tsx

import React from 'react';
import styles from './transitions.module.css';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

interface TransitionWrapperProps {
    children: React.ReactNode;
    inProp: boolean;
}

const TransitionWrapper: React.FC<TransitionWrapperProps> = ({ children, inProp }) => {
    return (
        <TransitionGroup>
        {inProp && (
            <CSSTransition
            timeout={500}
            classNames={{
                enter: styles.fadeEnter,
                enterActive: styles.fadeEnterActive,
                exit: styles.fadeExit,
                exitActive: styles.fadeExitActive,
            }}
            >
            {children}
            </CSSTransition>
        )}
        </TransitionGroup>
    );
};

export default TransitionWrapper;
