const dateFormatter=new Intl.DateTimeFormat("es-ES",{
    hour: "numeric",
    minute: "numeric"
});

export function eventTimeToDate(event,eventTime){

    const dateConverted = new Date(event.detail.startDate)
    console.log("Event Start Date ",event.detail.startDate);
    console.log("Event Start Date Converted ",dateConverted);


    return new Date(
        dateConverted.getFullYear(),
        dateConverted.getMonth(),
        dateConverted.getDate(),
        0,
        eventTime
    )
}


export function formFieldsUpdater(){

    const formElement=document.getElementById("[data-event-form]");



    const initDateField=document.getElementById("start-date");
    const endDateField=document.getElementById("end-date");

    const startTravelField=document.getElementById("start-travel-time");
    const startWorkField=document.getElementById("start-work-time");
    const startPauseField=document.getElementById("start-pause-time");
    const endPauseField=document.getElementById("end-pause-time");
    const endWorkField=document.getElementById("end-work-time");
    const endTravelField=document.getElementById("end-travel-time");



    initDateField.addEventListener("change",()=>{
        endDateField.value=initDateField.value;
    })

    startTravelField.addEventListener("change",()=>{
        startWorkField.value=startTravelField.value;
        startPauseField.value=startTravelField.value;
        endPauseField.value=startTravelField.value;
        endWorkField.value=startTravelField.value;
        endTravelField.value=startTravelField.value;

    })

    startWorkField.addEventListener("change",()=>{
        startPauseField.value=startWorkField.value;
        endPauseField.value=startWorkField.value;
        endWorkField.value=startWorkField.value;
        endTravelField.value=startWorkField.value;

    })
    startPauseField.addEventListener("change",()=>{
        endPauseField.value=startPauseField.value;
        endWorkField.value=startPauseField.value;
        endTravelField.value=startPauseField.value;

    })
    endPauseField.addEventListener("change",()=>{
        endWorkField.value=endPauseField.value;
        endTravelField.value=endPauseField.value;

    })
    endWorkField.addEventListener("change",()=>{
        endTravelField.value=endWorkField.value;

    })



    return;
}

export function formFieldsFill(event){
    const initDateField=document.getElementById("start-date");
    const endDateField=document.getElementById("end-date");
    const startTimeField=document.getElementById("start-travel-time");
    const endTimeField=document.getElementById("end-travel-time");
    
    const formatedStartDate=event.detail.startDate.toISOString().split('T')[0];
    const formatedEndDate=event.detail.endDate.toISOString().split('T')[0];

    initDateField.value=formatedStartDate;
    endDateField.value=formatedEndDate;
    startTimeField.value=event.detail.startTravelTime;
    endTimeField.value=event.detail.endTravelTime;
    //startTimeField.value=dateFormatter.format(eventTimeToDate(event,event.detail.startTravelTime));

    //subEventAttributes.hours.startHour=dateFormatter.format(eventTimeToDate(event,event.endWorkTime));


    // startTimeField.value=event.detail.startTravelTime;
    // endTimeField.value=event.detail.endTravelTime;

    // console.log("START DATE RECEIVED: ",formatedStartDate);

}

