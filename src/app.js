import {$_Click , app }from 'click-cli';


// import global from './confg/state';
// import router from './confg/router';
// import './component/main';<c-top/>
import '../src/js/propstest';
var router = []



new app('parent',{
    view: (`<div>
         <c-propstest/>
    </div>`),

    state:{
    },

    fn:{

    }
})


new $_Click('Xprin' ,{
    el:'#root',
    global: global,
    service:[
       router
    ]
}).render('parent');
