import {app} from 'click-cli';
import '../css/main.css'
new app('todo',{
    view:(`<div class="container">
       <b style="margin-left:40%;">{total}  item on list</b>
        <div class="toplayer">
            <input type="text" class="ItemName" cl-run="ItemName">
            <button cl-click="add" class="addBtn">Add</button>
        </div>
        <div class="todoStore">
            <ul cl-loop="TodoStore>>a">
                <li class="todoItem" cl-click="isdone">
                    <div class="todoName">{a.id} ) {a.name}</div>
                    <span class="todoRemove" cl-click="remove" id="{a.id}">X</span>
                </li>
            </ul>
        </div>
    </div>`),

    state:{
        ItemName  : null,
        TodoStore : [
            {id:1,name:'nirikshan'},
            {id:2,name:'xprin'}
        ],
        total : 0
    },

    events:{
        add:function() {
            if(this.ItemName !== null){
                const a = '-';
                this.TodoStore.push({
                    id:this.TodoStore.length + 1,
                    name: a+this.ItemName
                });
                this.ItemName = null;
            }
        },
        remove:function(a) {
             this.TodoStore.del(a.target.id);
        },
        isdone:function(a) {
            if(a.target.style['text-decoration'] && a.target.style['text-decoration'] !== 'none'){
                a.target.style['text-decoration'] = 'none';
            }else{
                a.target.style['text-decoration'] = 'line-through';
            }
        }
    },

    auto:{
        TodoStore:function (a){
            this.total = a.length;
            return(a);
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