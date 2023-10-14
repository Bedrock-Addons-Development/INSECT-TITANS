import { FastingDB } from "utils/index";

const db = new FastingDB()

db.set("example", "tttttttt")

console.warn(db.has("example"))
console.warn(db.get("example"))

db.set("example", "dddddddddddddddddd")

console.warn(db.has("example"))
console.warn(db.get("example"))