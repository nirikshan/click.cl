import Observer from './observer';

var flatten = (arr) => ([].concat.apply([], arr)),
    cX = (type, props, ...children) => ({
        type: type,
        props: props,
        children: flatten(children)
    }),
    clickId = (d, n) => (d.querySelectorAll(`[c-id='${n}']`)),
    ElementType = (tag) => {
        var attr = tag.nodeName === 'INPUT' ? (tag.attributes.type && tag.attributes.type.value) : tag.nodeName == 'SELECT' ? 'select' : tag.nodeName;
        return [attr, (-1 !== ['checkbox', 'radio', 'select'].indexOf(attr) ? 'change' : 'input')];
    },
    PatchServices = function($el, name, id, node, ComponentName, ComponentId) {
        var services = global.$.Clst.services[name];
        if (services) {
            services.watch = function(params) {
                params($el, Manage, id, node, ComponentName, ComponentId);
            }
        }
    },
    createElement = function(node, state, ComponentName, ComponentId) {
        var t = (node !== undefined && node !== null && node.type ? node.type.toLowerCase() : '');
        if (typeof node === 'string' || typeof node === 'number' || node == undefined || node == null) {
            return document.createTextNode(node);
        }
        if (t.substr(0, 2) == 'c-') {
            var $el = document.createElement('div'),
                name = t.substr(2),
                id = `cl-${name}-${global.$.Clst.c}`;
            $el.setAttribute('c-id', id);
            Manage($el, name, id, node.props, ComponentName, ComponentId)
            global.$.Clst.c += 1;
            PatchServices($el, name, id, node.props, ComponentName, ComponentId)
        } else {
            var $el = document.createElement(node.type)
        }
        setProps(node.props, node, $el, state, ComponentName, ComponentId);
        node.children.map(function(x) {
            return createElement(x, state, ComponentName, ComponentId)
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
    seperate = function seperate(a, p, n) {
        var d = {};
        for (var item in a) {
            var check = item[0] == 'c' && item[1] == '-'
            if (check) {
                d[item.substr(2)] = a[item];
                delete a[item];
            }
            if (!check && p.indexOf(item) == -1) {
                delete a[item];
                console.error(item + ' cannot be used as props , Make sure "' + n + '" component accept this props')
            }
        }
        return ([a, d]);
    },
    stateManager = function state() {
        for (var newState = {}, i = 0; i < arguments.length; i++) {
            const element = arguments[i];
            $.Clst.connection[element].push(this.ci);
            newState[element] = $.global.state[element];
        }
        return function(b) {
            return (b == undefined || b == {}) ? newState : Object.assign(b, newState);
        };
    },
    Manage = function Manage(ground, ComponentName, ComponentId, Props, cn, ci) {
        var component = global.$.Components[ComponentName];
        if (!component) {
            return;
        };
        var Hook = component.fn;
        Props = seperate(Props, component.props || [], ComponentName);
        if (component !== undefined) {
            const data = clone(Object.assign(typeof component.state == 'function' ? component.state({
                state: stateManager,
                cn: ComponentName,
                ci: ComponentId
            }) : component.state, Props[0]));
            data['$emit'] = function(a, b) {
                global.$.Components[cn].fn[Props[1][a]].bind(global.$.S[ci])(b)
            }
            global.$.O[ComponentId] = clone(data);
            var state = new Observer(data, component.auto || {}, ComponentId, ComponentName).data
            global.$.S[ComponentId] = state;
            Hook && typeof Hook['start'] == 'function' && Hook['start'](state);
            ground.appendChild(createElement(component.view(state, cX), state, ComponentName, ComponentId))
        }
    },
    setProps = function setProps(Props, node, el, state, ComponentName, ComponentId) {
        var props = Props || {},
            id = el.attributes['c-id'];
        if (!id) {
            Object.keys(props).forEach(name => {
                setProp(Props, node, el, name, props[name], state, ComponentName, ComponentId)
            })
        }
    },
    setProp = function(props, node, el, name, value, state, ComponentName, ComponentId) {
        if (name.substr(0, 2) === 'c-') {
            cd(node, el, props, name.substr(2), value, state, ComponentName, ComponentId)
        } else {
            el.setAttribute(name, value)
        }
    },
    cd = function cd(node, element, props, name, value, state, ComponentName, ComponentId) {
        if (name == 'run') {
            BindAllLayers(node, props, state, element, value, ComponentId)
        } else if (name == 'view') {
            element.style.display = state[value] ? 'block' : 'none';
        } else if (name == 'htm') {

        } else if (name == 'if') {

        } else {
            EvaluateEvents(props, name, element, value, state, ComponentName, ComponentId);
        }
    },
    parse = function parse(value, j) {
        var va = value[0];
        if (typeof va !== 'object') return va;
        for (let i = 1; i < value.length - j; i++) {
            va = va[value[i]]
        }
        return (va)
    },
    BindBox = function(type, value, scope) {
        var va = ('change' == type ? this.checked || this.value : ((this.attributes.type && this.attributes.type.value == 'file') ? this.files[0] : this.value));
        if (Array.isArray(value)) {
            var main = value[value.length - 1];
            parse(value, 1)[main] = va
        } else {
            scope[value] = va;
        }
    },
    BindAllLayers = function BindAllLayers(node, props, scope, tag, value, ComponentId) {
        var type = ElementType(tag)[1];
        /*
         * I am placing BindFunction inside extends of each binded element because , each element may be 
         * binded by each data 
         */
        tag.addEventListener(type, BindBox.bind(tag, type, value, scope));
        tag.value = Array.isArray(value) ? parse(value, 0) : scope[value];
    },
    EvaluateEvents = function EvaluateEvents(props, name, node, value, state, ComponentName, ComponentId) {
        var kl = global.$.Components[ComponentName];
        if (kl) {
            var state = global.$.S[ComponentId],
                caller = null;
            if (value.indexOf(')') !== -1) {
                var splits = value.replace(/\\"/g, '').split(')')[0].split('('),
                    value = splits[0],
                    caller = splits[1];
            }
            var params = caller && caller.split(','),
                main = [],
                lv = ('function' !== typeof(kl.fn) ? ((kl.fn[value]) || console.error) : console.error);
            main[1] = kl.fn;

            node.addEventListener(name, function(a) {
                main[0] = a;
                lv.name == 'error' ? lv('can\'t find events method : ' + value) :
                    lv.apply(state, main.concat(params));
            })
        }
    },
    changed = function(node1, node2) {
        return typeof node1 !== typeof node2 ||
            typeof node1 === 'string' && node1 !== node2 ||
            node1.type !== node2.type
    },
    Newpatch = function Newpatch(parent, oldNode, newNode, ci, cn, data, index = 0) {
        if (!parent) return;
        var el = parent.childNodes[index];
        if (typeof(newNode) == 'function' && typeof(oldNode) == 'function') {
            // console.log(newNode == oldNode)
        }
        if (typeof(newNode) == 'string' || typeof(oldNode) == 'number') {
            if (changed(newNode, oldNode)) {
                /*
                 * text node update
                 */
                return el && el.data !== newNode ? el.data = newNode : '';
            }
        }
        if (
            (typeof(newNode) === 'object' && oldNode === undefined) ||
            (typeof(newNode) === 'object' && (oldNode == true || oldNode == false))
        ) {
            /*
             * Add element 
             */
            var newEl = createElement(newNode, global.$.S[ci], cn, ci);
            return parent.appendChild(newEl)
        }

        if (typeof(oldNode) === 'object' && newNode === undefined) {
            /*
             * Remove element 
             */
            return parent.removeChild(el);
        }
        if (typeof(oldNode) === 'object' && (newNode == true || newNode == false)) {
            /*
             * Remove content parent.innerHTML = ''  
             */
            return parent.innerHTML = ''
        }
        if (typeof(newNode) == 'object' && typeof(oldNode) == 'object') {
            if (newNode.type) {
                // var props =  diffProps(newNode, oldNode, ci, cn);
                var props = Object.assign({}, newNode.props, oldNode.props)
                Object.keys(props).forEach(name => {
                    const newVal = newNode.props[name];
                    const oldVal = oldNode.props[name];
                    var id = parent.attributes['c-id'];

                    if (!newVal) {
                        // patches.push({type: REMOVE_PROP, name, value: oldVal})
                    } else if (newNode.props['c-run'] && name == 'c-run') {
                        var o = parse(oldVal, 0),
                            n = parse(newVal, 0);
                        if (o !== n) {
                            if (Array.isArray(newVal)) {
                                el.value = n;
                            } else {
                                el.value = $.S[propPatch.ci][newVal];
                            }
                        }
                    } else if (name == 'c-view') {
                        el.style.display = $.S[ci][newVal] ? 'block' : 'none';
                    } else if (!oldVal || newVal !== oldVal) {
                        /*
                         * Simply attribute changing 
                         */
                        el.attributes[name].value = newVal;
                    }
                    if (id) { // Dynamic props
                        if (typeof value == 'object') {
                            $.S[id.value][name] = clone(newVal)
                        } else {
                            $.S[id.value][name] = newVal;
                        }
                    }

                });

                /*
                 * Childrens diff and patching 
                 */
                var patchesLength = Math.max(newNode.children.length, oldNode.children.length);
                for (let i = 0; i < patchesLength; i++) {
                    // console.log(oldNode.children[i] ,  newNode.children[i])
                    Newpatch(el, oldNode.children[i], newNode.children[i], ci, cn, data, i)
                }
            }
        }
    },
    UpdateData = function(val, ci, cn, state, key, view, UpdateReportData) {
        var view = global.$.Components[cn];
        if (view !== undefined) {
            var NewData = global.$.S[ci],
                OldData = global.$.O[ci],
                el = clickId(document.body, ci)[0],
                New = view.view(NewData, cX),
                Old = view.view(OldData, cX);
            Newpatch(el, Old, New, ci, cn, UpdateReportData);
            global.$.O[ci] = clone(NewData);
        } else {
            // console.log(ci , '---')
        }
    },
    LogicalUpdator = function(updating, neu) {
        var neu = clone(neu);
        neu.forEach((el, index) => {
            var dx = updating[index];
            if (!dx) {
                updating.push(el);
            }
        });
    };

export {
    Manage,
    UpdateData,
    LogicalUpdator
}
