import {app} from 'click-cli';
import '../css/main.css'
new app('todo',{
    view:(`<div class="container">
       <b style="margin-left:40%;">{total}  item on list {ItemName}</b>
        <div class="toplayer">
            <input type="text" class="ItemName" c-run="ItemName">
            <button c-click="add" class="addBtn">Add</button>
        </div>
        <div class="todoStore">
            <ul c-loop="TodoStore>>a,index">
                <li class="todoItem" c-click="isdone">
                    <div class="todoName"> {index} ) {a}</div>
                    <span class="todoRemove" c-click="remove" id="{index}">X</span>
                </li>
            </ul>
        </div>
        <button class="addBtn" c-click="cleanall" >Clean All</button>
    </div>`),

    state:{
        ItemName  :'',
        TodoStore : [
            'nirikshan',
            'xprin',
            "san frinciso",
            "Click.js",
            "indo-compiler",
            "webpack",
            'NCS',
            "jackey"
        ],
        total : 0
    },

    events:{
        add:function() {
            if(this.ItemName.length > 0){
                this.TodoStore.push(this.ItemName);
                this.ItemName = '';
            }
        },
        remove:function(a) {
            this.TodoStore.splice(a.target.id,1);
        },
        isdone:function(a) {
            if(a.target.style['text-decoration'] && a.target.style['text-decoration'] !== 'none'){
                a.target.style['text-decoration'] = 'none';
            }else{
                a.target.style['text-decoration'] = 'line-through';
            }
        },
        cleanall:function(a) {
            this.TodoStore.clean(); 
        }
    },

    auto:{
        TodoStore:function (a){
            this.total = a.length;  
        },
        ItemName:function(a) {
            return a.toUpperCase();
        }
    },

    fun:function() {
        console.log('sadf')
    }
})

// fetch('https://www.w3schools.com/angular/customers.php')
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(myJson) {
//     console.log(JSON.stringify(myJson));
//   });
