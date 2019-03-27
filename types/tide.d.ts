import React from 'react';
import { Animated, LayoutChangeEvent, LayoutRectangle, StyleProp, ViewStyle } from 'react-native';
import { WaveParams, Wave } from './wave';
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
    style?: StyleProp<ViewStyle>;
    animValue: Animated.Value;
    waveParams: WaveParams[];
    onLayoutWave?: () => void;
    waveRef?: (ref: Wave) => void;
}
interface TideState {
    boundingbox: LayoutRectangle;
}
export declare class Tide extends React.PureComponent<TideProps, TideState> {
    protected onLayoutContainer: (evt: LayoutChangeEvent) => void;
    protected _waveTranslateY: Animated.AnimatedInterpolation;
    protected _waveScaleY: Animated.AnimatedInterpolation;
    protected _foreViewTranslateY: Animated.AnimatedInterpolation;
    constructor(props: any);
    render(): JSX.Element;
    _reset(): void;
    _onLayoutContainer(evt: LayoutChangeEvent): void;
}
export {};
