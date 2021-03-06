## Browser Bookmarks Map
Make an HTML 'map' of your Firefox or Google Chrome bookmarks.


### Perks:
- Open in any browser
- Dark theme (easier on the eyes)
- Convenient to share all of your bookmarks with others
- `<details>` and `<summary>` elements create a simple accordion-style layout.
	- <details><summary>Summary</summary>Hidden content</details>


### How to use:
- clone repo
- have Node.js installed
- find and copy your bookmarks file location
	- Firefox, Windows: Use the bookmarks menu to make a backup (`.json`)
	- Chrome, Windows: `C:\Users\USERNAME\AppData\Local\Google\Chrome\User Data\Default\Bookmarks` (no file extension)
	- optional: test using mock data in `/mock_data`
- command line: 
	- navigate to repo directory
	- `node bookmarks "<Bookmarks Location>"`
	- Note: File extension: use `.json` unless using Chrome file which has none
- `index.html` and `index.md` will be in either `/final/firefox` or `/final/chrome` directory
- optional: edit styles to your preference (`/final/assets/bookmarks_styles.css`)
