function enableElement(eid){
  let elm = document.getElementById(eid);
  elm.removeAttribute('disabled');
  htmlConvert();
}

function toggleElement(eid){
  let elm = document.getElementById(eid);
  if(elm.hasAttribute('disabled')) elm.removeAttribute('disabled');
  else elm.setAttribute('disabled', true);
  htmlConvert();
}

function changeElement(eid, attrs){
  let elm = document.getElementById(eid);
  for(let a in attrs){
    elm.setAttribute(a, attrs[a]);
  }
  htmlConvert();
}

function newElement(type, eid, attrs={}){
  let elm = document.createElement(type);
  elm.setAttribute('id', eid);
  for(let a in attrs){
    elm.setAttribute(a, attrs[a]);
  }
  prompt_container.appendChild(elm);
  htmlConvert();
}

function delElement(eid){
  let elm = document.getElementById(eid);
  elm.parentNode.removeChild(elm);
  htmlConvert();
}