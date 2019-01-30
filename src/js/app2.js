import {app} from 'click-cli';

new app('looptest',{
    view: (`<div>
    <cl-test props='{show}' name='nirikshan'/>
    <div cl-if='show'>
      <cl-test props='{show}' name='reju'/>
    </div>
    <input type='checkbox' cl-run='show'>
    <ul  cl-if='show' cl-loop='keys.data>>a'>
      <li> 
          <h1>{a.name}</h1>
          <ul cl-loop='a.interested>>b'>
             <li>
               {b.name}
               <ul cl-loop='b.type>>c'>
                  <li>
                    {c.name}
                    <ul cl-loop='c.type>>d'>
                        <li>
                          {d.with} - {a.name}
                        </li>
                    </ul>
                  </li>
               </ul>
             </li>
          </ul>
      </li>
  </ul> 
</div>`),


state:{
  name:'Nirikshan',
  show:false,
  info:{
     name:{
       first:'Nirikshan',
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
        name:'nirikshan',
        'interested':[
          {
            id:1,
            name:'programming' , 
            type:[
                {
                  id:1,
                  name:'python',
                  type:[
                    { with:'pyqt' },
                    { with: 'node and express'}
                  ]
                },
                {
                  id:2,
                  name:'javascript',
                  type:[
                    { with:'click js' },
                    { with: 'vue.js'}
                  ]
                }
            ]
          },
          {
            id:2,
            name:'electronic',
            type:[
              {
                id:1, 
                name:'Atmega32',
                type:[
                  { with:'olk leds' },
                  { with: 'atmel studio'}
                ]
              },
              {
                id:2, 
                name:'Audrino',
                type:[
                  { with:'official ide' },
                  { with: 'main ide'}
                ]
              }
            ]
          }
        ]
      },
      {
        name:'xprin',
        interested:[
          {
            id:1,
            name:'programming' , 
            type:[
                {
                  id:1,
                  name:'click',
                  type:[
                    { with:'python' },
                    { with: 'javascript'}
                  ]
                },
                {
                  id:2,
                  name:'indo-compiler',
                  type:[
                    { with:'c' },
                    { with: 'cpp'}
                  ]
                }
            ]
          },
          {
            id:2,
            name:'electronic',
            type:[
              {
                id:1, 
                name:'Rapsberry pi',
                type:[
                  { with:'python of raspbarry pi' },
                  { with: 'node.js'}
                ]
              },
              {
                id:2, 
                name:'intel i9',
                type:[
                  { with:'assembly' },
                  { with: 'c#'}
                ]
              }
            ]
          }
        ]
      }
    ]
   }
  },

  auto:{
    name:function(a) {
      return(a);
    }
  }

})

new app('test',{
  view:(`<h1>{props}  is Testing {name}</h1>`),
  state:{
    name:'Nirikshan',
    props:99
  }
})
