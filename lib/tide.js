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
import { View, Animated, StyleSheet, } from 'react-native';
import { Wave, } from './wave';
var Tide = /** @class */ (function (_super) {
    __extends(Tide, _super);
    function Tide(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            boundingbox: null
        };
        _this.onLayoutContainer = _this._onLayoutContainer.bind(_this);
        return _this;
    }
    Tide.prototype.render = function () {
        var _a = this.props, style = _a.style, waveParams = _a.waveParams, onLayoutWave = _a.onLayoutWave, waveRef = _a.waveRef;
        var boundingbox = this.state.boundingbox;
        return (<View style={StyleSheet.flatten([style, {
                overflow: 'hidden'
            }])} onLayout={this.onLayoutContainer}>
                {!!boundingbox && <Animated.View style={{
            backgroundColor: waveParams[waveParams.length - 1].fill,
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            transform: [
                { translateY: this._foreViewTranslateY },
            ]
        }}/>}
                {!!boundingbox && <Wave 
        //@ts-ignore
        style={{
            width: boundingbox.width,
            height: boundingbox.height * 0.2,
            position: 'absolute',
            left: 0,
            bottom: 0,
            transform: [
                { translateY: this._waveTranslateY },
                { scaleY: this._waveScaleY },
            ]
        }} ref={waveRef} waveParams={waveParams} onLayoutWave={onLayoutWave}/>}

            </View>);
    };
    Tide.prototype._reset = function () {
    };
    Tide.prototype._onLayoutContainer = function (evt) {
        var layout = evt.nativeEvent.layout;
        var animValue = this.props.animValue;
        var boundingbox = this.state.boundingbox;
        if (!boundingbox || (boundingbox.width !== layout.width) || (boundingbox.height !== layout.height)) {
            this._reset();
            this._waveTranslateY = animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -0.875 * layout.height],
                extrapolate: 'clamp'
            });
            this._waveScaleY = animValue.interpolate({
                inputRange: [0.6, 1],
                outputRange: [1, 0.25],
                extrapolate: 'clamp'
            });
            this._foreViewTranslateY = animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [layout.height, 0.025 * layout.height],
                extrapolate: 'clamp'
            });
            this.setState(function () {
                return {
                    boundingbox: layout
                };
            });
            console.log("[Tide] " + layout);
            console.log(layout);
        }
    };
    return Tide;
}(React.PureComponent));
export { Tide };
