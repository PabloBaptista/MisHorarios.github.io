import{isTheSameDay, getDaysBetweenTwoDatesIncluded} from "./date.js";


export function initEventStore(){
    document.addEventListener("event-create",(event)=>{
        const createdEvent=event.detail.event;
        const events=getEventsFromLocalStorage();
        events.push(createdEvent)
        saveEventsIntoLocalStore(events);

        document.dispatchEvent(new CustomEvent("events-change",{
            bubbles: true
        }))
    });

    return{
        getEventsByDate(date){
            const events=getEventsFromLocalStorage();
            const filteredEvents=events.filter((event)=> isTheSameDay(event.startDate,date));

            return filteredEvents;
        }
    }
}




function saveEventsIntoLocalStore(events){
    const safeToStringifyEvents = events.map((event)=>({
        ...event,
        startDate: event.startDate.toISOString(),
        endDate: event.endDate.toISOString()
    }));

    let stringifiedEvents;
    try{
        stringifiedEvents=JSON.stringify(safeToStringifyEvents);
    }
    catch(error){
        console.error("Stringify events failed",error);
    }

    localStorage.setItem("events",stringifiedEvents);
}


function getEventsFromLocalStorage(){
    const localStorageEvents=localStorage.getItem("events");
    if(localStorageEvents===null){
        return[];
    }

    let parsedEvents;
    try{
        parsedEvents = JSON.parse(localStorageEvents);
    }
    catch(error){
        console.error("Parse events failed",error);
        return[];
    }

    const events= parsedEvents.map((event)=>({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate)
    }));

    //console.log("EVENTS: ",events)
    return events;
}