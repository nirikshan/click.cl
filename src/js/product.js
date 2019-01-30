import { app }from 'click-cli';

new app("product", {
    view: (`<div>
            <h1 id='asdfasdf{name}&&{info.name.first}'>This is product components. {name}</h1>
            <ul class='asdf{info.name.first}1111'>
                <li>Complex Parsing :{info.name.first}</li>
                <li>Name :{name}</li>
                <li attr='asdfasd#{info.inner.interest[0]}ss'>Array Item : {info.inner.interest[0]} </li>
            </ul><br>
            Name:<input type='text' cl-run='name'><br><br>
            Complex id :<input type='number' cl-run='info.name.first'><br><br>
            <button cl-click='addItems'>Add</button>
            <button cl-click='reverse'>Reverse</button>
            <button cl-click='del'>Del</button>
            <input type='text' cl-input='search' placeholder='Search..'>
              
            <ul cl-loop='keys.data>>a'>
              <li>
                    <h1 cl-view='a.st'>{a.name} -  {a.id}</h1> 
                    {a.int.first}
                    <ul cl-loop='a.topping>>c'>
                        <li class='{c.id}   - {c.type}  - {a.name} - {name}'>
                        <b>{c.id}   - {c.type}  - {a.name} - {name}</b>  
                        </li>
                    </ul>
                </li>
            </ul>  
            <input type='checkbox' cl-run='show'>
            <div cl-if='show'>
              <h1>testing after loop</h1>
            </div>
    </div>`),
 
    state:{
      name:'Nirikshan',
      show:true,
      info:{
         name:{
           first:1,
           last:'bhusal'
         },
         inner:{
          interest:[
           'programming',
           'electronics'
          ]
        }
      },
      keys:{
        data:[
          {
            "id": "1",
            "name": "Cake",
            'st':true,
             'int':{
               first:'nirik',
               last:'shan'
             },
            "topping":
              [
                { "id": "5001", "type": "None" },
                { "id": "5002", "type": "Glazed" },
                { "id": "5005", "type": "Sugar" },
                { "id": "5007", "type": "Powdered Sugar" },
                { "id": "5006", "type": "Chocolate with Sprinkles" },
                { "id": "5003", "type": "Chocolate" },
                { "id": "5004", "type": "Maple" }
              ]
          },
          {
            "id": "2",
            'st':false,
            "name": "Raised",
            'int':{
              first:'reju',
              last:'aryal'
            },
            "topping":
              [
                { "id": "5001", "type": "None" },
                { "id": "5002", "type": "Glazed" },
                { "id": "5005", "type": "Sugar" },
                { "id": "5003", "type": "Chocolate" },
                { "id": "5004", "type": "Maple" }
              ]
          },
          {
            "id": "3",
            'st':true,
            "name": "Old Fashioned",
            'int':{
              first:'xprin',
              last:'Int'
            },
            "topping":
              [
                { "id": "5001", "type": "None" },
                { "id": "5002", "type": "Glazed" },
                { "id": "5003", "type": "Chocolate" },
                { "id": "5004", "type": "Maple" }
              ]
          }
        ]
      }
    },

    events:{
      addItems:function() {
            this.keys.data.clone({
              "id": this.info.name.first,
              "name": "spdated",
              'int':{
                first:'anurag',
                last:'bhusal'
              },
              "topping":
                [
                  { "id": "5001", "type": "None" },
                  { "id": "5002", "type": "Glazed" },
                  { "id": "5005", "type": "Sugar" },
                  { "id": "5007", "type": "Powdered Sugar" },
                  { "id": "5006", "type": "Chocolate with Sprinkles" },
                  { "id": "5003", "type": "Chocolate" },
                  { "id": "5004", "type": "Maple" }
                ]
            });
      },
      reverse:function(b){
        this.keys.data.reverse();
      },
      search:function(a){
        this.keys.data.search('int.first',a.target.value,false,function(x , y , z , v){
            //  console.log(z)
        })
      },
      del:function(a) {
        this.keys.data.del(100)
      }
    },
    fun:function(){
        console.log(this)
    }
});

new app('inner', {
    view: (`<div>   
        <b>This is Ok - {name}  oh</b>
    </div>`),

    state:{
        name:''
    }
});

