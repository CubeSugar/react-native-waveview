# WaveView for React-Native

![](https://img.shields.io/badge/license-MIT-000000.svg)
[![npm](https://img.shields.io/npm/dm/react-native-waveview.svg)](https://www.npmjs.com/package/react-native-waveview)
[![npm](https://img.shields.io/npm/v/react-native-waveview.svg)](https://www.npmjs.com/package/react-native-waveview)
![](https://img.shields.io/badge/platform-react--native-brightgreen.svg)

## SHOWCASE

![Ball](https://github.com/CubeSugar/react-native-waveview/blob/master/showcase/wave-ball.gif?raw=true)

![Rectangle](https://github.com/CubeSugar/react-native-waveview/blob/master/showcase/wave-rect.gif?raw=true)

## DEPENDENCIES

- [React-Native-Svg](https://github.com/react-native-community/react-native-svg)

## INSTALL

1. Install react-native-svg, use

    `npm install --save react-native-svg`  or

    `yarn add react-native-svg`

2. Link react-native-svg, check [here](https://github.com/react-native-community/react-native-svg) for help.

3. `npm install --save react-native-waveview` or `yarn add react-native-waveview`

## USAGE

#### Props

name        |   type   | desc
:-----------|:--------:|:----------------
H           |  number  | BaseLine height
animated    |  bool    | animation when mounted
direction   |  string  | direction in which the waves animate: "left" (default) or "right"
waveParams  |  Array   | [{ A, T, fill}, ...]
easing      |  string  | name of easing from ReactNative#Easing
speed       |  number  | base duration in ms of one wave cycle
speedIncreasePerWave | number | increase in speed in ms per each wave

```
/**
  ---------+------------------------+
  <-- P -->|<--    T    -->|        |______
           |   /\          |   /\   |  ^
           |  /  \         |  /  \  |  A
           | /    \        | /    \ |  |
           |/      \       |/      \|__V___
           |        \      /        |  ^
           |         \    /         |  |
           |          \  /          |  |
           |           \/           |  H
           |                        |  |
           |        fill            |  |
  ---------+------------------------+__V___
*/
```

#### Methods

* setWaveParams(waveParams)

* setWaterHeight(H)

* startAnim

* stopAnim

#### Example

```JSX
<View style={_styles.container} >
    <TouchableHighlight onPress={()=>{
        // Stop Animation
        this._waveRect && this._waveRect.stopAnim();

        // set water baseline height
        this._waveRect && this._waveRect.setWaterHeight(70);

        // reset wave effect
        this._waveRect && this._waveRect.setWaveParams([
            {A: 10, T: 180, fill: '#FF9F2E'},
            {A: 15, T: 140, fill: '#F08200'},
            {A: 20, T: 100, fill: '#B36100'},
        ]);
    }}>
    <Wave
        ref={ref=>this._waveRect = ref}
        style={_styles.wave}
        H={30}
        waveParams={[
            {A: 10, T: 180, fill: '#62c2ff'},
            {A: 15, T: 140, fill: '#0087dc'},
            {A: 20, T: 100, fill: '#1aa7ff'},
        ]}
        animated={true}
    />
    </TouchableHighlight>
</View>
```

```
<View style={_styles.container} >
    <Wave
        style={_styles.waveBall}
        H={70}
        waveParams={[
            {A: 10, T: 180, fill: '#62c2ff'},
            {A: 15, T: 140, fill: '#0087dc'},
            {A: 20, T: 100, fill: '#1aa7ff'},
        ]}
        animated={true}
    />
</View>
```

```
const _styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 10,
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: StyleSheet.hairlineWidth,
    },
    wave: {
        width: 100,
        aspectRatio: 1,
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    waveBall: {
        width: 100,
        aspectRatio: 1,
        borderRadius: 50,
        overflow: 'hidden',
    }
});
```
