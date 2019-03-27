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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import React from 'react';
import { View, StyleSheet, } from 'react-native';
import { Wave, } from './wave';
var WaveBackground = /** @class */ (function (_super) {
    __extends(WaveBackground, _super);
    function WaveBackground() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WaveBackground.prototype.render = function () {
        var _a = this.props, style = _a.style, children = _a.children, waveRef = _a.waveRef, otherProps = __rest(_a, ["style", "children", "waveRef"]);
        return (<View style={style}>
                <Wave style={StyleSheet.absoluteFill} ref={waveRef} {...otherProps}/>
                {children}
            </View>);
    };
    return WaveBackground;
}(React.PureComponent));
export { WaveBackground };
