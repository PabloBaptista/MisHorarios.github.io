const eventTemplateElement=document.querySelector("[data-template='event']");

const dateFormatter=new Intl.DateTimeFormat("es-ES",{
    hour: "numeric",
    minute: "numeric"
});

export function initStaticEvent(parent,event){
    const eventElement= initEvent(event);

    if(isEventAllDay(event)){
        eventElement.classList.add("event--filled");
    }

    parent.appendChild(eventElement);
}

export function initDynamicEvent(parent,event,dynamicStyles){

    const eventElement=initEvent(event);

    eventElement.classList.add("event--filled");
    eventElement.classList.add("event--dynamic");

    eventElement.style.top=dynamicStyles.top;
    eventElement.style.left=dynamicStyles.left;
    eventElement.style.bottom=dynamicStyles.bottom;
    eventElement.style.right=dynamicStyles.right;

    parent.appendChild(eventElement);
    createSubEvents(eventElement,event);


}

function initEvent(event){
    const eventContent=eventTemplateElement.content.cloneNode(true);
    const eventElement=eventContent.querySelector("[data-event]");
    const eventTitleElement= eventElement.querySelector("[data-event-title]");
    const eventStartTimeElement = eventElement.querySelector("[data-event-start-time]");
    const eventEndTimeElement=eventElement.querySelector("[data-event-end-time]");

    eventElement.style.setProperty("--event-color",event.color);
    eventTitleElement.textContent=event.title;

    eventElement.addEventListener("click",()=>{
        eventElement.dispatchEvent(new CustomEvent("event-click",
        {
            detail:{
                event: event,

            },
            bubbles:true
        }));
    });



    return eventElement;
}

export function isEventAllDay(event){
    if(event.isFillChecked=="checked"){

        return true;
    }
    return false;
}
    
export function eventStartsBefore(eventA,eventB){
    return eventA.startTravelTime < eventB.startTravelTime;
}

export function eventEndsBefore(eventA,eventB){
    return eventA.endTravelTime < eventB.endTravelTime;
}

export function eventsCollidesWith(eventA,eventB){
    
    console.log("EVENT COLIDE CHECK: \n EVENT A: ",eventA,"\n EventB: ",eventB);

    const maxStartTime=Math.max(eventA.startTravelTime,eventB.startTravelTime);
    const minEndTime=Math.min(eventA.endTravelTime,eventB.endTravelTime);

    return minEndTime>maxStartTime;

}

