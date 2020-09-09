const fs = require('fs')
const writeMD = (filename, data) => {fs.writeFile(`${filename}.md`, data, (err) => {if (err) throw err})}
const writeHTML = (filename, data) => {fs.writeFile(`${filename}.html`, data, (err) => {if (err) throw err})}
let user_input = process.argv.slice(2)
let file_input = user_input[0]
let bookmarks = fs.readFileSync(file_input)
let parsed = JSON.parse(bookmarks)

const mapData = (section) => {
	let children
	if (
		section.children &&
		Array.isArray(section.children) &&
		section.children.length
	) {
		children = section.children.map(child => mapData(child))
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
		return `<details class='child'><summary>${each.name !== "" ? each.name : each.url}</summary>${kids}</details>`
	} else if (each.type = "url") {
		return `<a href='${each.url}' target='_blank'>
			<span class='link-title'>${each.name !== "" ? each.name : each.url}</span><span class='link-url'>${each.url}</span>
		</a>\n`
	}
}

const createElements = (data) => `<details open>
<summary>Bookmark Bar</summary>
${data.bookmark_bar.children.map((each) => `${createChildrenElements(each)}`).join("")}
</details>
<details open>
<summary>Other Bookmarks</summary>
${data.other.children.map((each) => `${createChildrenElements(each)}`).join("")}
</details>`

const createChildrenElementsMarkdown = (each) => {
	if (each.type == "folder") {
		let kids = []
		if (each.children && Array.isArray(each.children) && each.children.length) {
			kids = each.children.map(each => createChildrenElementsMarkdown(each)).join("")
		}
		return `<details class='child'>
<summary>${each.name !== "" ? each.name : each.url}</summary>${kids}</details>`
	} else if (each.type = "url") {
		return `<a href='${each.url}' target='_blank'>${each.name !== "" ? each.name : each.url}</a>\n`
	}
}

const createElementsMarkdown = (data) => `<details open>
<summary>Bookmark Bar</summary>
${data.bookmark_bar.children.map((each) => `${createChildrenElementsMarkdown(each)}`).join("")}
</details>
<details open>
<summary>Other Bookmarks</summary>
${data.other.children.map((each) => `${createChildrenElementsMarkdown(each)}`).join("")}
</details>`

const makeHTML = (html) => `<!DOCTYPE html>
<html lang='en'>
<head>
	<meta charset='UTF-8'>
	<meta name='viewport' content='width=device-width, initial-scale=1.0'>
	<title>Bookmarks</title>
	<link rel='stylesheet' href='../assets/bookmarks_styles.css'>
	<link rel='icon' href='../assets/favicon.ico'>
</head>
<body>
${html}
</body>
</html>`

let final_data = {
	bookmark_bar: mapData(parsed.roots.bookmark_bar),
	other: mapData(parsed.roots.other),
	synced: mapData(parsed.roots.synced)
}

let elements = createElements(final_data)
let elements_markdown = createElementsMarkdown(final_data)

writeHTML("../final/chrome/index", makeHTML(elements))
writeMD("../final/chrome/index", makeHTML(elements_markdown))
