'use strict';

import React from 'react';
import {
    View,
    Animated,
    StyleSheet,
    Easing,
} from 'react-native';
import Svg, {
    G,
    Path,
} from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

/**
 * ---------+------------------------+
 * <-- P -->|<--    T    -->|        |______
 *          |   /\          |   /\   |  ^
 *          |  /  \         |  /  \  |  A
 *          | /    \        | /    \ |  |
 *          |/      \       |/      \|__V___
 *          |        \      /        |  ^
 *          |         \    /         |  |
 *          |          \  /          |  |
 *          |           \/           |  H
 *          |                        |  |
 *          |                        |  |
 * ---------+------------------------+__V___
 */

/**
 * @class Wave
 *
 * @prop {Number} H water level
 * @prop {Array} waveParams list of params: {A, T, fill}
 * @prop {bool} animated
 * @prop {string} direction
 */
class Wave extends React.PureComponent {
    constructor(props) {
        super(props);

        let {H, waveParams, animated, direction = "left"} = this.props;

        this.state = {
            H,
            waveParams,
            direction: direction === "left" ? -1 : 1,
        };

        this._animValues = [];
        this._animations = [];
        this._animated = animated || false;

        for (let i = 0; i < this.state.waveParams.length; i++) {
            this._animValues.push(new Animated.Value(0));
        }
    }

    componentDidMount() {
        this._animated && this.startAnim();
    }

    componentWillUnmount() {
        this.stopAnim();
        this._animValues = null;
        this._animations = null;
    }

    render() {
        let {style} = this.props;
        let {H, waveParams, direction} = this.state;

        let waves = [];

        for (let i = 0; i < waveParams.length; i++) {
            let {A, T, fill} = waveParams[i];
            let translateX = this._animValues[i].interpolate({
                inputRange: [0, 1],
                outputRange: [0, 2 * T * direction],
            });
            let wave = (
                <AnimatedSvg
                    key={i}
                    style={[{
                        width: 3 * T,
                        height: A + H,
                        position: 'absolute',
                        bottom: 0,
                        transform: [{ translateX }],
                    }, (direction === -1 ? { left: 0 }: { right: 0})]}
                    preserveAspectRatio="xMinYMin meet"
                    viewBox={`0 0 ${3 * T} ${A + H}`}
                >
                    <Path
                        d={`M 0 0 Q ${T / 4} ${-A} ${T / 2} 0 T ${T} 0 T ${3 * T / 2} 0 T ${2 * T} 0 T ${5 * T / 2} 0 T ${3 * T} 0 V ${H} H 0 Z`}
                        fill={fill}
                        transform={`translate(0, ${A})`}
                    />
                </AnimatedSvg>
            );
            waves.push(wave);
        }

        return (
            <View style={style} >
                {waves}
            </View>
        );
    }

    setWaveParams(waveParams) {
        if (!waveParams) return;

        let animated = this._animated;
        let newWaveCount = waveParams.length;
        let oldWaveCount = this.state.waveParams.length;
        if (animated) {
            this.stopAnim();
            for (let v of this._animValues) {
                v.setValue(0);
            }
        }
        if (newWaveCount !== oldWaveCount) {
            this._animValues = [];
            for (let i = 0; i < waveParams.length; i++) {
                this._animValues.push(new Animated.Value(0));
            }
        }

        this.setState({
            waveParams,
        }, ()=>{
            if (animated) {
                this.startAnim();
            }
        });
    }

    setWaterHeight(H) {
        this.setState({H});
    }

    startAnim() {
        this.stopAnim();

        const {
          speed = 5000,
          speedIncreasePerWave = 1000,
          easing = 'linear'
        } = this.props

        for (let i = 0; i < this._animValues.length; i++) {
            let anim = Animated.loop(Animated.timing(this._animValues[i], {
                toValue: 1,
                duration: speed + i * speedIncreasePerWave,
                easing: Easing[easing],
                useNativeDriver: true,
            }));
            this._animations.push(anim);
            anim.start();
        }
        this._animated = true;
    }

    stopAnim() {
        for (let _anim of this._animations) {
            _anim.stop();
            _anim = null;
        }
        this._animations = [];
        this._animated = false;
    }
};

export default Wave;
