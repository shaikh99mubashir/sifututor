import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

function JBCity() {
  return (
    <Svg
      width={46}
      height={46}
      viewBox="0 0 46 46"
      fill="none"
    >
      <Circle cx={23} cy={23} r={20} fill="#1FB6C0" />
      <Circle
        cx={23}
        cy={23}
        r={21.5}
        stroke="#1FB6C0"
        strokeOpacity={0.5}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Path
        d="M23 13.833a7.333 7.333 0 00-7.333 7.334c0 4.95 6.462 10.541 6.737 10.78a.917.917 0 001.192 0c.32-.239 6.737-5.83 6.737-10.78A7.333 7.333 0 0023 13.833zm0 16.18c-1.953-1.834-5.5-5.785-5.5-8.846a5.5 5.5 0 1111 0c0 3.061-3.547 7.021-5.5 8.845zM23 17.5a3.667 3.667 0 100 7.333 3.667 3.667 0 000-7.333zm0 5.5a1.834 1.834 0 110-3.668A1.834 1.834 0 0123 23z"
        fill="#fff"
      />
    </Svg>
  )
}

export default JBCity
