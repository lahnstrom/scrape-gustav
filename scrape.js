const puppeteer = require("puppeteer")
const select = require("puppeteer-select")
const fs = require("fs")

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}

const getQuotes = async () => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  })

  // Open a new page
  const page = await browser.newPage()

  // On this new page:
  // - open the "http://quotes.toscrape.com/" website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto(
    "https://scholar.google.com/citations?user=mXzy9UIAAAAJ&hl=en&oi=ao&inst=16391793347078271450",
    {
      waitUntil: "domcontentloaded"
    }
  )

  const element = await select(page).getElement("span:contains(Show more)")
  await element.click()

  await delay(5000)

  const element2 = await select(page).getElement("span:contains(Show more)")
  await element2.click()

  await delay(5000)

  const links = await page.evaluate(() => {
    // Fetch the first element with class "quote"
    const links = document.querySelectorAll("a.gsc_a_at")

    // Fetch the sub-elements from the previously fetched link element
    // Get the displayed text and return it (`.innerText`)

    const linkHrefs = Array.from(links).map((link) => link.href)
    return linkHrefs
  })

  fs.writeFileSync("links.txt", links.join("\n"))
}

// Start the scraping
getQuotes()

const links = fs.readFileSync(links.txt).toString().split("\n")

const getAuthors = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  })

  const page = await browser.newPage()
  const authorList = links.map(async (link) => {
    await page.goto(link, {
      waitUntil: "domcontentloaded"
    })
    const author = await page.evaluate(() => {
      const author = document.querySelector("div.gsc_oci_value")
      return author
    })
    return author
  })

  fs.writeFileSync("authorList.txt", authorList.join("\n"))
}

getAuthors()
