import{generateWeekDays,isTheSameDay,today} from "./date.js"
import{isEventAllDay,eventStartsBefore,eventEndsBefore,initDynamicEvent,eventsCollidesWith} from "./event.js";
import{initEventList} from "./event-list.js";

const calendarTemplateElement=document.querySelector("[data-template='week-calendar']");
const calendarDayOfWeekTemplateElement=document.querySelector("[data-template='week-calendar-day-of-week']");
const callendarAllDayListItemTemplateElement=document.querySelector("[data-template='week-calendar-all-day-list-item']");
const callendarColumnTemplateElement=document.querySelector("[data-template='week-calendar-column']");

const dateFormatter=new Intl.DateTimeFormat("es-ES",{
    weekday: 'short',
    
});

export function initWeeekCalendar(parent,selectedDate,eventStore,isSingleDay){

    const calendarContent=calendarTemplateElement.content.cloneNode(true);
    const calendarElement=calendarContent.querySelector("[data-week-calendar]");
    const calendarDayOfWeekListElement=calendarElement.querySelector("[data-week-calendar-day-of-week-list");
    const calendarAllDayListElement=calendarElement.querySelector("[data-week-calendar-all-day-list]");
    const calendarColumnsElement=calendarElement.querySelector("[data-week-calendar-columns]");

    const weekDays=isSingleDay ? [selectedDate] : generateWeekDays(selectedDate);
    //console.log(weekDays);

    for(const weekDay of weekDays){

        const events=eventStore.getEventsByDate(weekDay);
        const allDayEvents=events.filter((event)=>isEventAllDay(event));
        const nonAllDayEvents=events.filter((event)=>!isEventAllDay(event));

        sortEventsByTime(nonAllDayEvents);

        initDayOfWeek(calendarDayOfWeekListElement,selectedDate,weekDay);
        initAllDayListItem(calendarAllDayListElement,allDayEvents);
        initColumn(calendarColumnsElement,weekDay,events);
    }

    if(isSingleDay){
        calendarElement.classList.add("week-calendar--day");
    }

    parent.appendChild(calendarElement);
    
}

function initDayOfWeek(parent,selectedDate,weekDay){
    const calendarDayOfWeekContent=calendarDayOfWeekTemplateElement.content.cloneNode(true);
    const calendarDayOfWeekElement=calendarDayOfWeekContent.querySelector("[data-week-calendar-day-of-week]");
    const calendarDayOfWeekButtonElement=calendarDayOfWeekElement.querySelector("[data-week-calendar-day-of-week-button]");
    const calendarDayOfWeekDayElement=calendarDayOfWeekElement.querySelector("[data-week-calendar-day-of-week-day]");
    const calendarDayOfWeekNumberElement=calendarDayOfWeekElement.querySelector("[data-week-calendar-day-of-week-number]");

    calendarDayOfWeekNumberElement.textContent=weekDay.getDate();
    
    if(isTheSameDay(weekDay,today())){
        console.log("HOY");
        console.log(calendarDayOfWeekButtonElement);
        calendarDayOfWeekButtonElement.classList.add("week-calendar__day-of-week-button--highlight");
    }
    
    calendarDayOfWeekDayElement.textContent=dateFormatter.format(weekDay);
    parent.appendChild(calendarDayOfWeekElement);

}   


function initAllDayListItem(parent,events){
    const calendarAllDayListItemContent=callendarAllDayListItemTemplateElement.content.cloneNode(true);
    const calendarAllDayListItemElement=calendarAllDayListItemContent.querySelector("[data-week-calendar-all-day-list-item]");

    initEventList(calendarAllDayListItemElement,events);
    parent.appendChild(calendarAllDayListItemElement);
}

function initColumn(parent,weekDay,events){
    const calendarColumnContent=callendarColumnTemplateElement.content.cloneNode(true);
    const calendarColumnElement=calendarColumnContent.querySelector("[data-week-calendar-column]");
    const calendarColumnCellElements=calendarColumnElement.querySelectorAll("[data-week-calendar-cell]");
    
    const eventsWithDynamicStyles=calculateEventsDynamicStyles(events);
    for(const eventWithDynamicStyles of eventsWithDynamicStyles){
        initDynamicEvent(
            calendarColumnElement,
            eventWithDynamicStyles.event,
            eventWithDynamicStyles.styles
        );

    }
    
    parent.appendChild(calendarColumnElement);
}

