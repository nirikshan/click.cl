export default {
    state:{
        name:'nirikshana',
        age:1,
        count:12,
        info:{
            first:{
                name:'Nirikshan'
            }
        }
    },
    action:{
        ChangeCount:function(a){
            //console.log(this , arguments)
             this.state.count = a;
        }
    }
}