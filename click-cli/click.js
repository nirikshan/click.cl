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
        bl: [],
        connection: {},
        Duid:0
    }
};

class $_Click {

    constructor(appname, global) {
        $['name']       =  appname;
        $['global']     =  global;
        $.global.state  =  new Observer(global.state , global.auto || {} , appname , appname , true).data;
    }

    render(ground, name) {
        console.log(ground)
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
