import * as React from "react"
import Svg, { Circle, G, Path, Defs, ClipPath } from "react-native-svg"

function JBLevel() {
  return (
    <Svg
      width={46}
      height={46}
      viewBox="0 0 46 46"
      fill="none"
    >
      <Circle cx={23} cy={23} r={20} fill="#961FC0" />
      <Circle
        cx={23}
        cy={23}
        r={21.5}
        stroke="#961FC0"
        strokeOpacity={0.5}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <G clipPath="url(#clip0_269_1917)">
        <Path
          d="M23.4 31.05h-6.65V28.2h5.7v-9.5H19.6l4.275-4.75 4.275 4.75H25.3v10.45a1.9 1.9 0 01-1.9 1.9z"
          fill="#fff"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_269_1917">
          <Path fill="#fff" transform="rotate(-90 22 10)" d="M0 0H19V19H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default JBLevel
