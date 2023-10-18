import { FastingDB } from "utils/index";

const db = new FastingDB()

db.set("test1", false)

if (db.get("test1") !== false) console.error("Test 1 for db failed : Expected value to be the boolean false but got " + db.get("test1"))

db.clear()
if (db.size !== 0) console.error("Either Clearing The DB or Getting Its Size Went Wrong")

db.set("test2", "aaaaa".repeat(32000))
if (db.get("test2") !== "aaaaa".repeat(32000)) console.error("Failed To Concatonate Strings. Got Value Was Not Set Value")

const coords = { x: 20, y: 10, z: 100 }

db.set("test3", coords)

if(JSON.stringify(db.get("test3")) !== JSON.stringify(coords)) console.error("Failed To Recognise Vector3 Interface")

console.warn("DB Test Done")

//db.set("test3", true)
//db.set("test4", 31152)