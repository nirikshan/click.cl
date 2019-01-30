import {
    Manage
} from './render.js'


global.$ = {
    name: '',
    Components: {},
    global: {},
    S: {},
    Clst: {
        c: 0,
        bl: [],
        connection: {},
        Duid:0
    }
};

class $_Click {

    constructor(appname, global) {
        $['name'] = appname;
        $['global'] = global;
    }

    render(ground, name) {
        console.log(ground)
        if (typeof ground === 'object' && typeof(name) === 'string') {
            if ($.Components[name]) {
                var fiber = {};
                var component = $.Components[name];
                if (component !== undefined) {
                    console.time('clickjs')
                    Manage(ground, name, 'Click_Root', {}, {
                        st: true
                    });
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
        }
    }

}

export {
    $_Click,
    app
};