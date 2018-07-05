import {Group} from './Group';
// import {User} from './User';
import {appService} from "../models/AppStore";
import group from '../pic/group.png';

// interface myGroupSpan extends HTMLSpanElement{
//     path:string
// }

interface myItemSpan extends HTMLSpanElement{
    itemId:string
}


function TreeChat(element:HTMLElement) {
    // e:React.KeyboardEvent<HTMLDivElement>
    function arrowsKeyboard(e:any):void{
        if (e.keyCode == 38 || e.keyCode == 40) {
            // up - down arrows
            let elements = element.querySelectorAll("li");
            let displayedElements =[];
            for(let i=0;i<elements.length; i++){
                if (elements[i].offsetParent !== null) {
                    displayedElements.push(elements[i]);
                }
            }
            let target = e.target as HTMLElement;
            let parent = target.parentElement;
            if(!!parent){
                let index = displayedElements.indexOf(parent as HTMLLIElement);
                index = e.keyCode===38 ? index-1 : index+1
                if(index>=0 && index<displayedElements.length){
                    let elem = displayedElements[index];
                    let span = elem.querySelector("span");
                    if(!!span){
                        span.focus();
                        let item = span as myItemSpan;
                        if (span.classList.contains("group")) {

                            appService.selectGroup(item.itemId,span.innerText)
                            // this.props.groupSelected(target.path);//
                        }
                        else {
                            appService.userSelected(span.innerText,item.itemId)
                            // appService.userSelected(span.innerText)
                        }
                    }
                }
            }

        }

        else if (e.keyCode == 37 && (e.target as HTMLElement).classList.contains("group")) {
            // left arrow
            let parent = (e.target as HTMLElement).parentElement
            if(!!parent){
                let ul = parent.querySelector(":scope > ul");
                if(!!ul){
                    if(ul.classList.contains("hidden")){
                        let parent = ul.parentElement ? ul.parentElement.parentElement : null;
                        while(parent && parent.tagName!== "LI"){
                            parent = parent.parentElement;
                            if(!parent){
                                return;
                            }
                        }
                        let span = parent?parent.querySelector(":scope > span"):null;
                        span?(span as HTMLElement).focus():null;
                    }
                    else{
                        ul.classList.add("hidden");
                    }
                }
                else{
                    let parent = e.target.parentElement.parentElement.parentElement
                    parent.querySelector(":scope > span").focus();
                }
            }

        }
        else if (e.keyCode == 39 && (e.target as HTMLElement).classList.contains("group")) {
            // right arrow
            let parent = (e.target as HTMLElement).parentElement;
            if(!!parent){
                let ul = parent.querySelector(":scope > ul");
                if(!!ul){
                    ul.classList.remove("hidden");
                }
            }
        }
    }

    function showHideGroups(e:any):void{
        e.stopPropagation();
        if(e.target.classList.contains("group")) {
            let uls = e.target.parentElement.querySelectorAll(":scope > ul")
            for(let ul of uls){
                ul.classList.toggle("hidden");
            }
        }
    }

    function load(items:Group[]){
        element.addEventListener("keydown",arrowsKeyboard);
        element.addEventListener("dblclick",showHideGroups);
        element.addEventListener("click",(e:any)=> {
            e.stopPropagation();
            if(e.target.tagName !== "LI" && e.target.tagName !== "SPAN" && e.target.tagName !== "IMG"){
                return;
            }
            let target = e.target;
            if(target.tagName === "IMG"){
                target = target.parentElement;
            }
            target.focus();
            let itemId = (target as myItemSpan).itemId;
            if (target.classList.contains("group")) {
                appService.selectGroup(itemId,target.innerText)
            }
            else {
                appService.userSelected(target.innerText,itemId)
                // appService.userSelected(target.innerText)
            }
        });
        clear();
        _generateTree(items,0);
    }

    function _generateTree(items:any[],level:number){
        if(items.length>0){
            const ul = level===0 ? element : document.createElement("ul");
            if(level>0){
                ul.classList.add("hidden")
            }
            items.forEach((item)=> {
                const li = document.createElement("li");
                const span = document.createElement("span");
                (span as myItemSpan).itemId = item.id ;
                if(item.type !== "group"){
                    span.innerHTML = (item.name);
                    // let img = document.createElement("img");
                    // img.setAttribute("src",require("../pic/"+(item as User).getProfileImg()));//fixme
                    // span.insertBefore(img, span.childNodes[0]);
                }
                span.setAttribute("tabindex",level.toString());
                span.style.paddingLeft = (30*level).toString()+"px";
                li.appendChild(span);
                ul.appendChild(li);
                if (item.type === "group") {
                    span.innerHTML = (item.name);
                    span.classList.add("group");
                    let img = document.createElement("img");
                    img.setAttribute("src",group);
                    span.insertBefore(img, span.childNodes[0]);
                    const hiddenUL = _generateTree(item.children,level+1);
                    if(!!hiddenUL){
                        li.appendChild(hiddenUL);
                    }
                }
            });
            return ul;
        }
        else {return ;}
    }

    function clear() {
        while(element.firstChild ){
            element.removeChild(element.firstChild );
        }
    }

    return {
        load,
        clear,
        element,
    };
}

export default TreeChat