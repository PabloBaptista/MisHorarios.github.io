import{validateEvent} from "./event.js";



export function initEventForm(toaster){

    
    const formElement=document.querySelector("[data-event-form]");

    formElement.addEventListener("submit",(event)=>{
        event.preventDefault();
        const formEvent = formIntoEvent(formElement);
        const validationError = validateEvent(formEvent);
        if(validationError!=null)
        {
            toaster.error(validationError);
            return;
        }

        formElement.dispatchEvent(new CustomEvent("event-create",{
            detail:{
                event:formEvent
            },
            bubbles: true
        }));

        //console.log(formEvent);


    });

    return{
        formElement,
        reset(){
            formElement.reset();
        }
    };



}

function formIntoEvent(formElement){
    const formData= new FormData(formElement);
    const title= formData.get("title");
    const startDate= formData.get("start-date");
    const endDate= formData.get("end-date");
    const startTravelTime=formData.get("start-travel-time");
    const startWorkTime=formData.get("start-work-time");
    const startPauseTime=formData.get("start-pause-time");
    const endPauseTime=formData.get("end-pause-time");
    const endWorkTime=formData.get("end-work-time");
    const endTravelTime=formData.get("end-travel-time");
    const color = formData.get("color");


    const event = {
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        startTravelTime: Number.parseInt(startTravelTime,10),
        startWorkTime: Number.parseInt(startWorkTime,10),
        startPauseTime: Number.parseInt(startPauseTime,10),
        endPauseTime: Number.parseInt(endPauseTime,10),
        endWorkTime: Number.parseInt(endWorkTime,10),
        endTravelTime: Number.parseInt(endTravelTime,10),
        color
    };

    return event;

}