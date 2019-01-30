import D from './store.js'
import {
    ValuePlacer,
    RenderLoop,
    exe,
    ParseAttrValue,
    DirView,
    HtmBind,
    createElement,
    getBool,
    DestroyComponent
} from './render.js';

export default class Watcher {
    constructor(vm, node, name, nodeType, all) {
        D.target = this
        this.name = name;
        this.node = node;
        this.vm = vm;
        this.om = all;
        this.nodeType = nodeType;
        this.update();
        D.target = null;
    }
    update() {
        this.get();
        if(this.nodeType === 1 ){
           // console.log(this.value , this.name , this)
            this.node.data = this.value;
        }
        if(this.nodeType === 2){
           this.node.setAttribute(this.om.info.name , this.value)
        }
        if (this.nodeType == 3) {
            var orginalData = this.value
            this.om.toScope[this.om.name] = orginalData;
        }
        if (this.nodeType === 8) {
            RenderLoop(this);
        }
        if (this.nodeType === 4) {
            if (['checkbox', 'radio'].indexOf(this.node.attributes.type.value) !== -1) {
                this.node.checked = this.value;
            } else if (this.node.attributes.type.value !== 'file') {
                this.node.value = this.value;
            }
        }
        if (this.nodeType === 5) {
            DirView(this.vm, this.node, this.name);
        }
        if (this.nodeType === 6) {
            HtmBind(this.vm, this.node, this.name);
        }
        if (this.nodeType === 7) {
            var me = this.om.tag;
            if (this.value == true) {
                DestroyComponent(me, function() {
                    me.innerHTML = null;
                })
            } else if(this.value == false){
                me.innerHTML = null;
                var fragemnts =  document.createDocumentFragment(),
                    Element  =  this.node;
                    delete Element.props['cl-if'];           
                    var Element = createElement(Element, this.vm, this.om.ci, this.om.cn);
                    fragemnts.appendChild(Element)
                    this.om.tag.appendChild(fragemnts)
            }
        }
      }
      
      get() {
         // console.log(this)
        if (this.nodeType === 1) {
            this.value = this.vm[this.name] !== undefined ? this.vm[this.name] : ValuePlacer(this);
        }

        if (this.nodeType === 2) {
            this.value = ParseAttrValue(this);
        }
        if (this.nodeType === 3) { //props binding from parent component to child components
            this.value = (this.name.indexOf('.') !== -1 ? exe(this.vm, this.name) : this.vm[this.name])
        }
        if (this.nodeType === 8) {
           this.value = this.vm[this.name] || exe(this.vm , this.name);
        }
        if (this.nodeType === 4) { //mvc run binding
            this.value = this.vm[this.name]
        }
        if (this.nodeType === 7 && this.vm !== undefined) { //if binding
            
            if(this.name == 'true' || this.name == '1' || this.name == '!0' || this.name == 'TRUE'){
                this.value = true;
            }else{
                var val = exe(this.vm , this.name );
                if(val !== undefined){
                    this.value = exe(this.vm , this.name );
                }else{
                    this.value = false;
                }
            }
            
           // this.value = this.vm[this.name]
        }
      }
}


