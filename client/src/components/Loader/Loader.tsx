import React from "react"
import loader from "@assets/imgs/loader.svg"

import "./Loader.css"

interface LoaderProps {
  isFixed: boolean
}

export const Loader: React.FC<LoaderProps> = ({ isFixed }) => {
  return (
    <div className={`loader ${isFixed ? "fixed" : "absolute"}`}>
      <img src={loader} alt="loader" />
    </div>
  )
}
