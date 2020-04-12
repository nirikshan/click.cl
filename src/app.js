import { $_Click , app  , action} from 'click.cl';
import './window.js';

new app('parent',{
    view: (`<div>
        <c-window/>
        <div class='inputBox' >
           <input type='text' class='input' c-input='changeName' placeholder='Type Window Name.. '/>
        </div>
    </div>`),

    fn:{
        changeName:function(val){
            action('changename')(val.target.value);
        }
    },

    state:{
        
    },

    '@css':{
        '.inputBox':{
            'text-align':'center'
        },
        '.input':{
            'border'  : 'none',
            'opacity' : '0.6'
        }
    }
})

new $_Click('Xprin' , {
    el:'#root',
    global:{
        state:{
            windowName:'Welcome to Click.cl'
        },
        action:{
            changename:function(value) {
                this.state.windowName = value;
            }
        }
    }
}).render('parent');