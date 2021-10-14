import {
	createGrid,
	renderCanvases,
	combineCanvases,
	switchButtons,
	storeImage
} from "/utilities.js"

document.addEventListener("change", storeImage)

const submit = document.querySelector(".submit")
submit.addEventListener("click", (e) => {
	if (submit.classList.contains("hidden")) return

	const submitStyler = document.querySelector(".submit-styler")
	submitStyler.classList.toggle("loading")

	const submitStylerText = document.querySelector(".submit-styler-text")
	submitStylerText.innerText = "Loading..."

	e.preventDefault()
	const item = localStorage.getItem("GRID-image")

	if (!item) return
	const image = new Image()
	const base64 = JSON.parse(item)
	image.src = base64.image

	image.addEventListener("load", () => {
		//Setup some global variables
		const imageHeight = image.naturalHeight
		const imageWidth = image.naturalWidth

		//Create the grid
		const [width, height, numberOfBlocks, x, y] = createGrid(
			25,
			25,
			imageWidth,
			imageHeight
		)

		//Draw the image on the grid of canvases
		renderCanvases(image, numberOfBlocks, x, y)
		combineCanvases(image, x, y)
	})

	localStorage.removeItem("GRID-image")
})
