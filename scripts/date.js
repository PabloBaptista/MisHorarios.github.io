
//---------------// CALC HELPER FUNCTIONS   //---------------//

export function today(){
    const now = new Date();
    return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        12
    );
}

export function addMonths(date,months){
    const firstDayOfMonth= new Date(
        date.getFullYear(),
        date.getMonth()+months,
        1,
        date.getHours()
    );

    const lastDayOfMonth= getLastDayOfMonth(firstDayOfMonth);

    const dayOfMonth=Math.min(date.getDate(),lastDayOfMonth.getDate());

    return new Date(
        date.getFullYear(),
        date.getMonth()+months,
        dayOfMonth,
        date.getHours()
    );
}

export function subtractMonths(date,months){
    return addMonths(date,-months);
}

export function addDays(date,days){
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()+days,
        date.getHours()
    );
}

export function subtractDays(date,days){
    return addDays(date,-days);
}

export function isTheSameDay(dateA,dateB){
    return dateA.getFullYear()===dateB.getFullYear() && dateA.getMonth()===dateB.getMonth() && dateA.getDate()===dateB.getDate();

}
export function isBeforeDay(dateA,dateB){
    //console.log("COMPARANDO: ",dateA," /// ",dateB);

    if(dateA.getFullYear()<dateB.getFullYear()){
        return true;
    }
    if(dateA.getMonth()<dateB.getMonth()&&dateA.getFullYear()<=dateB.getFullYear()){
        return true
    }
    if(dateA.getDate()<dateB.getDate()&&dateA.getMonth()<=dateB.getMonth()&&dateA.getFullYear()<=dateB.getFullYear()){
        return true
    }

    return false
    
}

function getLastDayOfMonth(date){
    return new Date(
        date.getFullYear(),
        date.getMonth()+1,
        0,
        12
    );
}

export function getDaysBetweenTwoDatesIncluded(initDate,endDate){

    let resultDays=new Array();
    let arrayIndex=0;
    const msPerDay=1000*60*60*24;
    let difMs= endDate.getTime()-initDate.getTime();

    for(let i=initDate.getTime();i<=endDate.getTime();i+=msPerDay){
        let dateToPrint= new Date(i);
        resultDays[arrayIndex]=dateToPrint;
        arrayIndex++;
        console.log("DIA: "+dateToPrint);
    }

    console.log("Array Days: ",resultDays);

    return resultDays;
}

//---------------// GENERATE CALENDARS FUNCTIONS   //---------------//


export function generateMonthCalendarDays(currentDate){
    //console.log("From date.js/generateMonthCalendarDays=> Current Date:\n",currentDate);
    const calendarDays=[];

    const lastDayOfPreviousMonthDate=getLastDayOfMonth(
        subtractMonths(currentDate,1)
    );
    console.log("From date.js/generateMonthCalendarDays=> Last Day Of Previous Month Date:\n",lastDayOfPreviousMonthDate);

    const lastDayOfPreviousMonthWeekDay=lastDayOfPreviousMonthDate.getDay();

    //console.log("From date.js/generateMonthCalendarDays=> Last Day Of Previous Month Week Date:\n",lastDayOfPreviousMonthWeekDay);

    if(lastDayOfPreviousMonthWeekDay!==0){  //!=0 puesto que el valor 0=domingo
        for(let i=lastDayOfPreviousMonthWeekDay;i>0;i-=1){  //>0 y no >=0 porque nuestra semana empieza en lunes y no en domingo
            const calendarDay=subtractDays(lastDayOfPreviousMonthDate,i-1); //i-1 para que no se salte 1 dia, por defecto esta diseñado para empezar la semana en domingo y no eln lunes
            console.log("From date.js/generateMonthCalendarDays=> Calendar Day Date:\n",calendarDay);

            calendarDays.push(calendarDay);

        }
    }


    const lastDayOfCurrentMonthDate=getLastDayOfMonth(currentDate);
    console.log("Last Day of Current Month Date = ",lastDayOfCurrentMonthDate)

    //console.log("From date.js/generateMonthCalendarDays=> Last Day Of Current Month Date:\n",lastDayOfCurrentMonthDate);

    for(let i=1;i<=lastDayOfCurrentMonthDate.getDate();i+=1){
        const calendarDay=addDays(lastDayOfPreviousMonthDate,i);
        calendarDays.push(calendarDay);
        //console.log("From date.js/generateMonthCalendarDays=> Calendar Day Date:\n",calendarDay);
    }

    const totalWeeks=Math.ceil(calendarDays.length/7);
    const totalDays= totalWeeks*7;
    const missingDayAmount=totalDays-calendarDays.length;

    for(let i=1;i<=missingDayAmount;i+=1){
        const calendarDay=addDays(lastDayOfCurrentMonthDate,i);
        calendarDays.push(calendarDay);
    }


    return calendarDays;

}

export function generateWeekDays(date){

    const weekDays =[];
    const firstWeekDay=subtractDays(date,date.getDay());

    for(let i=1;i<=7;i++){  //i=1 y i<=7 para empezar la semana en lunes y acabar en domingo
        const weekDay=addDays(firstWeekDay,i);
        weekDays.push(weekDay);
    }
    console.log("WEEK DAYS= ",weekDays);

    return weekDays;

}


