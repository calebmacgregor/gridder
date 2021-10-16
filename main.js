import { gridImage } from "./utilities.js"

const form = document.querySelector(".grid-inputs-form")

form.addEventListener("input", () => {
  const gridCalc = document.querySelector(".grid-calc")
  const xvalues = document.querySelector(".xvalues")
  const yvalues = document.querySelector(".yvalues")

  gridCalc.innerText = `Current grid size: ${xvalues.value}w x ${
    yvalues.value
  }h (${xvalues.value * yvalues.value} blocks)`
})

document.addEventListener("change", gridImage)
