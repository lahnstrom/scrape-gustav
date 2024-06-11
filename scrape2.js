const puppeteer = require("puppeteer")
const fs = require("fs")

const links = fs.readFileSync("links.txt").toString().split("\n")

const fetchAuthorList = async () => {
  const authorList = []
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  })

  for (let i = 0; i < links.length; i++) {
    const link = links[i]

    const page = await browser.newPage()
    await page.goto(link, {
      waitUntil: "domcontentloaded"
    })

    const author = await page.evaluate(() => {
      const author = document.querySelector("div.gsc_oci_value")
      return author.textContent
    })

    authorList.push(author)
  }

  fs.writeFileSync("authors.txt", authorList.join("\n"))

  await browser.close()
}

fetchAuthorList()
