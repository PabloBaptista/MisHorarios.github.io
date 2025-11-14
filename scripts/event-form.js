import{validateEvent} from "./event.js";
import {getDaysBetweenTwoDatesIncluded} from "./date.js";



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
        console.log("IS FILL CHECkED: ",formEvent.isFillChecked);
        callCreateEventForEachDayOnEvent(formElement,formEvent);

        // formElement.dispatchEvent(new CustomEvent("event-create",{
        //     detail:{
        //         event:formEvent
        //     },
        //     bubbles: true
        // }));

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

    const colorTravel=formData.get("color-travel");
    const colorPause=formData.get("color-pause");
    const colorWork=formData.get("color-work");

    const isFillChecked=formData.get("options__fill-option-checkbox")


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
        color,
        colorTravel,
        colorWork,
        colorPause,
        isFillChecked
    };

    return event;

}

function callCreateEventForEachDayOnEvent(formElement,formEvent){

    const initDate=formEvent.startDate;
    const endDate=formEvent.endDate;

    const resultDays=getDaysBetweenTwoDatesIncluded(initDate,endDate)

    console.log("RESULT DAYS: ",resultDays);

    for(let i=0;i<resultDays.length;i++){

        let startingDate=resultDays[i];
        let endingDate=resultDays[i];
        //console.log("STARTING DATE: ",startingDate);

        const myEvent ={
            title: formEvent.title,
            startDate: startingDate,
            endDate: endingDate,
            startTravelTime: formEvent.startTravelTime,
            startWorkTime: formEvent.startWorkTime,
            startPauseTime: formEvent.startPauseTime,
            endPauseTime: formEvent.endPauseTime,
            endWorkTime: formEvent.endWorkTime,
            endTravelTime: formEvent.endTravelTime,
            color: formEvent.color,
            colorTravel: formEvent.colorTravel,
            colorWork: formEvent.colorWork,
            colorPause: formEvent.colorPause,
            isFillChecked: formEvent.isFillChecked
        }
        //console.log("MY EVENT: ",myEvent);
     
    formElement.dispatchEvent(new CustomEvent("event-create",{
        detail:{
            event: myEvent
        },
        bubbles: true
    }));
    }
    formElement.addEventListener("event-create",(event)=>{
        console.log("EVENTO: ",event.detail);
    })

    //console.log(formEvent);

}


