function Prompter(eid) {
  return new class PrompterDOMElement {
    constructor(eid) {
      this.eid = eid;
    }

    get() {
      return document.getElementById(this.eid);
    }

    move(mx, my) {
      let elm = document.getElementById(this.eid);
      if(!elm) return undefined;

      return this.moveTo(Number(elm.getAttribute('x')) + mx, Number(elm.getAttribute('y')) + my);
    }

    moveTo(mx, my) {
      return this.update({ x: mx, y: my });
    }

    enable() {
      let elm = document.getElementById(this.eid);
      if(!elm) return undefined;
    
      elm.removeAttribute('disabled');
      return this;
    }
    
    disable() {
      let elm = document.getElementById(this.eid);
      if(!elm) return undefined;
    
      elm.setAttribute('disabled', "true");
      return this;
    }
    
    toggle() {
      let elm = document.getElementById(this.eid);
      if(!elm) return undefined;
    
      if(elm.hasAttribute('disabled')) {
        if(elm.getAttribute('disabled') === "false") elm.setAttribute('disabled', "true");
        else elm.setAttribute('disabled', "false");
      }
      else elm.setAttribute('disabled', "true");

      return this;
    }
    
    update(attrs) {
      let elm = document.getElementById(this.eid);
      if(!elm) return undefined;
    
      for(let a in attrs) {
        elm.setAttribute(a, attrs[a]);
      }

      return this;
    }
    
    append(type, attrs={}) {
      let elm = document.createElement(type);
      for(let a in attrs) {
        elm.setAttribute(a, attrs[a]);
      }
      if(this.eid === null) {
        PrompterPlotting.prompt_container.appendChild(elm);
      }
      else {
        let elmp = document.getElementById(this.eid);
        if(!elmp) return false;
    
        elmp.appendChild(elm);
      }

      return this;
    }
    
    delete() {
      let elm = document.getElementById(this.eid);
      if(!elm) return undefined;
      elm.parentNode.removeChild(elm);
    }
  }(eid);
}