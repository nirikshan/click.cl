import Observer from './observer';

var     flatten = function(arr) {
            return [].concat.apply([], arr);
        },
        cX = function(type, props , ...children) {
            return {type:type,props:props,children:flatten(children)}
        },
        clickId =  function( d , n) {
            return d.querySelectorAll(`[c-id='${n}']`);
        },
        PatchServices = function($el , name , id , node , ComponentName , ComponentId) {
          var services = global.$.Clst.services[name];
                if(services){
                   services.watch = function(params) {
                      params($el, Manage , id , node , ComponentName , ComponentId); 
                   }
                }
        },
        createElement =  function(node , state , ComponentName , ComponentId) {
            var t = (node.type ? node.type.toLowerCase() : '');

            if (typeof node === 'string' || typeof node === 'number') {
                return document.createTextNode(node);
            }

            if(t.substr(0,2) == 'c-'){
                var $el = document.createElement('div'),
                name = t.substr(2),
                id = `cl-${name}-${global.$.Clst.c}`;
                $el.setAttribute('C-id', id);
                Manage($el , name , id , node.props , ComponentName , ComponentId)
                global.$.Clst.c += 1;
                PatchServices($el , name , id , node.props , ComponentName , ComponentId)
            }else{
                var $el = document.createElement(node.type)
            }
            setProps(node.props , $el , state , ComponentName , ComponentId);
            node.children.map(function(x) {
                return createElement(x , state , ComponentName , ComponentId)
            }).forEach($el.appendChild.bind($el));
            
            return $el
        },
        clone = function clone(o) {
          var out, v, key;
          out = Array.isArray(o) ? [] : {};
          for (key in o) {
              v = o[key];
              out[key] = (typeof v === "object" && v !== null) ? clone(v) : v;
          }
          return out;
        },
        seperate = function seperate(a){
          var d = {};
          for(var item in a){
            if(item[0] == 'c' && item[1] == '-'){
               d[item.substr(2)] = a[item];
               delete a[item];
            }
          }
          return([a , d]);
        },
        stateManager = function state(){
          for (var newState = {} , i = 0; i < arguments.length; i++) {
              const element = arguments[i];
              $.Clst.connection[element].push(this.ci);
              newState[element] = $.global.state[element];
          }
          return function(b){
            return(b == undefined || b == {}) ? newState : Object.assign(b , newState);
          };
        },
        Manage = function Manage(ground, ComponentName, ComponentId, Props , cn , ci) {
                var component = global.$.Components[ComponentName],
                    Props     = seperate(Props);
                if (component !== undefined) {

                        const data =  clone(Object.assign(typeof component.state  == 'function' ? component.state({state:stateManager , cn:ComponentName , ci:ComponentId}) : component.state , Props[0]));
                        data['$emit'] = function(a , b) {
                         // console.log(global.$.S[ci] , 111)
                          global.$.Components[cn].fn[Props[1][a]].bind(global.$.S[ci])(b)
                        } 
                        global.$.O[ComponentId] = clone(data);

                    var state = new Observer(data , component.auto || {} , ComponentId , ComponentName).data
                      
                    global.$.S[ComponentId] = state;
                    ground.appendChild(createElement(component.view(state , cX) , state , ComponentName , ComponentId))       
                }
        },
        setProps = function setProps(node , el , state , ComponentName , ComponentId) {
            var props = node || {},
            id = el.attributes['cl-id'];
            if (!id) {
                Object.keys(props).forEach(name => {
                    setProp(node, el , name, props[name] , state , ComponentName , ComponentId)
                })
            }
        },
        setProp =  function(props, el , name, value , state , ComponentName , ComponentId){
            if (name.substr(0, 2) === 'c-') {
                cd(el, props, name.substr(2), value , state , ComponentName , ComponentId)
            } else {
                el.setAttribute(name, value)
            }
        },
        cd = function cd(node , props , name , value , state , ComponentName , ComponentId) {
            if (name == 'run') {
              BindAllLayers(state, node, props, name , value, ComponentId)
            } else if (name == 'view') {
                
            } else if (name == 'htm') {
                
            } else if (name == 'if') {
                       
            } else {
                EvaluateEvents(props, name, node, value, state , ComponentName , ComponentId);
            }
        },
        parse = function parse(exp , obj , upto = 0){
          if (/[^\w.$]/.test(exp)) return; 
          var exps = exp.split('.');
          for (var i = 0, len = exps.length; i < len - upto; i++) {
              if (!obj) return;
              obj = undefined !== obj[exps[i]] ? obj[exps[i]] : false;
          }
          if(obj){
              return obj;
          }
        },
        BindAllLayers = function BindAllLayers(scope, tag, props, name ,value, ComponentId) {
          var attr = tag.nodeName === 'INPUT' ? (tag.attributes.type && tag.attributes.type.value) : tag.nodeName == 'SELECT' ? 'select' : tag.nodeName,
              s = (-1 !== ['checkbox', 'radio','select'].indexOf(attr) ? 'change' : 'input'),
               val   = value.split('.').reverse()[0];
               scope = parse(value , scope , 1); // pure scope is for loop no need to parse
      
          tag.addEventListener(s, function(e) {
              var va = ('change' == s ? this.checked || this.value : ((tag.attributes.type && tag.attributes.type.value == 'file') ? this.files[0] : this.value));
              scope[val] = va;
          });
          tag.value = scope[val];    
        },
        EvaluateEvents = function EvaluateEvents(props, name, node , value, state , ComponentName , ComponentId) {
            var kl = global.$.Components[ComponentName];
            if (kl) {
                var state = global.$.S[ComponentId],
                caller    = null;
                if(value.indexOf(')') !== -1){
                    var splits = value.replace(/\\"/g, '').split(')')[0].split('('),
                    value  = splits[0],
                    caller = splits[1];
                }
                var params  =  caller && caller.split(','), main = [],
                    lv      =  ('function' !== typeof(kl.fn)   ? ((kl.fn[value]) || console.error) : console.error);
                    main[1] = kl.fn;
                    //params.unshift()
            
                node.addEventListener(name, function(a) {
                  //a.__proto__.constructor.name
                 main[0] = a;
                  // params.splice(0,0,a)
                  lv.name == 'error'? lv('can\'t find events method') :
                                      lv.apply(state , main.concat(params));
                                     
                })
            }
        },
        patchProps = function patchProps(parent, patches) {
          for (let i = 0; i < patches.length; i++) {
            const propPatch = patches[i]
            const {type, name, value} = propPatch;
            var  id = parent.attributes['c-id'];

            if (type === 4 && !id) { 
              parent.attributes[name].value = value;
            }
            if (id) { // Dynamic props
              $.S[id.value][name] = value; 
            }
            if(type === 6){
              parent.value = parse(value ,$.S[propPatch.ci] , 0) || ''
            }
          }
        },        
        patch = function(parent, patches, index = 0) { //@
          if (!patches) { return }
          const el   = parent.childNodes[index],
                type = patches.type,
                newNode = patches.newNode;
            
            if(type == 3){
              return el && el.data !== newNode ? el.data = newNode:'';
            }
            
            if(type == 1){
               var newEl = createElement(newNode , global.$.S[patches.ci] , patches.cn , patches.ci);
               return parent.appendChild(newEl)
            }
            if(type == 2){
              return parent.removeChild(el);
            }
            if(type == 5){
               return  parent.innerHTML = ''
            }
            if(type == 0){
              const {props, children} = patches;
              patchProps(el, props)
              for (let i = 0; i < children.length; i++) {
                patch(el, children[i], i)
              }
            }
        },
        diffProps = function diffProps(newNode, oldNode , ci , cn) {
          const patches = []
          const props = Object.assign({}, newNode.props, oldNode.props)
          Object.keys(props).forEach(name => {
            const newVal = newNode.props[name];
            const oldVal = oldNode.props[name];
            if(!newVal) {
              //patches.push({type: REMOVE_PROP, name, value: oldVal})
            } else if(newNode.props['c-run'] && name == 'c-run'){
              patches.push({type: 6, name , value: newVal , ci , cn})
            }else if (!oldVal || newVal !== oldVal) {
              patches.push({type: 4, name, value: newVal})
            }
          });
          //console.log(patches)
          return patches
        },
        diff = function(newNode, oldNode , ci , cn) {  //@
            
          if(typeof(newNode) == 'function' && typeof(oldNode) == 'function' ){
           // console.log(newNode == oldNode)
          }
          
          if(typeof(newNode) == 'string' || typeof(oldNode) == 'number'){
            if(changed(newNode, oldNode)) {
              return {type:3, newNode}; //editing textnode
            }
          }

          if(typeof(newNode) === 'object' && oldNode === undefined){
            return {type:1, newNode , ci , cn}//adding el
          }

          if(typeof(oldNode) === 'object' && newNode === undefined){
            return {type:2, newNode}//removing element
          }
          
          if(typeof(oldNode) === 'object' && (newNode == true || newNode == false)){
           return {type:5, newNode}//removing element
          }

          if(typeof(newNode) === 'object' && (oldNode == true || oldNode == false)){//adding element
            return {type:1  , newNode , ci , cn};//adding
          }
          
          if(typeof(newNode) == 'object' && typeof(oldNode) == 'object'){
            if(newNode.type) {
              return {
                type: 0,
                props: diffProps(newNode, oldNode , ci , cn),
                children: diffChildren(newNode, oldNode , ci , cn),
              }
            }
          }
          
        },
        changed = function(node1, node2) {
            return typeof node1 !== typeof node2 ||
                   typeof node1 === 'string' && node1 !== node2 ||
                   node1.type !== node2.type
        },
        diffChildren = function(newNode, oldNode , ci , cn) {
            const patches = []
            const patchesLength = Math.max(
              newNode.children.length,
              oldNode.children.length
            )
            for (let i = 0; i < patchesLength; i++) {
              patches[i] = diff(
                newNode.children[i],
                oldNode.children[i],
                ci,
                cn
              )
            }
            return patches
        },
        UpdateData = function(val , ci , cn) {
            var view      =   global.$.Components[cn],
                NewData   =   global.$.S[ci],
                OldData   =   global.$.O[ci],
                el        =   clickId(document.body , ci)[0],
                New       =   view.view(NewData ,cX ),
                Old       =   view.view( OldData , cX), 
                patches   =   diff(New, Old , ci , cn);
                patch(el, patches)

                global.$.O[ci] = clone(NewData);
        }

export {
    Manage,
    UpdateData
}
