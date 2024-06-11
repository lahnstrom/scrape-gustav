const fs = require("fs")
const file = fs.readFileSync("./authors.txt").toString()
const byRow = file.split("\n")
const byName = byRow.map((row) => row.split(", "))
const merged = byName.flat(Infinity)
const trimmed = merged.map((name) => name.trim())

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index
}

const uniqueNames = trimmed.filter(onlyUnique)

fs.writeFileSync(
  "out.csv",
  "name\n" + uniqueNames.sort((a, b) => a.localeCompare(b)).join("\n")
)
console.log(trimmed)
