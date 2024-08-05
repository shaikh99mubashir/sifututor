import * as React from "react"
import Svg, { Path } from "react-native-svg"

function FilterIcon() {
  return (
    <Svg
      width={23}
      height={23}
      viewBox="0 0 16 19"
      fill="none"
    >
      <Path
        d="M15.6.2c-.2-.1-.4-.2-.6-.2H1C.8 0 .6.1.4.2.2.4 0 .6 0 .9c0 .3 0 .5.2.7L5 7.8v5.6c0 .2.1.3.2.4l4 4c.4.4 1 .4 1.4 0 .2-.2.3-.5.3-.8V7.8l4.8-6.1c.3-.3.3-.5.3-.8 0-.3-.2-.5-.4-.7zM9 7v7.5l-2-2V7.1L3 2h10L9 7z"
        fill="#000"
      />
    </Svg>
  )
}

export default FilterIcon