function createSubEvents(parent,event){

    console.log("EVENT FOR SUBEVENT: ",event);
    let subEventAttributes={
        text:{
            inner: "SubElement"
        },
        hours:{
            startHour: new Date(),
            endHour: new Date()
        },
        position:{
            top:0,
            bottom: 0,
            left: 0,
            right:0          
        },
        classes:{
            subEventMainClass: "sub-event",
            subEventTypeClass: "sub-event--type",
            subEventColorClass: "sub-event--color-class"

        },
        color:{
            color: "color"
        }  

    }

    
    
    
    //TRAVEL TIME A
    
    subEventAttributes.text.inner="Travel Time";
    subEventAttributes.hours.startHour=dateFormatter.format(eventTimeToDate(event,event.startTravelTime));
    subEventAttributes.hours.endHour=dateFormatter.format(eventTimeToDate(event,event.startWorkTime));
    subEventAttributes.position.top=1;
    subEventAttributes.position.bottom=calculatePercentages(event.startTravelTime,event.endTravelTime,event.startWorkTime,true);

    subEventAttributes.classes.subEventTypeClass="sub-event--travel";
    subEventAttributes.classes.subEventColorClass="--travel-time-color";
    subEventAttributes.color.color=event.colorTravel;
    if(event.startTravelTime!==event.startWorkTime){
        setSubEvent(parent,subEventAttributes)
    }

    //WORK TIME A

    subEventAttributes.text.inner=`${event.title}`;
    subEventAttributes.hours.startHour=dateFormatter.format(eventTimeToDate(event,event.startWorkTime));
    subEventAttributes.hours.endHour=dateFormatter.format(eventTimeToDate(event,event.startPauseTime));
    subEventAttributes.position.top=calculatePercentages(event.startTravelTime,event.endTravelTime,event.startWorkTime,false);
    subEventAttributes.position.bottom=calculatePercentages(event.startTravelTime,event.endTravelTime,event.startPauseTime,true);

    subEventAttributes.classes.subEventTypeClass="sub-event--work";
    subEventAttributes.classes.subEventColorClass="--work-time-color";
    subEventAttributes.color.color=event.colorWork;
    if(event.startWorkTime!==event.startPauseTime){
        setSubEvent(parent,subEventAttributes)
    }

    //PAUSE TIME
    subEventAttributes.text.inner="Pause Time";
    subEventAttributes.hours.startHour=dateFormatter.format(eventTimeToDate(event,event.startPauseTime));
    subEventAttributes.hours.endHour=dateFormatter.format(eventTimeToDate(event,event.endPauseTime));
    subEventAttributes.position.top=calculatePercentages(event.startTravelTime,event.endTravelTime,event.startPauseTime,false);
    subEventAttributes.position.bottom=calculatePercentages(event.startTravelTime,event.endTravelTime,event.endPauseTime,true);

    subEventAttributes.classes.subEventTypeClass="sub-event--pause";
    subEventAttributes.classes.subEventColorClass="--pause-time-color";
    subEventAttributes.color.color=event.colorPause;
    if(event.startPauseTime!==event.endPauseTime){
        setSubEvent(parent,subEventAttributes)
    }

    //WORK TIME B
    subEventAttributes.text.inner=`${event.title}`;
    subEventAttributes.hours.startHour=dateFormatter.format(eventTimeToDate(event,event.endPauseTime));
    subEventAttributes.hours.endHour=dateFormatter.format(eventTimeToDate(event,event.endWorkTime));
    subEventAttributes.position.top=calculatePercentages(event.startTravelTime,event.endTravelTime,event.endPauseTime,false);
    subEventAttributes.position.bottom=calculatePercentages(event.startTravelTime,event.endTravelTime,event.endWorkTime,true);

    subEventAttributes.classes.subEventTypeClass="sub-event--work";
    subEventAttributes.classes.subEventColorClass="--work-time-color";
    subEventAttributes.color.color=event.colorWork;
    if(event.endPauseTime!==event.endWorkTime){
        setSubEvent(parent,subEventAttributes)
    }

    //TRAVEL TIME B
    subEventAttributes.text.inner="Travel Time";
    subEventAttributes.hours.startHour=dateFormatter.format(eventTimeToDate(event,event.endWorkTime));
    subEventAttributes.hours.endHour=dateFormatter.format(eventTimeToDate(event,event.endTravelTime));
    subEventAttributes.position.top=calculatePercentages(event.startTravelTime,event.endTravelTime,event.endWorkTime,false);
    subEventAttributes.position.bottom=calculatePercentages(event.startTravelTime,event.endTravelTime,event.endTravelTime,true);

    subEventAttributes.classes.subEventTypeClass="sub-event--travel";
    subEventAttributes.classes.subEventColorClass="--travel-time-color";
    subEventAttributes.color.color=event.colorTravel;
    if(event.endWorkTime!==event.endTravelTime){
        setSubEvent(parent,subEventAttributes)
    }






}

function calculatePercentages(initValue,endValue,valueToCalculate,restFromTotal){

    let total=(valueToCalculate-initValue)/(endValue-initValue)*100

    restFromTotal ? total=100-total : total=total;

    return total;


}

