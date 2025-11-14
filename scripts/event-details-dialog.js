import{initDialog} from "./dialog.js"

export function initEventDetailsDialog(){
    
    document.addEventListener("event-click",(event)=>{
        const dialog=initDialog("event-details");
        dialog.open();
    })
}