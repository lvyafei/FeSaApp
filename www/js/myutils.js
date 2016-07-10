Array.prototype.removeByName=function(dx) 
{
    if(dx==null||dx.length==0){return false;} 
    for(var i=0,n=0;i<this.length;i++) 
    { 
        if(this[i].category!=dx) 
        { 
            this[n++]=this[i] 
        } 
    }
    this.length-=1 
} 