import{waitUntilAnimationsFinish} from "./animation.js"


export function initToaster(parent){
    const toasterElement=document.createElement("div");
    toasterElement.classList.add("toaster");
    parent.appendChild(toasterElement);

    return{
        success(message){
            showToast(toasterElement,message,"success");
        },
        error(message){
            showToast(toasterElement,message,"error");
        }
    }
}

function showToast(toasterElement,message,type){
    const toastElement =createToast(message,type);
    animateToast(toasterElement,toastElement);

}

function createToast(message,type){

    const toastElement=document.createElement("div");
    toastElement.innerHTML=`
        <i class="toast--${type} toast-icon">${getIcons(type)}</i>

        <div class="toast-message toast-message--${type}">${message}</div>

        <!-- <i class="fa-solid fa-xmark" onclick="this.parentElement.remove()"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></i> -->`  //comentado en html boton de cerrar
        
    // toastElement.textContent=message;   //old toast 
    toastElement.classList.add("toast");
    toastElement.classList.add(`toast--${type}`);

    return toastElement;
}

function animateToast(toasterElement,toastElement){
    const heightBefore=toasterElement.offsetHeight;
    toasterElement.appendChild(toastElement);
    const heightAfter=toasterElement.offsetHeight;
    const heightDiff=heightAfter-heightBefore;


    const toasterAnimation= toasterElement.animate([
        {transform:`translate(0,${heightDiff}px)`},
        {transform:"translate(0,0)"}
    ],{
        duration: 150,
        easing: "ease-out"
    });


    toasterAnimation.starTime=document.timeline.currentTime;

    waitUntilAnimationsFinish(toastElement)
        .then(()=>{
            toasterElement.removeChild(toastElement);
        })
        .catch((error)=>{
            console.log("Finish toast animation promise failed",error);
        })
    

}

function getIcons(type){

    let icon;
    if(type==="success"){
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-icon lucide-circle-check"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`;
    }
    if(type==="error"){
        icon=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x-icon lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`;
    }
    if(type==="alert"){
        icon=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert-icon lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`
    }
    if(type==="info"){
        icon=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info-icon lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`
    }
    if(type==="loading"){
        icon=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-webhook-icon lucide-webhook"><path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"/><path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06"/><path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8"/></svg>`
    }
        return icon;
}