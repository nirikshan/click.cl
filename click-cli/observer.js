import {UpdateData} from './render'

export default class Observer {

    constructor(data, auto , ci , cn , state = false) {
        this.data = data;
        this.observe(data, auto , ci , cn , state);
    }

    observe(data, auto , ci , cn , state) {
        var self = this;
        if (!data || typeof data !== 'object') {
            return;
        }
        Object.keys(data).forEach(function(key) {
            self.observeObject(data, key, data[key], auto , ci , cn , state);
        });
    }

    observeObject(data, key, val, compute , ci , cn , state) {
            var self = this;
            if(state){
                $.Clst.connection[key] = [];
            }
            if(typeof(val) == 'function' && key !== '$emit'){
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
                 self.UpdatePathWay(val , ci , cn , state , key)
                 
                 if (Array.isArray(newVal)) {
                     self.observeArray(data , newVal , ci , cn , compute , key , state);
                 } else {
                     self.observe(newVal, {} , ci , cn , state);
                 }
            },
        });

        if (Array.isArray(val)) {
            self.observeArray(data , val , ci , cn , compute , key , state);
        } else {
            if(typeof(val) === 'object'){  
                self.observe(val , {} , ci , cn , state);
            }   
        }
    }

    clone(o) {
        var out, v, key;
        out = Array.isArray(o) ? [] : {};
        for (key in o) {
            v = o[key];
            out[key] = (typeof v === "object" && v !== null) ? clone(v) : v;
        }
        return out;
      }

    observeArray(data , arr , ci , cn , compute , key , state) {
        var self = this;
        arr.__proto__ = self.defineReactiveArray(data , ci , cn , arr , compute , key , state);
        arr.forEach(function(item, z) {
            // console.log(ci , cn )
             self.observe(item, {} , ci , cn , state);
        });
    }

    defineReactiveArray(data , ci , cn , val , compute , key , state) {
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
                        self.observeArray(data , inserted , ci , cn , compute , state)
                    }
                    self.auto(compute[key] , data , data[key]);
                    self.UpdatePathWay(val , ci , cn , state , key)
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

    UpdatePathWay(val , ci , cn , state , key){
        var self = this;
        if(state){
            console.log($.Clst.connection[key]  , key)
            $.Clst.connection[key].forEach(CI => {
                console.log(key)
                 $.S[CI][key] = val;
            }); 
        }else{
           UpdateData(val , ci , cn , state , key)//change when local state change
        }
    }

}
