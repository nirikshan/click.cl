import Observer from './observer.js'
import Watcher from './watcher.js';

var createElement = function createElement(tree, state, ComponentId, ComponentName, xvc) {
        var xvc = xvc || {
            st: 1
        };
        var view = (tree.type ? tree.type.toLowerCase() : null);
        if (typeof tree === 'string') {
             return processText(tree, state, xvc);
        }
        if (view.substr(0, 3) === 'cl-') {
            var $el = document.createElement('div'),
                ComponentName = view.substr(3),
                ComponentId = 'cl-' + ComponentName + '-' + global.$.Clst.c;
                $el.setAttribute('Cl-id', ComponentId);
                global.$.Clst.c = global.$.Clst.c + 1;
                Manage($el, ComponentName, ComponentId, tree.props, xvc);
        } else {
            var $el = document.createElement(view);
        }

        tree.children.map(function(x) {
            return createElement(x, state, ComponentId, ComponentName, xvc)
        }).forEach($el.appendChild.bind($el));

        setProps(tree, $el, state, ComponentId, ComponentName, xvc);
        return $el
    },
    Manage = function Manage(ground, ComponentName, ComponentId, Props, xvc) {
        var component = global.$.Components[ComponentName];

        if (component !== undefined) {

            var NewState = updateObj(component.state, Props),
                Scope = new Observer(NewState, component.auto || {} , ComponentId);
            global.$.S[ComponentId] = Scope.data;

            ground.appendChild(createElement(component.view, Scope.data, ComponentId, ComponentName, {
                st: false
            }));
            
            //if(global.$.Clst.c < 3){
                PATCH_PENDING_TASK();
              //              }
                            
        }
    },
    setProps = function setProps(tree, tag, state, ComponentId, ComponentName, xvc) {
        var props = tree.props || {},
            id = tag.attributes['cl-id'];
        if (!id) {
            Object.keys(props).forEach(name => {
                setProp(props, name, tag, tree, state, ComponentId, ComponentName, xvc);
            })
        } else if (id) { //here we get the props of main component call tag           
            Object.keys(props).forEach(name => {
                PatchProps(props, name, state, tag, ComponentId);
            })
        }
    },
    PatchProps = function PatchProps(props, name, state, tag, ComponentId) {
        var AttributeState = state,
            AttributeValue = global.$.S[ComponentId],
            val = props[name];


        if (bindingTest(val)) {
            var val = val.replace(/}|{/g, ''),
                valBinding = AttributeState[val.trim()];
            AttributeValue[name.trim()] = valBinding;

            new Watcher(state, tag, val.trim(), 3, {
                toScope: global.$.S[ComponentId],
                name: name.trim()
            });
            // new Watcher(lib.S[ComponentId], tag , name.trim()  , 4 , {
            //     toScope:state ,
            //     name:val.trim()
            // });//back propragation
        }
    },
    setProp = function setProp(props, name, tag, tree, state, ComponentId, ComponentName, xvc){
        if (name.substr(0, 3) === 'cl-') { //if this is directive
            ClicksDirective(props, name, tag, tree, state, ComponentId, ComponentName , xvc);
        } else if (bindingTest(props[name])) {
            var value                    =  props[name];
            ManageReactiveAttribute(value, state , tag , xvc ,{value, name})
        } else {
            tag.setAttribute(name, props[name])
        }  
    },
    ManageReactiveAttribute = function ManageReactiveAttribute(text, state , tag , xvc , props){
        var bindings = findBindings(text);
        props['all'] = bindings;
        MakeOrder(bindings[0], state , tag , xvc , 2  , props);//only 1 binding is enough  
    },
    ClicksDirective = function(props , name , tag , tree , state , ComponentId , ComponentName , xvc) {
        var name = name.split('-')[1],
        value = props['cl-' + name].replace(/}|{/g, '');
        if (name == 'loop') {
            ManageLoop(props, name, tag, value, tree, state, ComponentId, ComponentName , xvc);
        } else if (name == 'run') {
            BindAllLayers(state, tag, props, name , ComponentId)
        } else if (name == 'view') {
            new Watcher(state, tag, value, 5)
        } else if (name == 'htm') {
            new Watcher(state, tag, value, 6)
        } else if (name == 'if') {
            global.$.Clst.bl.push({
                itm: tag,
                val: value,
                cn: ComponentName,
                ci: ComponentId,
                vd: tree,
                state: state,
                type: 7
            }) //keeping task pending        
        } else {
            EvaluateEvents(props, name, tag, tree, state, ComponentId, ComponentName);
        }
    },
    BindAllLayers = function BindAllLayers(scope, tag, props, name , ComponentId) {
        var s = (-1 !== ['checkbox', 'radio'].indexOf(tag.attributes.type.value) ? 'change' : 'input'),
            value = props['cl-' + name].replace(/}|{/g, ''),
            val   = value.split('.').reverse()[0];
            scope = parse(value , $.S[ComponentId] , 1) || parse(value , scope , 1) || scope ; // pure scope is for loop no need to parse
        tag.addEventListener(s, function(e) {
            var va = ('change' == s ? this.checked : ((tag.attributes.type.value == 'file') ? this.files[0] : this.value));
            scope[val] = va;
        });
        new Watcher(scope, tag, val , 4)
    },
    EvaluateEvents = function EvaluateEvents(props, name, tag, tree, state, ComponentId, ComponentName) {
        var kl = global.$.Components[ComponentName];
        if (kl) {
            var lv = kl.events[props['cl-' + name]].bind(global.$.S[ComponentId]);
            tag.addEventListener(name, function(a) {
                lv(a)
            })
        }
    },
    ManageLoop = function ManageLoop(props, name, tag, value, tree, state, ComponentId, ComponentName , xvc) {
        var m      =  value.split('>>');
        var tar    =  exe(state , m[0]),
            gx     =  tree.children.length;

        if (gx >= 1 && tar !== undefined) {
            for (var i = 0; i < gx; i++) {
                var kt = tree.children[i];
                if (typeof(kt) == 'object') {
                    ProcessLoop(tag, kt, state, ComponentId, ComponentName, tar, m , xvc);
                    break
                }
            }
        }
    },
    ProcessLoop = function pl(tag, kt, state, ComponentId, ComponentName, tar, m , xvc) {
        if (tar) {
            new Watcher(state, tag, m[0], 8, {
                exp: m,
                ci: ComponentId,
                cn: ComponentName,
                root: kt,
                store: ManageStorage(tar),
                xvc:xvc
            });
           // console.log(loop)
        }
    },
    ManageStorage = function ManageStorage(o) {
        var output, v, key;
        output = Array.isArray(o) ? [] : {};
        for (key in o) {
            v = o[key];
            output[key] = (typeof v === "object" && v !== null) ? ManageStorage(v) : v;
        }
        return output;
    },
    updateObj = function updateObj(a, b) {
        var c = {};
        for (var key in a) c[key] = a[key];
        for (var key in b) c[key] = (Array.isArray(a[key])) ? a[key].concat(b[key]) : b[key];
        return c
    },
    bindingTest = function bindingTest(name , type) {
        return (/\{(.*)\}/.test(name))
    },
    findBindings = function findBindings(x) {
        return(x.match(/[^{]+?(?=\})/g) || []);
    },
    RenderLoop = function RenderLoop(v) {
        
        if(v.task == undefined || v.task.method === 'del' || v.task.method == 'reverse'){  
            DestroyComponent(v.node, function() {
                v.node.innerHTML = null;
            })
            InitilizeLoop(v.value, v, v.om.ci);
        }else if(v.task.method == "search"){
            DestroyComponent(v.node, function() {
                v.node.innerHTML = null;
            })
            InitilizeLoop(v.task.args, v, v.om.ci);
        }else{
            if (v.task.method == 'push') {
                InitilizeLoop(v.task.args, v, v.om.ci);
            }
        }
        
    },
    DestroyComponent = function DestroyComponent(parent, call) { //if will remove component then i need to remove it's state too
        var count = 0
        parent.querySelectorAll('[Cl-id]').forEach(function(a) {
            a.remove()
            delete(global.$[a.getAttribute('Cl-id')]) //remove state of element
            count = count + 1;
        });
        global.$.Clst.c = global.$.Clst.c - count;
        call(true);
    },
    MakeOrder = function MakeOrder(text , state , element , config , mode , info){
            var val                  =  text.replace(/}|{/g, '');
            if(state !== undefined ){
                new Watcher(state, element, val , mode , {
                    config : config,
                    here   : val,
                    info   : info
                })
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
    exe = function(scope , exp) {
        if(parse(exp , scope)){
            var expp = 'var a = d.'+exp+'; return(a)';
            var re =  new Function('d' , expp);
            return(re(scope))
        }
        
    },
    processText = function processText(text , state , xvc) {
        var TextNode = document.createTextNode(text);
        if(bindingTest(text , 1)){
            MakeOrder(text.trim().replace(/}|{/g, '') , state , TextNode , xvc , 1);  
        }
        return TextNode
    },
    InitilizeLoop = function dP(gX, v, ComponentId) { //disPatch to view layer
        for (var i = 0; i < gX.length; i++) {
            var target = {};
            target[v.om.exp[1]] = gX[i];
            v.node.appendChild(createElement(v.om.root, target, v.om.ci, v.om.cn, {
                exp: v.om.exp,
                st: !0,
                ci: ComponentId,
                p: v.vm //this is last scope , this is used in nested loop
            }));
        }
    },
    escape = str => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
    ValuePlacer = function ValuePlacer(object) {
        var value = exe(object.vm , object.name) || 
                    exe(object.om.config.p , object.name) || 
                    exe(global.$.S[object.om.config.ci] , object.name);
        return value;
    },
    ParseAttrValue = function(a) {
        var MainState   = a.vm,
            config      = a.om.info.all,
            tx        = a.om.info.value;
            for (var i = 0; i < config.length; i++) {
                var el  = config[i];
                var value = exe(MainState , el) || exe(a.om.config.p , el) || exe(global.$.S[a.om.config.ci] , el) ;
                tx = tx.replace(new RegExp('{' + escape(el) + '}', 'g'), value)
            }
            return(tx);
    },
    PATCH_PENDING_TASK = function PATCH_PENDING_TASK() {
        var list = global.$.Clst.bl,
            vx = list.length;
        if (vx > 0) {
            for (var t = 0; t < vx; t++) {
                var v2 = list[t];
                if (typeof(v2) == 'object') {
                    if (v2['val']) {
                        var state = v2.state,
                            vd    = v2.vd,
                            value = v2.val,
                            itm   = v2.itm,
                            ci    = v2.ci,
                            cn    = v2.cn;
                            delete global.$.Clst.bl[t]; //remove pendings jobs // if not removed then stackoverflow occurs
                            console.log(ci)
                            new Watcher(state, vd ,value, 7, {
                                tag:itm,
                                ci:ci,
                                cn:cn
                            });
                            
                    }
                }
            }
        }
    }



export {
    Manage,
    ValuePlacer,
    RenderLoop,
    exe,
    ParseAttrValue,
    parse,
    DirView,
    HtmBind,
    createElement,
    DestroyComponent
}