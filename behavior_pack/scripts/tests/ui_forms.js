import { debuger } from "./debuger";

debuger.registry("ui",(sender)=>{
    setTimeout(()=>confirm(sender,"hello"),50)
    sender.sendMessage("Test");
});