function calculateEventsDynamicStyles(events){


    console.log("EVENTS PASSING: ",events);
    console.log("EVENTS TYPE: ",typeof events);

    const{eventGroups,totalColumns}=groupEvents(events);
    const columnWidth=100/totalColumns;
    const initialEventGroupItems=[];

    for(const eventGroup of eventGroups){
        console.log("EVENT GROUP: ",eventGroup);
        for(const eventGroupItem of eventGroup){
            console.log("Event Group Item: ",eventGroupItem);
            if(eventGroupItem.isInitial){
                initialEventGroupItems.push(eventGroupItem);
            }
        }
    }

    return initialEventGroupItems.map((eventGroupItem)=>{

        // console.log("InitialEventGroupItems: ",initialEventGroupItems);
        // console.log("EventGroupItem.event: ",eventGroupItem.event);

        const topPercentage=100*(eventGroupItem.event.startTravelTime/1440);
        const bottomPercentage=100-100*(eventGroupItem.event.endTravelTime/1440);
        const leftPercentage=columnWidth*eventGroupItem.columnIndex;
        const rightPercentage=columnWidth*(totalColumns-eventGroupItem.columnIndex-1);

        return{
            event: eventGroupItem.event,
            styles: {
                top: `${topPercentage}%`,
                bottom: `${bottomPercentage}%`,
                left: `${leftPercentage}%`,
                right: `${rightPercentage}%`
            }
        }

    });

}

//funcion para que los eventos que se solapan se render en diferentes columnas
function groupEvents(events){
    console.log("GROUPING EVENTS: ",events);
    console.log("EVENTS LENGHT: ",events.lenght);
    console.log("EVENTS TYPE: ",typeof events);
    if(events.lenght===0){
        console.log("NO EVENTS");
        return {eventGroups: [], totalColumns: 0};
    }
    console.log("EVENTS: ",events);

    const firstEventGroup=[
        {
            event: events[0],
            columnIndex: 0,
            isInitial: true
        }
    ];

    const eventGroups=[firstEventGroup];

    for(let i=1; i<events.lenght;i+=1){
        console.log("DENTRO DEL BUCLE");
        const lastEventGroup=eventGroups[eventGroups.length-1];
        const loopEvent=events[i];

        const lastEventGroupCollidingItems=lastEventGroup.filter((eventGroupItem)=>
            eventsCollidesWith(eventGroupItem.event,loopEvent)
        );

        if(lastEventGroupCollidingItems.length===0){
            const newEventGroupItem={
                event: loopEvent,
                columnIndex: 0,
                isInitial: true
            };

            const newEventGroup=[newEventGroupItem];
            eventGroups.push(newEventGroup);
            continue;
        }

        if(lastEventGroupCollidingItems.length===lastEventGroup.length){
            const newEventGroupItem={
                event: loopEvent,
                columnIndex: lastEventGroup.length,
                isInitial: true
            };

            lastEventGroup.push(newEventGroupItem);
            continue;
        }

        let newColumnIndex=0;
        while(true){
            const isColumnIndexInUse=lastEventGroupCollidingItems.some((eventGroupItem)=>
                eventGroupItem.columnIndex===newColumnIndex
            );
            if(isColumnIndexInUse){
                newColumnIndex+=1;
            }
            else{
                break;
            }
        }

        const newEventGroupItem={
            event: loopEvent,
            columnIndex: newColumnIndex,
            isInitial: true
        };

        const newEventGroup=[
            ...lastEventGroupCollidingItems.map((eventGroupItem)=>({
                ...eventGroupItem,
                isInitial: false
            })),
            newEventGroupItem
        ];

        eventGroups.push(newEventGroup);
    }

    let totalColumns=0;
    for(const eventGroup of eventGroups){
        for(const eventGroupItem of eventGroup){
            totalColumns=Math.max(totalColumns, eventGroupItem.columnIndex+1);
        }
    }

    return {eventGroups,totalColumns};

}

function sortEventsByTime(events){
    events.sort((eventA,eventB)=>{
        if(eventStartsBefore(eventA,eventB)){
            return -1;
        }
        if(eventStartsBefore(eventB,eventA)){
            return 1;
        }

        return eventEndsBefore(eventA,eventB) ? 1 : -1;
    })

}