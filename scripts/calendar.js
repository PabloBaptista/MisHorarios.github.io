import{today} from "./date.js";
import{initMonthCalendar} from "./month-calendar.js";
import{initWeeekCalendar} from "./week-calendar.js";


export function initCalendar(eventStore)
{
    const calendarElement = document.querySelector("[data-calendar]");
    //console.log("From Calendar.js=> Calendar Element:\n",calendarElement);
    let selectedView="month";
    let selectedDate= today();
    //console.log("From Calendar.js=> selectedDate (Today):\n",selectedDate);

    function refreshCalendar(){

        const caledarScrollableElement= calendarElement.querySelector("[data-calendar-scrollable]");

        const scrollTop= caledarScrollableElement===null ? 0 : caledarScrollableElement.scrollTop;


        calendarElement.replaceChildren()
        if(selectedView==="month"){
            initMonthCalendar(calendarElement,selectedDate,eventStore);
        } 
        else if(selectedView==="week"){
            initWeeekCalendar(calendarElement,selectedDate,eventStore,false);

        }
        else{
            initWeeekCalendar(calendarElement,selectedDate,eventStore,true);
        }


        calendarElement.querySelector("[data-calendar-scrollable]").scrollTo({top: scrollTop});

        //console.log(event.detail.view);
    }

    


    document.addEventListener("view-change",(event)=>{
        selectedView=event.detail.view;
        refreshCalendar();
    });


    document.addEventListener("date-change",(event)=>{
        selectedDate=event.detail.date;
        refreshCalendar();
        //console.log("Date Change Event:\n",event);
    })

    document.addEventListener("events-change",()=>{
        refreshCalendar();
    })

    refreshCalendar();
}