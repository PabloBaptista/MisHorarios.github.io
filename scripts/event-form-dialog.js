import{initDialog} from "./dialog.js"
import{initEventForm} from "./event-form.js"
import{formFieldsUpdater,formFieldsFill} from "./form-fields-updater.js";
import{initToaster} from"./toaster.js";


export function initEventFormDialog(){

    const dialog = initDialog("event-form");
    const toaster = initToaster(dialog.dialogElement);
    const eventForm=initEventForm(toaster);

    document.addEventListener("event-create-request",()=>{
        dialog.open();
        formFieldsUpdater();
    })
    document.addEventListener("event-create-request-today",(event)=>{
        dialog.open();
        formFieldsUpdater();
        formFieldsFill(event);
    })

    dialog.dialogElement.addEventListener("close",()=>{
        eventForm.reset();
    })

    eventForm.formElement.addEventListener("event-create",()=>{
        dialog.close();
    })

}