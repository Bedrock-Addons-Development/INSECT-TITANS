import "con-api";
import "INSEC-TITANS/index";
import "global"
import { FastingDB } from "utils/fastingDb/fastingDb";
//conmaster2112

const db = new FastingDB()

db.set("example", "tttttttt")

console.warn(db.get("example"))