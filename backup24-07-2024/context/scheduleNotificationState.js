import React, { useState } from "react"
import ScheduleNotificationContext from "./scheduleNotificationContext"

const ScheduleNotificationState = (prop) => {

    const [scheduleNotification, setScheduleNotification] = useState([])


    return (
        <ScheduleNotificationContext.Provider value={{ scheduleNotification, setScheduleNotification }} >
            {prop.children}
        </ScheduleNotificationContext.Provider>
    )



}

export default ScheduleNotificationState