import React, { useState } from "react"
import PaymentContext from "./paymentHistoryContext"


const PaymentState = (prop) => {

    const [commissionData, setCommissionData] = useState([])

    return (
        <PaymentContext.Provider value={{ commissionData, setCommissionData }} >
            {prop.children}
        </PaymentContext.Provider>
    )



}

export default PaymentState