function setSubEvent(parent,subEventAttributes){
    const SubEventElement=document.createElement("div");
    const titleSubEventElement=document.createElement("div");
    const hoursSubEventElement=document.createElement("div");

    //SUB EVENT
    titleSubEventElement.innerHTML=subEventAttributes.text.inner;

    SubEventElement.classList.add(`${subEventAttributes.classes.subEventMainClass}`);
    SubEventElement.classList.add(`${subEventAttributes.classes.subEventTypeClass}`);
  
    SubEventElement.style.top=`${subEventAttributes.position.top}%`;
    SubEventElement.style.bottom=`${subEventAttributes.position.bottom}%`;
    SubEventElement.style.setProperty(`${subEventAttributes.classes.subEventColorClass}`,subEventAttributes.color.color);
    
    //SUB EVENT TITLE
    titleSubEventElement.classList.add("sub-event--title");

    //SUB EVENT HOURS
    hoursSubEventElement.innerHTML=`${subEventAttributes.hours.startHour} - ${subEventAttributes.hours.endHour}`;
    hoursSubEventElement.classList.add("sub-event--hours");
    
    parent.appendChild(SubEventElement);
    SubEventElement.appendChild(titleSubEventElement);
    SubEventElement.appendChild(hoursSubEventElement);
}

export function eventTimeToDate(event,eventTime){

    const dateConverted = new Date(event.startDate)
    console.log("Event Start Date ",event.startDate);
    console.log("Event Start Date Converted ",dateConverted);


    return new Date(
        dateConverted.getFullYear(),
        dateConverted.getMonth(),
        dateConverted.getDate(),
        0,
        eventTime
    )
}




export function validateEvent(event){
    if(event.startDate>event.endDate){
        return "La Fecha de Inicio debe ser menor a la Fecha Final"
    }


        //START TRAVEL TIME
    if(event.startTravelTime > event.startWorkTime){
        return "La hora de Inicio de viaje debe ser menor o igual a la hora de inicio de jornada"
    }
    else if(event.startTravelTime > event.startPauseTime){
        return "La hora de inicio de viaje debe ser menor a la hora de inicio de pausa"
    }
    else if(event.startTravelTime > event.endPauseTime){
        return "La hora de inicio de viaje debe ser menor a la hora de fin de pausa"
    }
    else if(event.startTravelTime > event.endWorkTime){
        return "La hora de inicio de viaje debe ser menor a la hora de fin de jornada"
    }
    else if(event.startTravelTime >= event.endTravelTime){
        return "La hora de inicio de viaje debe ser menor a la hora de fin de viaje"
    }
       //START WORK TIME
    else if(event.startWorkTime > event.startPauseTime){
        return "La hora de inicio de jornada debe ser menor a la hora de inicio de pausa"
    }
    else if(event.startWorkTime > event.endPauseTime){
        return "La hora de inicio de jornada debe ser menor a la hora de fin de pausa"
    }
    else if(event.startWorkTime > event.endWorkTime){
        return "La hora de inicio de jornada debe ser menor a la hora de fin de jornada"
    }
    else if(event.startWorkTime > event.endTravelTime){
        return "La hora de inicio de jornada debe ser menor a la hora de fin de viaje"
    }
        //START PAUSE TIME
    else if(event.startPauseTime > event.endPauseTime){
        return "La hora de inicio de pausa debe ser menor a la hora de fin de pausa"
    }
    else if(event.startPauseTime > event.endWorkTime){
        return "La hora de inicio de pausa debe ser menor a la hora de fin de jornada"
    }
    else if(event.startPauseTime > event.endTravelTime){
        return "La hora de inicio de pausa debe ser menor a la hora de fin de viaje"
    }
       //END PAUSE TIME
    else if(event.endPauseTime > event.endWorkTime){
        return "La hora de fin de pausa debe ser menor a la hora de fin de jornada"
    }
    else if(event.endPauseTime > event.endTravelTime){
        return "La hora de fin de pausa debe ser menor a la hora de fin de viaje"
    }
       //END WORK TIME
    else if(event.endWorkTime > event.endTravelTime){
        return "La hora de fin de jornada debe ser menor a la hora de fin de viaje"
    }

    //ALL VALIDATIONS OK
    return null;
    
}
