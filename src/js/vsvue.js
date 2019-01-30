
import {app} from 'click-cli';

new app('button-counter',{
    view:(`<button cl-click="count">You clicked me {count}  times.</button>`),
    state:{
      count:0
    },
    events:{
        count:function() {
            this.count++
        }
    }
  })
  