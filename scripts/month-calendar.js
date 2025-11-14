import{generateMonthCalendarDays,today,isTheSameDay,isBeforeDay} from "./date.js"
import{initEventList} from "./event-list.js";
import{isEventAllDay, eventStartsBefore} from "./event.js"

const calendarTemplateElement=document.querySelector("[data-template='month-calendar']");

const calendarDayTemplateElement=document.querySelector("[data-template='month-calendar-day']");

const calendarWeekClasses={
    4: "four-week",
    5: "five-week",
    6: "six-week"
};

export function initMonthCalendar(parent, selectedDate, eventStore){

    //console.log("From month-calendar.js=> parent:\n",parent,"\nselectedDate:\n",selectedDate);

    const calendarContent=calendarTemplateElement.content.cloneNode(true);
    const calendarElement=calendarContent.querySelector("[data-month-calendar]");
    const calendarDayListElement=calendarElement.querySelector("[data-month-calendar-day-list]");

    const calendarDays =generateMonthCalendarDays(selectedDate);
    const calendarWeeks= calendarDays/7;

    const calendarWeekClass= calendarWeekClasses[calendarWeeks];
    calendarElement.classList.add(calendarWeekClass);
    //console.log("From Months Calendar.js=> Calendar Days:\n",calendarDays);
    
    for(const calendarDay of calendarDays){    

        const events=eventStore.getEventsByDate(calendarDay);
        //.log(events);
        sortCalendarDayEvents(events);

        initCalendarDay(calendarDayListElement,calendarDay, events);
    }


    parent.appendChild(calendarElement);
    
};


function initCalendarDay(parent,calendarDay, events){
    const calendarDayContent=calendarDayTemplateElement.content.cloneNode(true);
    const calendarDayElement=calendarDayContent.querySelector("[data-month-calendar-day]");
    const calendarDayLabelElement=calendarDayContent.querySelector("[data-month-calendar-day-label]");
    const calendarEventListWrapper=calendarDayContent.querySelector("[data-month-calendar-event-list-wrapper]");

    if(isTheSameDay(today(),calendarDay)){
        calendarDayElement.classList.add("month-calendar__day--highlight");
    }

    if(calendarDay.getDay()===0){
        //console.log("DOMINGO: ",calendarDay);
        calendarDayElement.classList.add("month-calendar__day--sunday");

    }

    if(isBeforeDay(calendarDay,today())){
        //console.log("MENOR");
        calendarDayElement.classList.add("month-calendar__day--past");
    }

    calendarDayLabelElement.textContent = calendarDay.getDate();

    calendarDayLabelElement.addEventListener("click",()=>{
        document.dispatchEvent(new CustomEvent("date-change",{
            detail:{
                date: calendarDay
            },
            bubbles: true
        }));

        document.dispatchEvent(new CustomEvent("view-change",{
            detail:{
                view: 'day'
            },
            bubbles:true
        }));
    });

    calendarEventListWrapper.addEventListener("click",()=>{
        document.dispatchEvent(new CustomEvent("event-create-request-today",{
            detail:{
                startDate: calendarDay,
                endDate: calendarDay,
                startTravelTime: 480,   //08:00 Horas
                endTravelTime: 1020     //17:00 Horas

            },
            bubbles:true
        }));
    });


    parent.appendChild(calendarDayElement);

    initEventList(calendarDayElement,events);

    //console.log("From Month-Calendar.js=> Parent:\n",parent,"\nCalendar Day:\n",calendarDay);
    //console.log("///////////");
    //console.log("From Month-Calendar.js=> CalendarDayLabelElement:\n",calendarDayLabelElement.textContent);
}

function sortCalendarDayEvents(events){
    events.sort((eventA,eventB)=>{

        //DESCOMENTAR PARA QUE LOS EVENTOS RELLENOS SE COLOQUEN LOS PRIMEROS INDEPENDIENTE DEL HORARIO
        // if(isEventAllDay(eventA)){
        //     return -1;
        // }
        // if(isEventAllDay(eventB)){
        //     return 1;
        // }

        return eventStartsBefore(eventA,eventB) ? -1 : 1;
    })
}