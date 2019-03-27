'use strict';

import React from 'react';
import {
    View,
    Animated,
    StyleSheet,
    ViewProps,
    LayoutChangeEvent,
    LayoutRectangle,
    Easing,
    StyleProp,
    ViewStyle,
}from 'react-native';
import Svg, {
    Path,
} from 'react-native-svg';

const AnimatedSvg  = Animated.createAnimatedComponent(Svg);
const AnimatedPath = Animated.createAnimatedComponent(Path);

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
};

export interface WaveParams {
    amplitude: number;
    lambda: number;
    phase: number;
    fill: string;
    animOptions?: WaveAnimOption;
};

export interface WaveProps extends ViewProps {
    waveParams: WaveParams[];
    onLayoutWave?: () => void;
};

interface WaveState {
    boundingbox: LayoutRectangle;
};

const DefaultWaveAnimOption: WaveAnimOption = {
    period: 2000,
    reverse: false,
    easing: Easing.linear,
    useNativeDriver: true,
};

export class Wave extends React.PureComponent<WaveProps, WaveState> {
    public startAnimation: () => void;
    public stopAnimation: () => void;
    public isAnimating: () => boolean;

    protected onLayoutContainer: (evt: LayoutChangeEvent) => void;

    protected _canvas: React.ReactElement<any>;
    protected _waves: React.ReactElement<any>[];
    protected _maxAmplitude: number;
    protected _maxLambda: number;
    protected _animValues: Animated.Value[];
    protected _animations: Animated.CompositeAnimation[];
    protected _animating: boolean;

    constructor(props) {
        super(props);

        this.startAnimation    = this._startAnimation.bind(this);
        this.stopAnimation     = this._stopAnimation.bind(this);
        this.isAnimating       = this._isAnimating.bind(this);
        this.onLayoutContainer = this._onLayoutContainer.bind(this);

        this._canvas = null;
        this._waves = null;
        this._maxAmplitude = 0;
        this._maxLambda = 0;
        this._animValues = [];
        this._animations = [];
        this._animating = false;

        this.state = {
            boundingbox: null,
        };

        console.log("[WaveView] constructor");
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const canvas = this._getCanvas();
        return (
            <Animated.View 
                {...this.props}
                onLayout={this.onLayoutContainer}
            >
                {canvas}
            </Animated.View> 
        );
    }

    _onLayoutContainer(evt: LayoutChangeEvent) {
        const {
            nativeEvent: {
                layout,
            }
        } = evt;
        const {boundingbox} = this.state;
        if (!boundingbox || (boundingbox.width !== layout.width) || (boundingbox.height !== layout.height)) {
            console.log(`[Wave] onLayoutContainer`);
            this._reset();
            this.setState(() => {
                return {
                    boundingbox: layout,
                }
            });
        }
    }

    _reset() {
        this._stopAnimation();
        this._canvas = null;
        this._waves = null;
        this._maxAmplitude = 0;
        this._maxLambda = 0;
        this._animValues = [];
        this._animations = [];
    }

    _calcMaxParam() {
        const {waveParams} = this.props;
        waveParams.forEach((param) => {
            const {
                amplitude,
                lambda,
            } = param;
            this._maxAmplitude = Math.max(this._maxAmplitude, amplitude);
            this._maxLambda = Math.max(this._maxLambda, lambda);
        });
    }

    _getWaves(): React.ReactElement<any>[] {
        if (!this._waves) {
            const { waveParams } = this.props;
            do {
                if (waveParams.length < 1) break;

                this._waves = [];
                this._calcMaxParam();
                for (let i = 0; i < waveParams.length; ++i) {
                    const {
                        amplitude: A,
                        lambda: T,
                        phase: P = 0,
                        fill,
                        animOptions: {
                            reverse = false,
                        } = {},
                    } = waveParams[i];
                    const animValue = new Animated.Value(0);
                    const translateX = animValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: reverse ? [-T - P, -P] : [-P, -T - P],
                    });
                    const wave = (
                        <AnimatedPath
                            key={`wave${i}`}
                            style={{
                                transform: [{ translateX }],
                            }}
                            d={`M 0 0 Q ${T / 4} ${-A} ${T / 2} 0 T ${T} 0 T ${3 * T / 2} 0 T ${2 * T} 0 T ${5 * T / 2} 0 T ${3 * T} 0 V ${this._maxAmplitude} H 0 Z`}
                            fill={fill}
                            y={this._maxAmplitude}
                        />
                    );
                    this._animValues.push(animValue);
                    this._waves.push(wave);
                }
            } while(0);
        }
        return this._waves;
    }

    _getCanvas(): React.ReactElement<any> {
        if (!this._canvas) {
            do {
                const {onLayoutWave} = this.props;
                const {boundingbox} = this.state;
                if (!boundingbox) break;
                const {
                    width,
                    height,
                } = boundingbox;
                this._calcMaxParam();
                const scale = height / (this._maxAmplitude * 2);
                const waves = this._getWaves();

                this._canvas = (
                    <AnimatedSvg
                        style={{
                            width: this._maxLambda * 3 * scale,
                            height,
                        }}
                        preserveAspectRatio="xMinYMid meet"
                        viewBox={`0 0 ${3 * this._maxLambda} ${this._maxAmplitude * 2}`}
                        onLayout={onLayoutWave}
                    >
                        {waves}
                    </AnimatedSvg>
                );
            } while(0);
        }

        return this._canvas;
    }

    _isAnimating(): boolean {
        return this._animating;
    }

    _startAnimation() {
        this._stopAnimation();

        const {waveParams} = this.props;
        do {
            if (waveParams.length < 1) break;
            if (this._animValues.length < 1) break;
            if (this._animations.length > 0) break;

            this._animations = [];
            for (let i = 0; i < waveParams.length; ++i) {
                const {animOptions} = waveParams[i];
                let anim: Animated.CompositeAnimation = null;
                if (!!animOptions) {
                    const {
                        period: duration,
                        reverse,
                        easing,
                        useNativeDriver = true,
                    } = Object.assign({}, DefaultWaveAnimOption, animOptions);
                    const animValue = this._animValues[i];
                    anim = Animated.loop(Animated.timing(animValue, {
                        toValue: 1,
                        duration,
                        easing,
                        useNativeDriver,
                    }));
                }
                this._animations.push(anim);
            }
        } while (0);
        if (this._animations.length > 0) {
            this._animating = true;
            this._animations.forEach(anim => !!anim && anim.start());
        }
    }

    _stopAnimation() {
        this._animating = false;
        if (!this._animations || this._animations.length < 1) return;
        this._animations.forEach(anim => !!anim && anim.stop());
    }
}