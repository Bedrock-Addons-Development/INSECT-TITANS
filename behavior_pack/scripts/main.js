import "con-api";
import "INSEC-TITANS/index";
import "global"
import { FastingDB } from "utils/fastingDb/fastingDb";

const db = new FastingDB()

db.set("example", "tttttttt")

console.warn(db.has("example"))
console.warn(db.get("example"))

db.set("example", "dddddddddddddddddd")

console.warn(db.has("example"))
console.warn(db.get("example"))
