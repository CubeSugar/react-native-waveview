'use strict';

import React from 'react';
import {
    View,
    Animated,
    StyleSheet,
    LayoutChangeEvent,
    LayoutRectangle,
    StyleProp,
    ViewStyle,
}from 'react-native';

import {
    WaveParams,
    Wave,
} from './wave';

/**
 * 
 *              __________________________
 *              |                        |
 *             /|        backView       /|
 *            / |                      / |
 *          ./__|____________________./  |
 *          |   /\              /\   |   |
 *          |  /..\            /..\  |   |
 *          | /....\   Wave   /....\ |   |
 *          |/......\        /......\|   |
 *          |........\      /........|   |
 *          |.........\    /.........|   |
 *          |..........\  /..........|  /|
 *          |...........\/...........| / |
 *   _____  |________________________|/| |
 *     |      |                        | |
 *     |      |                        | |
 * tideHeight |        foreView        |_|
 *     |      |                        | /
 *    _|_     |________________________|/
 */

interface TideProps {
    style?: StyleProp<ViewStyle>
    animValue: Animated.Value; 
    waveParams: WaveParams[];
    onLayoutWave?: () => void;
    waveRef?: (ref: Wave) => void;
}

interface TideState {
    boundingbox: LayoutRectangle;
}

export class Tide extends React.PureComponent<TideProps, TideState> {
    protected onLayoutContainer: (evt: LayoutChangeEvent) => void;
    protected _waveTranslateY: Animated.AnimatedInterpolation;
    protected _waveScaleY: Animated.AnimatedInterpolation;
    protected _foreViewTranslateY: Animated.AnimatedInterpolation;

    constructor(props) {
        super(props);

        this.state = {
            boundingbox: null,
        };

        this.onLayoutContainer = this._onLayoutContainer.bind(this);
    }

    render() {
        const {
            style,
            waveParams,
            onLayoutWave,
            waveRef,
        } = this.props;
        const {
            boundingbox,
        } = this.state;
        return (
            <View
                style={StyleSheet.flatten([style, {
                    overflow: 'hidden',
                    //justifyContent: 'flex-end',
                    //alignItems: 'stretch',
                }])}
                onLayout={this.onLayoutContainer}
            >
                {!!boundingbox && <Animated.View
                    style={{
                        backgroundColor: waveParams[waveParams.length - 1].fill,
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: '100%',
                        height: '100%',
                        transform: [
                            {translateY: this._foreViewTranslateY},
                        ],
                    }}
                />}
                {!!boundingbox && <Wave
                    //@ts-ignore
                    style={{
                        width: boundingbox.width,
                        height: boundingbox.height * 0.2,
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        transform: [
                            {translateY: this._waveTranslateY},
                            {scaleY: this._waveScaleY},
                        ]
                    }}
                    ref={waveRef}
                    waveParams={waveParams}
                    onLayoutWave={onLayoutWave}
                />}

            </View>
        );
    }

    _reset() {
    }

    _onLayoutContainer(evt: LayoutChangeEvent) {
        const {
            nativeEvent: {
                layout,
            }
        } = evt;
        const {animValue} = this.props;
        const {boundingbox} = this.state;
        if (!boundingbox || (boundingbox.width !== layout.width) || (boundingbox.height !== layout.height)) {
            this._reset();
            this._waveTranslateY = animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -0.875 * layout.height],
                extrapolate: 'clamp',
            });
            this._waveScaleY = animValue.interpolate({
                inputRange: [0.6, 1],
                outputRange: [1, 0.25],
                extrapolate: 'clamp',
            });
            this._foreViewTranslateY = animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [layout.height, 0.025 * layout.height],
                extrapolate: 'clamp',
            });

            this.setState(() => {
                return {
                    boundingbox: layout,
                }
            });

            console.log(`[Tide] ${layout}`);
            console.log(layout); 
        }
    }

}