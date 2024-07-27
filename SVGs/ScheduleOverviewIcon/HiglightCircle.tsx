import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { Theme } from '../../constant/theme';

const HiglightCircle = ({color}:any) => {
  return (
    <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <Circle cx="6" cy="6" r="6" fill={color ? color :Theme.darkGray} />
      <Circle cx="6" cy="6" r="3" fill="white" />
    </Svg>
  );
};

export default HiglightCircle;
