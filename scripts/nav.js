import {today,addDays,addMonths,subtractDays,subtractMonths} from "./date.js"

const dateFormatter=new Intl.DateTimeFormat("es-ES",{
    month: "long",
    year: "numeric"
});
export function initNav(){

    const todayButtonElements=document.querySelectorAll("[data-nav-today-button]");
    const previousButtonElement=document.querySelector("[data-nav-previous-button]");
    const nextButtonElement=document.querySelector("[data-nav-next-button]");
    const dateElement=document.querySelector("[data-nav-date]");


    let selectedView="month";
    let selectedDate = today();

    for(const todayButtonElement of todayButtonElements){
        todayButtonElement.addEventListener("click",()=>{
            todayButtonElement.dispatchEvent(new CustomEvent("date-change",{
                detail:{
                    date: today()
                },
                bubbles: true
            }));
        });
    }

    previousButtonElement.addEventListener("click",()=>{
        previousButtonElement.dispatchEvent(new CustomEvent("date-change",{
            detail:{
                date: getPreviousDate(selectedView,selectedDate)
            },
            bubbles: true
        }));
    });

    nextButtonElement.addEventListener("click",()=>{
        //console.log("From Nav.js=> Next Date:\n");
        nextButtonElement.dispatchEvent(new CustomEvent("date-change",{
            detail:{
                date: getNextDate(selectedView,selectedDate)
            },
            bubbles: true
        }));

    });

    document.addEventListener("view-change",(event)=>{
        selectedView=event.detail.view;
    })

    document.addEventListener("date-change",(event)=>{
        selectedDate=event.detail.date;
        refreshDateElement(dateElement,selectedDate);

    })

    refreshDateElement(dateElement,selectedDate);
}

function refreshDateElement(dateElement, selectedDate){

    let dateText=dateFormatter.format(selectedDate);
    dateElement.textContent= dateText.charAt(0).toUpperCase()+dateText.slice(1);

    //LO MISMO PERO EN MINUSCULAS LA PRIMERA
    // dateElement.textContent =dateFormatter.format(selectedDate);
}

function getPreviousDate(selectedView,selectedDate){
    if(selectedView==="day"){
        return subtractDays(selectedDate,1);
    }

    if(selectedView==="week"){
        return subtractDays(selectedDate,7);
    }

    return subtractMonths(selectedDate,1);
}

function getNextDate(selectedView,selectedDate){
    //console.log("From Nav.js=> Selected Date:\n",selectedDate);
    let nextDate;
    if(selectedView==="day"){
        return addDays(selectedDate,1);
    }

    if(selectedView==="week"){
        return addDays(selectedDate,7);
    }
    
    nextDate=addMonths(selectedDate,1);

    // return addMonths(selectedDate,1);

    return nextDate;
}