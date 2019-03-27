import React from 'react';
import { Animated, ViewProps, LayoutChangeEvent, LayoutRectangle } from 'react-native';
/**
 * -----------+------------------------+
 * <- phase ->|<-- lambda  -->|        |______
 *            |   /\          |   /\   |  ^
 *            |  /..\         |  /..\  | amplitude
 *            | /....\        | /....\ |  |
 *            |/......\       |/......\|__V___
 *            |........\      /........|
 *            |.........\    /.........|
 *            |..........\  /..........|
 *            |...........\/...........|
 * -----------+------------------------+
 */
export interface WaveAnimOption {
    period?: number;
    reverse?: boolean;
    easing?: (value: number) => number;
    useNativeDriver?: boolean;
}
export interface WaveParams {
    amplitude: number;
    lambda: number;
    phase: number;
    fill: string;
    animOptions?: WaveAnimOption;
}
export interface WaveProps extends ViewProps {
    waveParams: WaveParams[];
    onLayoutWave?: () => void;
}
interface WaveState {
    boundingbox: LayoutRectangle;
}
export declare class Wave extends React.PureComponent<WaveProps, WaveState> {
    startAnimation: () => void;
    stopAnimation: () => void;
    isAnimating: () => boolean;
    protected onLayoutContainer: (evt: LayoutChangeEvent) => void;
    protected _canvas: React.ReactElement<any>;
    protected _waves: React.ReactElement<any>[];
    protected _maxAmplitude: number;
    protected _maxLambda: number;
    protected _animValues: Animated.Value[];
    protected _animations: Animated.CompositeAnimation[];
    protected _animating: boolean;
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    _onLayoutContainer(evt: LayoutChangeEvent): void;
    _reset(): void;
    _calcMaxParam(): void;
    _getWaves(): React.ReactElement<any>[];
    _getCanvas(): React.ReactElement<any>;
    _isAnimating(): boolean;
    _startAnimation(): void;
    _stopAnimation(): void;
}
export {};
