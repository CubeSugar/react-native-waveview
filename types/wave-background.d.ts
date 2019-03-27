import React from 'react';
import { WaveProps, Wave } from './wave';
interface WaveBackgroundProps extends WaveProps {
    waveRef?: (ref: Wave) => void;
}
export declare class WaveBackground extends React.PureComponent<WaveBackgroundProps> {
    render(): JSX.Element;
}
export {};
