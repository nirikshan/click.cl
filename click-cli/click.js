import {
    Manage
} from './render.js'
import Observer from './observer';

global.$ = {
    name: '',
    Components: {},
    global: {},
    S: {},
    O:{},
    Clst: {
        c: 0,
        services: [],
        connection: {},
        Duid:0
    }
};

class $_Click {

    constructor(appname, obj) {
        $['name']          =  appname;
        $['global']        =  obj.global;
        this['el']         =  obj.el;    
        //obj.dep[0].__proto__.constructor.name
        $.global.state  =  new Observer(obj.global.state , obj.global.auto || {} , appname , appname , true).data;
        this.checkServices(obj.service);
    }

    checkServices(a){
        for (var i = 0; i < a.length; i++) {
            var el = a[i];
            $.Clst['services'][el.name] =  el
        }
    }

    render(name) {
        var ground = document.querySelector(this.el);
        if (typeof ground === 'object' && typeof(name) === 'string') {
            if ($.Components[name]) {
                var fiber = {};
                var component = $.Components[name];
                if (component !== undefined) {
                    console.time('clickjs')
                    Manage(ground, name, 'Click_Root', fiber, {
                        st: true
                    });
                    // $.global.state  =  new Observer($.global.state , $.global.auto || {} , $.appname , $. appname , true).data;
                    console.timeEnd('clickjs')
                }
            }
        }
    }

}

class app {
    constructor(x, y) {
        if (typeof x === 'string' && typeof y === 'object') {
            y.view = (y.view);
            $.Components[x] = y;
            return y;
        }
    }

}

var action = function action(a) {
    return function() {
        $.global.action[a].apply($.global, arguments);
    }
  }

export {
    $_Click,
    app,
    action
};
