'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React from 'react';
import { Animated, Easing, } from 'react-native';
import Svg, { Path, } from 'react-native-svg';
var AnimatedSvg = Animated.createAnimatedComponent(Svg);
var AnimatedPath = Animated.createAnimatedComponent(Path);
;
;
;
;
var DefaultWaveAnimOption = {
    period: 2000,
    reverse: false,
    easing: Easing.linear,
    useNativeDriver: true
};
var Wave = /** @class */ (function (_super) {
    __extends(Wave, _super);
    function Wave(props) {
        var _this = _super.call(this, props) || this;
        _this.startAnimation = _this._startAnimation.bind(_this);
        _this.stopAnimation = _this._stopAnimation.bind(_this);
        _this.isAnimating = _this._isAnimating.bind(_this);
        _this.onLayoutContainer = _this._onLayoutContainer.bind(_this);
        _this._canvas = null;
        _this._waves = null;
        _this._maxAmplitude = 0;
        _this._maxLambda = 0;
        _this._animValues = [];
        _this._animations = [];
        _this._animating = false;
        _this.state = {
            boundingbox: null
        };
        console.log("[WaveView] constructor");
        return _this;
    }
    Wave.prototype.componentDidMount = function () {
    };
    Wave.prototype.componentWillUnmount = function () {
    };
    Wave.prototype.render = function () {
        var canvas = this._getCanvas();
        return (<Animated.View {...this.props} onLayout={this.onLayoutContainer}>
                {canvas}
            </Animated.View>);
    };
    Wave.prototype._onLayoutContainer = function (evt) {
        var layout = evt.nativeEvent.layout;
        var boundingbox = this.state.boundingbox;
        if (!boundingbox || (boundingbox.width !== layout.width) || (boundingbox.height !== layout.height)) {
            console.log("[Wave] onLayoutContainer");
            this._reset();
            this.setState(function () {
                return {
                    boundingbox: layout
                };
            });
        }
    };
    Wave.prototype._reset = function () {
        this._stopAnimation();
        this._canvas = null;
        this._waves = null;
        this._maxAmplitude = 0;
        this._maxLambda = 0;
        this._animValues = [];
        this._animations = [];
    };
    Wave.prototype._calcMaxParam = function () {
        var _this = this;
        var waveParams = this.props.waveParams;
        waveParams.forEach(function (param) {
            var amplitude = param.amplitude, lambda = param.lambda;
            _this._maxAmplitude = Math.max(_this._maxAmplitude, amplitude);
            _this._maxLambda = Math.max(_this._maxLambda, lambda);
        });
    };
    Wave.prototype._getWaves = function () {
        if (!this._waves) {
            var waveParams = this.props.waveParams;
            do {
                if (waveParams.length < 1)
                    break;
                this._waves = [];
                this._calcMaxParam();
                for (var i = 0; i < waveParams.length; ++i) {
                    var _a = waveParams[i], A = _a.amplitude, T = _a.lambda, _b = _a.phase, P = _b === void 0 ? 0 : _b, fill = _a.fill, _c = _a.animOptions, _d = (_c === void 0 ? {} : _c).reverse, reverse = _d === void 0 ? false : _d;
                    var animValue = new Animated.Value(0);
                    var translateX = animValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: reverse ? [-T - P, -P] : [-P, -T - P]
                    });
                    var wave = (<AnimatedPath key={"wave" + i} style={{
                        transform: [{ translateX: translateX }]
                    }} d={"M 0 0 Q " + T / 4 + " " + -A + " " + T / 2 + " 0 T " + T + " 0 T " + 3 * T / 2 + " 0 T " + 2 * T + " 0 T " + 5 * T / 2 + " 0 T " + 3 * T + " 0 V " + this._maxAmplitude + " H 0 Z"} fill={fill} y={this._maxAmplitude}/>);
                    this._animValues.push(animValue);
                    this._waves.push(wave);
                }
            } while (0);
        }
        return this._waves;
    };
    Wave.prototype._getCanvas = function () {
        if (!this._canvas) {
            do {
                var onLayoutWave = this.props.onLayoutWave;
                var boundingbox = this.state.boundingbox;
                if (!boundingbox)
                    break;
                var width = boundingbox.width, height = boundingbox.height;
                this._calcMaxParam();
                var scale = height / (this._maxAmplitude * 2);
                var waves = this._getWaves();
                this._canvas = (<AnimatedSvg style={{
                    width: this._maxLambda * 3 * scale,
                    height: height
                }} preserveAspectRatio="xMinYMid meet" viewBox={"0 0 " + 3 * this._maxLambda + " " + this._maxAmplitude * 2} onLayout={onLayoutWave}>
                        {waves}
                    </AnimatedSvg>);
            } while (0);
        }
        return this._canvas;
    };
    Wave.prototype._isAnimating = function () {
        return this._animating;
    };
    Wave.prototype._startAnimation = function () {
        this._stopAnimation();
        var waveParams = this.props.waveParams;
        do {
            if (waveParams.length < 1)
                break;
            if (this._animValues.length < 1)
                break;
            if (this._animations.length > 0)
                break;
            this._animations = [];
            for (var i = 0; i < waveParams.length; ++i) {
                var animOptions = waveParams[i].animOptions;
                var anim = null;
                if (!!animOptions) {
                    var _a = Object.assign({}, DefaultWaveAnimOption, animOptions), duration = _a.period, reverse = _a.reverse, easing = _a.easing, _b = _a.useNativeDriver, useNativeDriver = _b === void 0 ? true : _b;
                    var animValue = this._animValues[i];
                    anim = Animated.loop(Animated.timing(animValue, {
                        toValue: 1,
                        duration: duration,
                        easing: easing,
                        useNativeDriver: useNativeDriver
                    }));
                }
                this._animations.push(anim);
            }
        } while (0);
        if (this._animations.length > 0) {
            this._animating = true;
            this._animations.forEach(function (anim) { return !!anim && anim.start(); });
        }
    };
    Wave.prototype._stopAnimation = function () {
        this._animating = false;
        if (!this._animations || this._animations.length < 1)
            return;
        this._animations.forEach(function (anim) { return !!anim && anim.stop(); });
    };
    return Wave;
}(React.PureComponent));
export { Wave };
