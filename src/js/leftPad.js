import { app }from 'click-cli';

new app('child',{
    view:(`<div>
          <h1 cl-view='name'>This is child Component</h1>
          <h4>{name2}</h4>
          <input type='checkbox' cl-run='name'>
          <button cl-click='clickus'>Click me!</button>
          <input type='text' value='my-{age2}-{name2}' cl-input='act'/>
          <ul class='my-{age2}-{name2}'> 
             <li>name: {name2} </li>
             <li>age: {age2}  </li>
             <li>
                {val.myname.data}
                <input type='text' cl-run='val.myname.data'>
                {name2}
             </li>
          </ul>
    </div>`),

    state:{
        name2:'this is child component',
        name:1,
        age2:80,
        val:{myname:{data:'nirik'},cast:'bhusal'}
    },

    events:{
          act:function(a) {
               this.name2 = a.target.value;
          },
          clickus:function(a) {
              this.age2++;
          }
    },

    fun:function fun() {
      
    }
});