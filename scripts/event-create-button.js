

export function initEventCreateButton(){
    const buttonElement= document.querySelector("[data-event-create-button]")
    buttonElement.addEventListener("click",()=>{
        buttonElement.dispatchEvent(new CustomEvent ("event-create-request",{
            bubbles: true
        }));
    });

    //MOBILE BUTTON

    const buttonElementMobile= document.querySelector("[data-event-create-button-mobile]")
    buttonElementMobile.addEventListener("click",()=>{
        buttonElement.dispatchEvent(new CustomEvent ("event-create-request",{
            bubbles: true
        }));
    });
}