
//assign test aliases//
Object.extend(TestBank, {
   
   'date-eu-y2k': function(s,p){
      s = this._eval(s);

      if ( this.empty(s) ) {
         return null; //cancel test//
      }   

      if (/\d\d?\/\d\d?\/\d{4}/.test(value)){
         //logic validation//
         var pcs = value.match(/(\d\d?)\/(\d\d?)\/(\d{4})/);
         var d = new Date(pcs[3],pcs[2],pcs[1]-1);
         if (d.getFullYear() == pcs[3] && d.getMonth()+1 == pcs[2] && d.getDate() == pcs[1]){
            return(true);
         }
      }

      return false;
   },
      
   'date-eu': function(s,p){
      s = this._eval(s);

      if ( this.empty(s) ) {
         return null; //cancel test//
      }   

      if (/\d\d?\/\d\d?\/\d{2,4}/.test(s)){
         //logic validation//
         var pcs = value.match(/(\d\d?)\/(\d\d?)\/(\d{2,4})/);
         var d = new Date(pcs[3],pcs[2],pcs[1]-1);
         var y = ((pcs[3].length == 2)?d.getYear():d.getFullYear());
         if (y == pcs[3] && d.getMonth()+1 == pcs[2] && d.getDate() == pcs[1])
            return true;
      }      
   
      return false;
   }

});