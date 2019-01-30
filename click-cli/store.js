export default class Dep{
    constructor(a) {
       // this.id = global.$.Clst.Duid++;
        this.subs = [];
        var a = this;
        setTimeout(function(params) {
                if(a.subs.length > 0){
                    //global.$.Clst.Duid += a.subs.length;
                    //console.log(a)
                }
        },2000)
    }

    addSub(sub) {
        this.subs.push(sub);
    }

    notify(data) {
        this.subs.forEach(function(sub) {
            if(data){
                sub.task = data;    
            }
            sub.update();
        });
    }
}