function enableElement(eid, draw=true) {
  let elm = document.getElementById(eid);
  if(!elm) return false;

  elm.removeAttribute('disabled');
  if(draw) htmlConvert();
}

function disableElement(eid, draw=true) {
  let elm = document.getElementById(eid);
  if(!elm) return false;

  elm.setAttribute('disabled', "true");
  if(draw) htmlConvert();
}

function toggleElement(eid, draw=true) {
  let elm = document.getElementById(eid);
  if(!elm) return false;

  if(elm.hasAttribute('disabled') && elm.getAttribute('disabled') === "true") elm.setAttribute('disabled', "false");
  else elm.setAttribute('disabled', "true");
  if(draw) htmlConvert();
}

function changeElement(eid, attrs, draw=true) {
  let elm = document.getElementById(eid);
  if(!elm) return false;

  for(let a in attrs) {
    elm.setAttribute(a, attrs[a]);
  }
  if(draw) htmlConvert();
}

function newElement(type, attrs={}, pid, draw=true) {
  let elm = document.createElement(type);
  for(let a in attrs) {
    elm.setAttribute(a, attrs[a]);
  }
  if(pid === null) {
    prompt_container.appendChild(elm);
  }
  else {
    let elmp = document.getElementById(pid);
    if(!elmp) return false;

    elmp.appendChild(elm);
  }
  if(draw) htmlConvert();
}

function delElement(eid, draw=true) {
  let elm = document.getElementById(eid);
  if(!elm) return false;
  
  elm.parentNode.removeChild(elm);
  if(draw) htmlConvert();
}