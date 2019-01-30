import Dep from './store.js';
import { parse } from './render';


export default class Observer {

    constructor(data, auto , ci) {
        this.data = data;
        this.observe(data, auto , ci);
    }

    observe(data, auto , ci) {
        var self = this;
        if (!data || typeof data !== 'object') {
            return;
        }
        Object.keys(data).forEach(function(key) {
            self.observeObject(data, key, data[key], auto[key] , ci);
        });
    }

    observeObject(data, key, val, compute , ci) {
        var dep = new Dep();
        var self = this;
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get: function() {
                if (Dep.target && !dep.subs.includes(Dep.target)) {
                    Dep.target['key'] = key;
                    dep.addSub(Dep.target)
                }
                return (void 0 !== compute) ? compute.bind(global.$.S[ci])(val) : val
            },
            set: function(newVal) {
                if (val === newVal) {
                    return;
                }
                val = newVal;
                if (Array.isArray(newVal)) {
                    self.observeArray(newVal, dep);
                } else {
                    self.observe(newVal, {});
                }
                dep.notify()
            },
        });

        if (Array.isArray(val)) {
            self.observeArray(val, dep);
        } else {
            if(typeof(val) === 'object'){
                self.observe(val, {});
            }   
        }
    }

    observeArray(arr, dep) {
        var self = this;
        arr.__proto__ = self.defineReactiveArray(dep);

        //C(dep.subs, arr)

        arr.forEach(function(item, z) {
            self.observe(item, {});
        });
    }

    defineReactiveArray(dep) {
        var arrayPrototype = Array.prototype;
        var arrayMethods = Object.create(arrayPrototype);
        var self = this;

        // Rewrite the array manipulating methods.
        var methods = [
            'pop', //
            'push', //
            'sort',
            'shift', //
            'splice', //
            'unshift',
            'reverse', //
            'clone', //
            'search',
            'del'
        ];

        methods.forEach(function(method) {
            var original = arrayPrototype[method];

            Object.defineProperty(arrayMethods, method, {
                value: function() {
                    var args = [];

                    for (var i = 0, l = arguments.length; i < l; i++) {
                        args.push(arguments[i]);
                    }

                    if (method == 'clone') {
                        self.update(this, args, dep.subs)
                    } else if (method == 'search') {
                       var args = self.find(this , args);
                    } else if (method == 'del') {
                       self.del(this, args)
                    } else {
                        var result = original.apply(this, args);
                    }


                    var inserted;
                    switch (method) {
                        case 'push':
                        case 'unshift':
                            inserted = args;
                            break
                        case 'splice':
                            inserted = args.slice(2)
                            break
                    }

                    if (inserted && inserted.length) {
                        self.observeArray(inserted, dep)
                    }
                    // fire the update
                    dep.notify({
                        method,
                        args
                    });

                    return result
                },
                enumerable: true,
                writable: true,
                configurable: true
            });
        });

        return arrayMethods;
    }

    update(a, b, c) { //clone tail
        if (Array.isArray(a) && typeof(b) == 'object') {
            var b = b[b.length - 1],
                F = false;
            for (var i = 0; i < a.length; i++) {
                if (a[i]['id'] == b['id']) {
                    F = true;
                    break
                }
            }
            if (F) {
                var xZ = Object.keys(a[i]);
                for (var j = 0; j < xZ.length; j++) {
                    a[i][xZ[j]] = b[xZ[j]];
                }
            } else {
                a.push(b)
            }
        }
    }

    del(that, args){
        for (var j = 0; j < that.length; j++) {
            if (that[j]['id'] == args[0]) {
                that.splice(j, 1);
                break;
            }
        }
    }

    find(sel , args){
        var aF = [];
        sel.forEach(function(arr, gg) {
            var Yi = parse(args[0] , arr) || '';
            if (args[2]) {
                var Yi = Yi.toString();
            } else {
                var Yi = Yi.toString().toLowerCase();
                args[1] = args[1].toLowerCase();
            }

            if (typeof(Yi) == 'string' || typeof(Yi) == 'number') {
                if (Yi.indexOf(args[1].toString()) > -1) {
                    aF.push(arr)
                }
            }
        })

        if (aF.length <= 0) {
            if (args[3] !== undefined && typeof(args[3]) == 'function') {
                args[3](false, args[1], null, sel.length)
            }
        } else {
            if (args[3] !== undefined && typeof(args[3]) == 'function') {
                args[3](true, args[1], aF, sel.length);
            }
        }
        return(aF);
    }
}
