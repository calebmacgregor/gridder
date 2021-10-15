export function getAverageColour(coloursObject) {
	const red = coloursObject.red / coloursObject.counter
	const green = coloursObject.green / coloursObject.counter
	const blue = coloursObject.blue / coloursObject.counter

	return `rgb(${Math.floor(red)}, ${Math.floor(green)}, ${Math.floor(blue)})`
}

export function createGrid(x, y, imageWidth, imageHeight) {
	console.log("createGrid")
	//Remove one block worth of content from the right
	//This stops a dark bar from being shown on the right
	//of the image at higher resolutions
	const numberOfBlocks = x * y
	const width = Math.floor(imageWidth / x)
	const height = Math.floor(imageHeight / y)

	const containerGrid = container.querySelector(".container-grid")
	containerGrid.style.gridTemplateColumns = `repeat(${x}, ${width}px)`
	containerGrid.style.gridTemplateRows = `repeat(${y}, ${height}px)`

	for (let i = 0; i < numberOfBlocks; i++) {
		const block = document.createElement("canvas")
		block.classList.add("block")
		block.style.width = `${width}px`
		block.style.height = `${height}px`
		block.id = i
		containerGrid.appendChild(block)
	}
	console.log("grid created")
	return [width, height, numberOfBlocks, x, y]
}

export function renderCanvases(image, numberOfBlocks, width, height) {
	console.log("renderCanvases")
	//Loop through each canvas and draw the image
	for (let i = 0; i < numberOfBlocks; i++) {
		const percentage = Math.floor((i / numberOfBlocks) * 100)
		const canvas = document.getElementById(i)
		const ctx = canvas.getContext("2d")
		ctx.drawImage(
			image,
			canvas.offsetLeft,
			canvas.offsetTop,
			width,
			height,
			0,
			0,
			300,
			150
		)

		//Grab the pixel values from the canvas context
		const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
		const data = imgData.data

		//Set up a blank array of colours
		const colours = {
			red: 0,
			green: 0,
			blue: 0,
			alpha: 0,
			counter: 0
		}

		//Loop through every pixel on the canvas and add the rgb values to the colours object
		for (let i = 0; i < data.length; i += 4) {
			colours.red += data[i]
			colours.green += data[i + 1]
			colours.blue += data[i + 2]
			colours.alpha += data[i + 3]
			colours.counter += 1
		}

		//Get the averaged colour
		const rgba = getAverageColour(colours)

		//Paint the canvas with the average colour
		ctx.fillStyle = rgba
		ctx.fillRect(0, 0, canvas.width, canvas.height)
	}
}

export function combineCanvases(image, x, y) {
	console.log("combining canvases")
	//Create an array of all canvases
	const canvases = Array.from(document.querySelectorAll(".block"))

	//Select the original image and its dimensions
	const outputWidth = image.naturalWidth
	const outputHeight = image.naturalHeight

	//Get the output canvas and set its width and height
	const outputCanvas = document.querySelector(".output-canvas")
	outputCanvas.width = outputWidth
	outputCanvas.height = outputHeight

	//Loop through every canvas
	for (let i = 0; i < canvases.length; i++) {
		//Grab the block for the current loop
		const referenceCanvas = canvases[i]

		//Grab the width and height of the current block
		const blockWidth = parseFloat(referenceCanvas.style.width)
		const blockHeight = parseFloat(referenceCanvas.style.height)

		//Get the total number of rows
		const rows = x
		const columns = y

		//Find the current row and column
		const currentRow = Math.floor(i / rows)
		const currentColumn = i % rows

		//Set the context
		const ctx = outputCanvas.getContext("2d")

		//Calculate the x and y pixel coordinates to paint the canvas
		const destinationX = currentColumn * blockWidth
		const destinationY = currentRow * blockHeight

		//Paint the canvas
		ctx.drawImage(
			referenceCanvas,
			destinationX,
			destinationY,
			blockWidth,
			blockHeight
		)
	}
	const dataURL = outputCanvas.toDataURL()

	const previewImage = document.querySelector(".preview-image")
	previewImage.innerHTML = `<img src=${dataURL} alt="" />`

	const containerGrid = document.querySelector(".container-grid")
	containerGrid.style.display = "none"

	switchButtons()

	deleteGrid()
}

export function switchButtons() {
	const inputStyler = document.querySelector(".input-styler")
	const submitStyler = document.querySelector(".submit-styler")

	const submitStylerText = document.querySelector(".submit-styler-text")
	submitStylerText.innerText = "Submit"

	inputStyler.classList.toggle("hidden")
	submitStyler.classList.toggle("hidden")
	submitStyler.classList.toggle("loading")
}

export function storeImage(e) {
	const chooseFile = e.target.closest("#choose-file")
	if (!chooseFile) return

	let base64
	const files = chooseFile.files[0]
	console.log(files)

	if (files.type == "image/heic") {
		chooseFile.value = ""
		showToast("This file type is not supported", 2000, "#64ffda")
		return
	}

	if (files.size > 2000000) {
		chooseFile.value = ""
		showToast("This file is too big :(", 2000, "#64ffda")
		return
	}
	const fileReader = new FileReader()

	fileReader.readAsDataURL(files)

	fileReader.addEventListener("load", (e) => {
		const previewImage = document.querySelector(".preview-image")
		previewImage.innerHTML = `<img src=${e.target.result} alt="" />`
		base64 = e.target.result

		console.log("attempting to store")
		localStorage.setItem(
			"GRID-image",
			JSON.stringify({
				image: e.target.result
			})
		)
		console.log("stored successfully")
	})
	switchButtons()
	return base64
}

export function deleteGrid() {
	const canvasArray = Array.from(document.querySelectorAll(".block"))
	canvasArray.forEach((canvas) => {
		canvas.remove()
	})
	const mainGrid = document.querySelector(".container-grid")
	mainGrid.style = ""
}

function showToast(message, delay, colour = "#64ffda") {
	const toast = document.querySelector(".toast")
	toast.innerText = message
	toast.style.backgroundColor = colour
	toast.classList.toggle("hidden")
	setTimeout(() => {
		toast.classList.toggle("hidden")
	}, delay)
}
