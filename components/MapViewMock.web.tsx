import React from 'react';
import { View } from 'react-native';

const MapView = (props: any) => <View {...props}>{props.children}</View>;
export const Marker = (props: any) => <View {...props}>{props.children}</View>;
export const Polygon = (props: any) => <View {...props}>{props.children}</View>;

export default MapView;
