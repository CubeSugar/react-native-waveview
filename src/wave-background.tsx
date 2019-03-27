'use strict';

import React from 'react';
import {
    View,
    StyleSheet,
}from 'react-native';

import {
    WaveProps,
    Wave,
} from './wave';

interface WaveBackgroundProps extends WaveProps {
    waveRef?: (ref: Wave) => void;
}
export class WaveBackground extends React.PureComponent<WaveBackgroundProps> {
    render() {
        const {
            style,
            children,
            waveRef,
            ...otherProps
        } = this.props;
        return (
            <View
                style={style}
            >
                <Wave
                    style={StyleSheet.absoluteFill}
                    ref={waveRef}
                    {...otherProps}
                />
                {children}
            </View>
        );
    }
}