import {UpdateData} from './render'

export default class Observer {

    constructor(data, auto , ci , cn) {
        this.data = data;
        this.observe(data, auto , ci , cn);
    }

    observe(data, auto , ci , cn) {
        var self = this;
        if (!data || typeof data !== 'object') {
            return;
        }
        Object.keys(data).forEach(function(key) {
            self.observeObject(data, key, data[key], auto[key] , ci , cn);
        });
    }
        
    observeObject(data, key, val, compute , ci , cn) {
        var self = this;
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get: function() {
                return (void 0 !== compute) ? compute.bind(global.$.S[ci])(val) : val
            },
            set: function(newVal) {
                if (val === newVal) {
                    return;
                }
                if(typeof(newVal) == 'number'){
                    newVal = newVal.toString();
                }
                val = newVal;
                 UpdateData(val , ci , cn)
                 if (Array.isArray(newVal)) {
                     self.observeArray(newVal , ci , cn);
                 } else {
                     self.observe(newVal, {} , ci , cn);
                 }
            },
        });

        if (Array.isArray(val)) {
            self.observeArray(val , ci , cn);
        } else {
            if(typeof(val) === 'object'){  
                self.observe(val , {} , ci , cn);
            }   
        }
    }

    observeArray(arr , ci , cn) {
        var self = this;
        arr.__proto__ = self.defineReactiveArray(ci , cn , arr);

        arr.forEach(function(item, z) {
            self.observe(item, {} , ci , cn);
        });
    }

    defineReactiveArray(ci , cn , val) {
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
                       
                    } else if (method == 'search') {
                       
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

                   // console.log(method)
                    if (inserted && inserted.length) {
                        self.observeArray(inserted , ci , cn)
                    }
                    UpdateData(val , ci , cn)
                    return result
                },
                enumerable: true,
                writable: true,
                configurable: true
            });
        });

        return arrayMethods;
    }

}
