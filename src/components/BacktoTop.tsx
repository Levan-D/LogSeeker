/** @format */

import { useState, useEffect } from "react"

const BackToTop = () => {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    })
    return window.removeEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    })
  }, [])

  const scrollToTopSmooth = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div>
      <div
        onClick={scrollToTopSmooth}
        className={`${
          !showButton ? " collapse opacity-0" : " opacity-100"
        }  fixed bottom-4 z-10 text-bold right-4 cursor-pointer rounded-full bg-blue-800  p-3 shadow-[3px_3px_2px_0px_rgba(_255,_255,_255,0.40)] duration-300 active:bg-slate-500 sm:hover:translate-y-[-5px] 8xl:right-[calc(50%-1240px)]`}
      >
        <div className=" rotate-90 ml-1 text-6xl text-bold leading-6 text-center translate-x-2">
          &#x2039;
        </div>
      </div>
    </div>
  )
}

export default BackToTop
