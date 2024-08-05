import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"
import { Theme } from "../../constant/theme"

function FilterIconTick() {
  return (
    <Svg
      width={26}
      height={26}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Circle cx={19} cy={16} r={5} fill={Theme.darkGray}/>
      <Path
        d="M17.6 3.2c-.2-.1-.4-.2-.6-.2H3c-.2 0-.4.1-.6.2-.2.2-.4.4-.4.7 0 .3 0 .5.2.7L7 10.8v5.6c0 .2.1.3.2.4l4 4c.4.4 1 .4 1.4 0 .2-.2.3-.5.3-.8v-9.2l4.8-6.1c.3-.3.3-.5.3-.8 0-.3-.2-.5-.4-.7zM11 10v7.5l-2-2v-5.4L5 5h10l-4 5z"
        fill="#000"
      />
      <Path
        d="M18 19.3l-2.8-3 1.2-1.2 1.6 1.6 3.6-3.6 1.1 1.4-4.7 4.8z"
        fill="#fff"
      />
    </Svg>
  )
}

export default FilterIconTick
