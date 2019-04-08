import {app , action} from 'click-cli';

import '../css/sidebar.css';
new app('top',{
    view:(`<div>
            <c-a c-initmain='initt'/>
    </div>`),

    state:function($) {
        return $.state('name' , 'count' , 'age')
        ({
            framework:'click.js'
        })
    },
    
    fn:{
        initt:function(a) {
            console.log(a , 'emmitted at top component ends')
            console.timeEnd('Emmission from clild : Sub Component');
        }
    }
});

new app('a',{
    view:(`<div>
            <c-b c-initmain='clickus'/>
    </div>`),

    state:function($) {
        return $.state('name' , 'count' , 'age')
        ({
            framework:'click.js'
        })
    },
    
    fn:{
        clickus:function(a) {
          // emmitted gardako component ko data bind vako xa see 'this'
             //console.log(this)
             console.log(a , 'emmitted at a component')
           this.$emit('initmain',a)
        }
    }
});

new app('b',{
    view:(`<div>
            <c-c c-initmain='clickus'/>
    </div>`),

    state:function($) {
        return $.state('name' , 'count' , 'age')
        ({
            framework:'click.js'
        })
    },
    
    fn:{
        clickus:function(a) {
            console.log(a , 'emmitted at b component')
          // emmitted gardako component ko data bind vako xa see 'this'
             //console.log(this)
           this.$emit('initmain',a)
        }
    }
});

new app('c',{
    view:(`<div>
            <c-d c-init='clickus'/>
    </div>`),

    state:function($) {
        return $.state('name' , 'count' , 'age')
        ({
            framework:'click.js'
        })
    },
    
    fn:{
        clickus:function(a) {
            console.log(a , 'emmitted at c component')
          // emmitted gardako component ko data bind vako xa see 'this'
             //console.log(this)
           this.$emit('initmain',a)
        }
    }
});


new app('d',{
    view:(`<div>
            <c-e c-init='clickus'/>
    </div>`),

    state:function($) {
        return $.state('name' , 'count' , 'age')
        ({
            framework:'click.js'
        })
    },
    
    fn:{
        clickus:function(a) {
          // emmitted gardako component ko data bind vako xa see 'this'
             //console.log(this)
             console.log(a , 'emmitted at d component')
           this.$emit('init',a)
        }
    }
});

new app('e',{
    view:(`<div>
            <c-f c-init='clickus'/>
    </div>`),

    state:function($) {
        return $.state('name' , 'count' , 'age')
        ({
            framework:'click.js'
        })
    },
    
    fn:{
        clickus:function(a) {
            console.log(a , 'emmitted at e component')
          // emmitted gardako component ko data bind vako xa see 'this'
             //console.log(this)
           this.$emit('init',a)
        }
    }
});

new app('f',{
    view:(`<div>
            <c-g c-init='clickus'/>
    </div>`),

    state:function($) {
        return $.state('name' , 'count' , 'age')
        ({
            framework:'click.js'
        })
    },
    
    fn:{
        clickus:function(a) {
          // emmitted gardako component ko data bind vako xa see 'this'
             //console.log(this)
             console.log(a , 'emmitted at f component')
           this.$emit('init',a)
        }
    }
});

new app('g',{
    view:(`<div>
            <c-h c-init='clickus'/>
    </div>`),

    state:function($) {
        return $.state('name' , 'count' , 'age')
        ({
            framework:'click.js'
        })
    },
    
    fn:{
        clickus:function(a) {
          // emmitted gardako component ko data bind vako xa see 'this'
             //console.log(this)
             console.log(a , 'emmitted at g component')
           this.$emit('init',a)
        }
    }
});

new app('h',{
    view:(`<div>
            <c-up c-init='clickus'/>
    </div>`),

    state:function($) {
        return $.state('name' , 'count' , 'age')
        ({
            framework:'click.js'
        })
    },
    
    fn:{
        clickus:function(a) {
          // emmitted gardako component ko data bind vako xa see 'this'
             //console.log(this)
             console.log(a , 'emmitted at h component')
           this.$emit('init',a)
        }
    }
});


new app('up',{
    view:(`<div>
            <ul>
              <li>Name  : {name}</li>
              <li>Count : {count}</li>
              <li>Age   : {age}</li>
            </ul>
            <c-sub c-press='clickme'/>
    </div>`),

    state:function($) {
        return $.state('name' , 'count' , 'age')
        ({
            framework:'click.js'
        })
    },
    
    fn:{
        clickme:function(a) {
            console.log(a , 'emmitted at up component')
          // emmitted gardako component ko data bind vako xa see 'this'
             this.count = a;
            // console.log(this)
           this.$emit('init',a)
        }
    }
});

new app('sub',{
    view:(`<div>
        <h1>{name} - {count}</h1>
        Local:<input type='range' c-run='count'/><br>
        Global:<input type='range' c-input='ChangeCount(1)'/></br>
        <button c-click='press'>PressMe</button> 
    </div>`),

    state:function($) {
        return $.state('name' , 'count')();
    },
    // 
    fn:{
        ChangeCount:function(a) {
             action('ChangeCount')(a.target.value);
        },
        see:function(a , state) {
            console.log(state)
        },
        press:function(a) {
            console.time('Emmission from clild : Sub Component');
            console.log(this.count , 'emmitted at sub component starts')
            this.count = Number(this.count)+1;
            this.$emit('press',this.count)
        }
    }
});