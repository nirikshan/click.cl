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
            self.observeObject(data, key, data[key], auto , ci , cn);
        });
    }

    observeObject(data, key, val, compute , ci , cn) {
        var self = this;
            if(typeof(val) == 'function'){
                var max = val;
                val = max()
            }   
            val  = self.auto(compute[key] , data , val);
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get: function() {
                  return val;
            },
            set: function(newVal) {
                if (val === newVal) {return;}
                var newVal =  self.auto(compute[key] , data , newVal);
                if(typeof(newVal) == 'number'){
                    var newVal = newVal.toString();
                }
                if(typeof max == 'function'){
                        val = max(newVal);
                }else{
                    val = newVal;
                }
                
                 UpdateData(val , ci , cn)
                 if (Array.isArray(newVal)) {
                     self.observeArray(data , newVal , ci , cn , compute , key);
                 } else {
                     self.observe(newVal, {} , ci , cn);
                 }
            },
        });

        if (Array.isArray(val)) {
            self.observeArray(data , val , ci , cn , compute , key);
        } else {
            if(typeof(val) === 'object'){  
                self.observe(val , {} , ci , cn);
            }   
        }
    }

    observeArray(data , arr , ci , cn , compute , key) {
        var self = this;
        arr.__proto__ = self.defineReactiveArray(data , ci , cn , arr , compute , key);
    }

    defineReactiveArray(data , ci , cn , val , compute , key) {
        var arrayPrototype = Array.prototype;
        var arrayMethods = Object.create(arrayPrototype);
        var self = this;
        [
            'pop', 
            'push', 
            'sort',
            'shift', 
            'splice',
            'unshift',
            'reverse',
            'clean'
        ].forEach(function(method) {
            var original = arrayPrototype[method];
            
            Object.defineProperty(arrayMethods, method, {
                value: function() {
                    var args = [];
                    

                    for (var i = 0, l = arguments.length; i < l; i++) {
                        args.push(arguments[i]);
                    }

                    if(method == 'clean'){
                        while (this.length > 0) {
                            this.pop();
                        }
                    }else{
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
                        self.observeArray(data , inserted , ci , cn , compute)
                    }
                    self.auto(compute[key] , data , data[key]);
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

    auto(fun , data , value){
        if(undefined !== fun){
            return fun.bind(data)(value) || value;
        }
        return(value);
    }

}
