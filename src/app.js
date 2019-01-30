import {$_Click , app }from 'click-cli';
import './js/app2';

var io = new $_Click('Xprin');

new app('parent',{
    view: (`<div>
        <cl-looptest/>
    </div>`),

    state:{
      name:'Nirikshan'
    }
})

 io.render(document.getElementById('root'), 'parent');