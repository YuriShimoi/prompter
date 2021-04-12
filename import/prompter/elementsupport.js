function enableElement(eid){
  let elm = document.getElementById(eid);
  elm.removeAttribute('disabled');
  htmlConvert();
}

function toggleElement(eid){
  let elm = document.getElementById(eid);
  if(elm.hasAttribute('disabled') && elm.getAttribute('disabled') === "true") elm.setAttribute('disabled', "false");
  else elm.setAttribute('disabled', "true");
  htmlConvert();
}

function changeElement(eid, attrs){
  let elm = document.getElementById(eid);
  for(let a in attrs){
    elm.setAttribute(a, attrs[a]);
  }
  htmlConvert();
}

function newElement(type, attrs={}, pid){
  let elm = document.createElement(type);
  for(let a in attrs){
    elm.setAttribute(a, attrs[a]);
  }
  if(pid === null)
    prompt_container.appendChild(elm);
  else
    document.getElementById(pid).appendChild(elm);
  htmlConvert();
}

function delElement(eid){
  let elm = document.getElementById(eid);
  elm.parentNode.removeChild(elm);
  htmlConvert();
}