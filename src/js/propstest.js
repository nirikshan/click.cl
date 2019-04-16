import {  app }from 'click-cli';


new app('propstest',{
    view: (`<div>
         Name:<input type='text' c-run='name'><br><br>
         Age:<input type='text' c-run='age'><br><br>
         Age:<button c-click='add'>Add</button><br>
         <c-test data='{data}'/>
    </div>`),

    state:{
        name:null,
        age:null,
        data:[
            {name:'nirikshan' ,  age:19},
            {name:'nirik'     ,  age:18},
            {name:'xprin'     ,  age:7}
        ]
    },

    fn:{
        add:function(a) {
            if(this.name !== null && this.age !== null){
                this.data.push({
                    name:this.name,
                    age:this.age
                })
                this.age = null;
                this.name = null;
            }else{
                alert('please enter item    ')
            }
        }
    }
})

new app('test',{
    view: (`<div>
            <table style='width:100%' border='1' c-loop='data>>a'>
                <tr>
                    <th>{a.name}</th>
                    <th>{a.age}</th> 
                    <th><input type='text' c-run='a.name' placeholder='Edit Name'></th>
                    <th><input type='text' c-run='a.age' placeholder='Edit age'></th>
                </tr>
            </table>
    </div>`),

    state:{
   
    },

    fn:{

    }
})