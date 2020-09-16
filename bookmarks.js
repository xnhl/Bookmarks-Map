const fs = require('fs')
const writeMD = (filename, data) => {fs.writeFile(`${filename}.md`, data, (err) => {if (err) throw err})}
const writeHTML = (filename, data) => {fs.writeFile(`${filename}.html`, data, (err) => {if (err) throw err})}
let user_input = process.argv.slice(2)
let file_input = user_input[0]
let bookmarks = fs.readFileSync(file_input)
let parsed = JSON.parse(bookmarks)

const mapFirefox = (section) => {
	let children
	if (section.children && Array.isArray(section.children) && section.children.length) {
		children = section.children.map(child => mapFirefox(child))
	} else children = undefined
	let type = section.type == "text/x-moz-place-container" ? "folder" : (section.type == "text/x-moz-place" || section.type == "text/x-moz-place-separator") ? "url" : undefined
	let name = (section.title && section.title !== "") ? section.title.replace(/<|>/gi, "") : section.uri ? section.uri : "Untitled"
	let url = section.uri ? section.uri : "#"
	return {
		type,
		name,
		url,
		children
	}
}

const mapChrome = (section) => {
	let children
	if (section.children && Array.isArray(section.children) && section.children.length) {
		children = section.children.map(child => mapChrome(child))
	} else children = undefined
	let type = section.type
	let name = section.name !== "" ? section.name.replace(/<|>/gi, "") : section.url
	let url = section.url ? section.url : undefined
	return {
		type,
		name,
		url,
		children
	}
}

const createChildrenElements = (each) => {
	if (each.type == "folder") {
		let kids = []
		if (each.children && Array.isArray(each.children) && each.children.length) {
			kids = each.children.map(each => createChildrenElements(each)).join("")
		}
		return `\t<details class='child'><summary>${each.name !== "" ? each.name : each.url}</summary>\r\n${kids}</details>\r\n`
	} else if (each.type = "url") {
		return `\t\t<a href='${each.url}' target='_blank'><span class='link-title'>${each.name !== "" ? each.name : each.url}</span><span class='link-url'>${each.url}</span></a>\r\n`
	}
}

const createElements = (data) => {
	let kids = []
	if (data.children && Array.isArray(data.children) && data.children.length) {
		kids = data.children.map(each => createChildrenElements(each)).join("")
	}
	return `<details open><summary>${data.name}</summary>\r\n${kids}</details>\r\n`
}

const createChildrenElementsMarkdown = (each) => {
	if (each.type == "folder") {
		let kids = []
		if (each.children && Array.isArray(each.children) && each.children.length) {
			kids = each.children.map(each => createChildrenElementsMarkdown(each)).join("")
		}
		return `\t<details class='child'><summary>${each.name !== "" ? each.name : each.url}</summary>\r\n${kids}</details>\r\n`
	} else if (each.type = "url") {
		return `\t\t<a href='${each.url}' target='_blank'>${each.name !== "" ? each.name : each.url}</a>\r\n`
	}
}

const createElementsMarkdown = (data) => {
	let kids = []
	if (data.children && Array.isArray(data.children) && data.children.length) {
		kids = data.children.map(each => createChildrenElementsMarkdown(each)).join("")
	}
	return `<details open><summary>${data.name}</summary>\r\n${kids}</details>\r\n`
}

const makeHTML = (html, type) => {
	let h = `<!DOCTYPE html>
<html lang='en'>
	<head>
		<meta charset='UTF-8'>
		<meta name='viewport' content='width=device-width, initial-scale=1.0'>
		<title>Bookmarks</title>
		<link rel='stylesheet' href='../assets/bookmarks_styles.css'>
	</head>
	<body>
		${html}</body>
</html>`
	let m = `<html lang='en'>
	<head>
		<meta charset='UTF-8'>
		<meta name='viewport' content='width=device-width, initial-scale=1.0'>
		<title>Bookmarks</title>
		<link rel='stylesheet' href='../assets/bookmarks_styles.css'>
	</head>
	<body>
		${html}</body>
</html>`
	return type == "html" ? h : type == "markdown" ? m : ""
}

let browser
if (parsed.roots) {
	browser = "chrome"
} else browser = "firefox"

let h, m

if (browser == "chrome") {
	let final_data = [
		mapChrome(parsed.roots.bookmark_bar),
		mapChrome(parsed.roots.other),
		mapChrome(parsed.roots.synced)
	]
	let elements = final_data.map(each => createElements(each)).join("")
	let elements_markdown = final_data.map(each => createElementsMarkdown(each)).join("")
	h = makeHTML(elements, "html")
	m = makeHTML(elements_markdown, "markdown")
	writeHTML("./final/chrome/index", h)
	writeMD("./final/chrome/index", m)
} else if (browser == "firefox") {
	let final_data = parsed.children.map(child => mapFirefox(child))
	let elements = final_data.map(each => createElements(each)).join("")
	let elements_markdown = final_data.map(each => createElementsMarkdown(each)).join("")
	h = makeHTML(elements, "html")
	m = makeHTML(elements_markdown, "markdown")
	writeHTML("./final/firefox/index", h)
	writeMD("./final/firefox/index", m)
}
