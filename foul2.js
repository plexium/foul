/*
Foul - Form Validation Language Version 2

Copyright (c) 2012 Bryan English (bryan@bluelinecity.com)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

/*
   Method: String.onion
   Peels a string like an onion using left and right characters and compensating for nested layers, returning the next layer
   
   Parameters:
      l - character to start peeling at, defaults to '('
      r - character to end peeling at, defaults to ')'

      Return:
         array - an array of next layer strings
*/
String.prototype.onion = function(l,r)
{  
   l = l || '(';
   r = r || ')';
   
   var s = 0, tally = -1, found = new Array();
   
   for (var cnt = 0; cnt < this.length; cnt++)
   {
      if ( this.charAt(cnt) == l && this.charAt(cnt-1) != '\\' ) 
         if ( tally == -1 ) {s = cnt+1; tally = 1;}
         else tally++; 
      
      if (tally != -1 && this.charAt(cnt) == r && this.charAt(cnt-1) != '\\' ) tally--;

      if ( tally == 0 )
      {         
         found.push( this.substring(s, cnt) );
         tally = -1;
      }      
   }
   
   return found;
}

/*
	Method: chomp
	Trims the space off the ends of a string.
*/
String.prototype.chomp = function()
{
	if (!this) return '';	
	str = this.match(/^\s*(.*?)\s*$/);
	return str[1];
}


/*
	Namespace: Foul
	Global namespace object containing datatables and methods used by validation and formatting operations.
*/
Foul = {
	UID: 0,
	STATES: Array('AL','AK','AS','AZ','AR','CA','CO','CT','DE','DC','FM','FL','GA','GU','HI','ID','IL','IN','IA','KS','KY','LA','ME','MH','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','MP','OH','OK','OR','PW','PA','PR','RI','SC','SD','TN','TX','UT','VT','VI','VA','WA','WV','WI','WY','AE','AA','AE','AE','AE','AP'),
   STATE_ZIP_LOOKUP: {'FM':'969','AS':'96799','GU':'969','AL':'35-36','AK':'995-999','AZ':'85-86','AR':'716-729','CA':'900-961','CO':'80-81','CT':'06','DE':'197-199','DC':'200-205','FL':'32-34','GA':'30-31','HI':'967-968','ID':'832-839','IL':'60-62','IN':'46-47','IA':'50-52','KS':'66-67','KY':'40-42','LA':'700-715','ME':'039-049','MH':'969','MD':'206-219','MA':'010-027','MI':'48-49','MN':'55-56','MS':'386-399','MO':'63-65','MT':'59','NE':'68-69','NV':'89','NH':'030-038','NJ':'07-08','NM':'87-88','NY':'10-14','NC':'27-28','ND':'58','MP':'969','OH':'43-45','OK':'73-73','OR':'97','PW':'969','PA':'150-196','PR':'006-009','RI':'028-029','SC':'29','SD':'57','TN':'370-385','TX':'75-79','UT':'84','VT':'05','VI':'006-009','VA':'220-246','WA':'980-994','WV':'247-269','WI':'53-54','WY':'820-831','AE':'09','AA':'340','AP':'962-966'},
   IMG_FILE_EXT: Array('ani','b3d','bmp','dib','cam','clp','crw','cr2','cur','dcm','acr','ima','dcx','dds','djvu','iw44','ecw','emf','eps','fpx','fsh','g3','gif','icl','ico','ics','ids','iff','lbm','img','jp2','jpc','j2k','jpf','jpg','jpeg','jpe','jpm','kdc','ldf','lwf','mng','jng','nlm','nol','ngg','gsm','pbm','pcd','pcx','pgm','png','ppm','psd','psp','ras','sun','raw','rle','sff','sfw','sgi','rgb','sid','swf','tga','tif','tiff','wbmp','wmf','xbm','xpm'),
   EXE_FILE_EXT: Array('ade','adp','bas','chm','cmd','cpl','crt','hlp','hta','inf','ins','isp','jse','lnk','mdb','mde','msc','msi','msp','mst','ocx','pcd','pif','pot','ppt','sct','shb','shs','sys','url','vb','vbe','vbs','wsc','wsf','exe','js','vbs','scr','com','bat','wsh','reg','dll'),	
	AUTO_TESTS: {           //used to automatically create a test from class names//
			"required" : " not null",
			"number" : " not number",
         "email": " not email",
         "phone": " not phone-us",
         "url": " not url",
         "state": " not state-us",
         "zip" : " not zip-us",
         "date": " not date-us",
         "ssn": " not ssn"
   },

	MAGIC_MESSAGES: {           //used to automatically add error messages//
		"^\~([^~]+)\~$": "[[field]] is a required field.",
		"( is)? (null|empty|blank)": "[[field]] is a required field.",
		" not email": "Please enter a valid email address.",
		" not (date\-us|date\-us\-y2k)": "Please enter a valid date in the form of mm/dd/yyyy.",
		" not zip-state-match(\-us)?": "Please verify the zip code you entered is correct for the state.",
		" not (zip(\-us)?|zipcode(\-us)?)": "Please enter a valid ZIP.",
		" not (state(\-us)?|postalcode(\-us)?)": "Please enter a valid state.",
		" not url\-http": "Please enter a valid url in the form of http://domain/path/file",
		" not url\-ftp": "Please enter a valid ftp url in the form of ftp://[user:pass@]domain/path/file",
		" not url\-news": "Please enter a valid news url in the form of news://domain/path/file",
		" not url": "Please enter a valid url in the form of protocol://[user:pass@]domain/path/file",
		" not (ssn|social\-security\-number)": "Please specify a valid social security number.",
		" not phone\-us": "Please specify a valid U.S. phone number.",
		"numeric": " is a number."
	},
	
	
	/*
		Method: create
		Returns a new foul test group to use to setup a set of tests.
	 
		Parameters:
			form - form element or form id
	 */
	create: function( form )
   { 
      var ftg = new FoulTestGroup()
      if ( form ) ftg.setForm(form);
      return ftg;
   },

	
	/*
		Function: input
		Utility function to get the value from an input field.
		
		Parameters:
			id - field name/id
			form - optional form element to look in for the field
         val - optional, string to set the value of a text, textarea to.
	*/
	input: function( id, form, val )
	{	
		var e = ( form ? form.elements[id] : document.getElementById( id ) );
		
		if ( e ) 			
			if ( e.type != null )
				switch(e.type){
					case "text": case "hidden": case "password": case "textarea": case "file":
                  if ( val !== undefined ) e.value = val;
                  return(e.value);break;
					case "checkbox":return(((e.checked)?e.value:''));break;
					case "select-one":var o = e.options[e.selectedIndex];
						return(((o.value==null)?o.text:o.value));break;
					}
			else //pesky radio button//
				for(var cnt=0;cnt<e.length;cnt++)
					if(e[cnt].checked)return(e[cnt].value);

		return false;
	},
	
	
	/*
		Function: empty
		Returns true if val is empty.
		
		Parameters:
			val - value to test
	*/
	empty: function( val )
	{
		return ( val === null || val == '' );
	},
	
	
	/*
		Function: addEvent
		Cross-browser way of attaching an event handler to an element.
		
		Parameters:
			el - element to attach the handler too
			event - string name of the event to listen for
			f - function to trigger
	*/
	addEvent: function( el, event, f )
	{	
		if ( el.addEventListener )
			el.addEventListener( event, f, false );
		else
			el.attachEvent('on' + event,f );			
	},
	
	
	/*
		Function: insertMessage
		Inserts an html div node immediatly after a given element with the provided text.
		
		Parameters:
			el - element to insert the node next too.
			id - unique identifier for the node so future removal can happen.
			message - text to add to the node
	*/
	insertMessage: function( el, id, message )
	{
		if ( !el ) return;
         
		//create node to insert//
		var n = document.createElement('div');
		n.setAttribute('id', '_foul_error_' + id );
		n.setAttribute('class', 'foul_error' );
		n.appendChild( document.createTextNode(message) );		

		//check for dupilcates//
		if ( el.nextSibling && el.nextSibling.getAttribute && el.nextSibling.getAttribute('id') == '_foul_error_' + id ) return;

		if ( el.nextSibling )
			el.parentNode.insertBefore( n, el.nextSibling );
		else
			el.parentNode.appendChild( n );		
	},
	
	
	/*
		Function: deleteMessage
		Deletes an html div node given by the id.
		
		Parameters:
			el - element to use as a reference point
			id - id of the div to delete
	*/
	deleteMessage: function( el, id )
	{
		if ( el && el.nextSibling  && el.nextSibling.getAttribute && el.nextSibling.getAttribute('id') == '_foul_error_' + id)
		{
			el.parentNode.removeChild(el.nextSibling);			
		}	
	},
   
   /*
      Function: alert
      A stub function for potential custom reimplementation. Otherwise just uses window.alert
      
      Parameters:
         s - String to alert
   */
   alert: function( s )
   {
      alert(s);
   }
};


/*
	Class: FoulTestGroup
	Groups a set of FoulTests....typically a single form. Takes a single parameter, the 
	form element it's using to validate for.
	
	Parameters:
		form - string/object of the form this test group is tied too.
*/
FoulTestGroup = function()
{
	
	/*
		Property: notification
		Controls the method of notification for validation errors. Values can be alert or inline.
		Inline injects html after the element in question.
	*/
	this.notification = 'alert';
	
	/*
		Property: interactive
		- boolean value indicating if the text fields are automatically formatted as they are filled out.
	*/
	this.interactive = false;

	/*
		Property: breakpoint
		- boolean value indicating if a validation should occur after a field looses focus.
	*/
	this.breakpoint = false;
	
   
	/*
      Private: _listening
      - boolean flag if the form fields are already being listened to.
    */
	this._listening = false;
   
	/*
	   Private: _ignore
	   Temporary var to stop a breakpoint check for that slight moment it will trigger another event.
	 */
	this._ignore = false;
	
	this.tests = Array();
	this.formats = Array();
	this.format_index = Array();
	this.test_index = Array();   
   
   this.setForm = function( f )
   {
      if ( typeof f == 'object' )
      {
         this.form = f;
         this._addListeners();      
         return;
      }
      
      forms = document.getElementsByTagName('form');
      for ( var c = 0; c < forms.length; c++ )
      {			
         if ( forms[c].getAttribute('id') == f || forms[c].getAttribute('name') == f)
         {
            this.form = forms[c];
            this._addListeners();      
            return;
         }
      }      
   }
	
   
   this.setInteractive = function( val ) 
   {
	   this._addListeners();			
	   this.interactive = val;
   };

	
   this.setBreakpoint = function( val ) 
   { 
		this._addListeners();
		this.breakpoint = val;
   };

	
   this.setNotification = function( val )
   {
	   this.notification = val;
   };

	
   this._addListeners = function()
   {
      if ( !this.form || this._listening ) return;
      
      this._listening = true;
		var self = this;
		var listener = function(e)
		{
			if (self._ignore) return;
			el = ( e.srcElement ) ? e.srcElement : e.target;

			//if interactive and format exists apply it//
			if ( self.interactive && self.format_index[el.name] !== undefined )
			{
				for ( var c = 0; c < self.format_index[el.name].length; c++ )
					self.applyFormat( self.format_index[el.name][c] );			
			}

			//if validation exists test it//
			if ( self.breakpoint && self.test_index[el.name] !== undefined )
			{            
				var context = new FoulContext();
				for ( var c = 0; c < self.test_index[el.name].length; c++ )
				{            
					es = self.runTest( self.test_index[el.name][c], context );
                  
					if ( es == '' ) 
					{
						if ( self.notification == 'inline' )
							Foul.deleteMessage( el, self.tests[self.test_index[el.name][c]].id );
					}
					else
					{
						if ( self.notification == 'inline' )
						{
							Foul.insertMessage( el, self.tests[self.test_index[el.name][c]].id, es );
						}
						else
						{
							Foul.alert( es );
							setTimeout(function(){self._ignore=1;el.focus();self._ignore=0;},1);
						}
					}
				}
			}
		};
				
		for ( var c = 0; c < this.form.elements.length; c++ )
		{
			Foul.addEvent( this.form.elements[c], 'blur', listener );
		}
   };
	
	
	/*
		Method: when
		Adds a new test condition to the group of tests
		
		Parameters:
			test - The validation string
			message - optional, notification method in the case the test is true			
	*/
	this.when = function( test, message )
	{
		var checksum = test.split("~"); //check for typos//
		if ((checksum.length+1) % 2 == 1){Foul.alert("Syntax error in " + test);}
		
		//look for default null check, just a ~fieldname~ string//
		if (/^\~([^~]+)\~$/.test(test))
		{
			test += ' null';
		} 

		//create default message/
		if (!message){
			for (var reg in Foul.MAGIC_MESSAGES ){
				if (test.search(new RegExp(reg)) != -1){
					var field = test.match(/\~([^~]+)\~/)[1];
					message = Foul.MAGIC_MESSAGES[reg].replace(/\[\[field\]\]/g,field);
					break;
				}
			}
		}

		var i = this.tests.length;
		this.tests[i] = new FoulTest( this, test, message );
		
		if ( this.tests[i].field_name )
			this._addIndex( 'test', this.tests[i].field_name, i );
	};

	
	/*
		Method: format
		Adds a field format specifier.
		
		Paramters:
			str - format string command
	*/
	this.format = function( str )
	{
		var i = this.formats.length;
	   this.formats[i] = new FoulFormat( this, str );
		
		if ( this.formats[i].field_name )
			this._addIndex('format', this.formats[i].field_name, i );			
	};


	/*
		Method: auto
		Automatically parses this test group's fields and looks for special css classes or profiles to
		automatically generate tests with.
	*/
	this.auto = function()
	{
		//for each form field//
		
		//if class 
	};
	
	
	/*
		Method: _addIndex
		Adds test / format index to the test_index / format_index array.
	*/
	this._addIndex = function( type, index, value )
	{
		type = type + '_index';
		
      index = index.split(/\:/)[0];
      
		if ( !this[type][index] ) 
			this[type][index] = new Array();

      this[type][index][ this[type][index].length ] = value;		
	};
	
	
	
	this.applyFormats = function()
	{
		for ( var c = 0; c < this.formats.length; c++ )
			this.applyFormat(c);
	};
	
	/*
		Method: applyFormat
		Applies a single format at formats[c]

		Parameters:
			c - index of the format string to apply
	*/
	this.applyFormat = function(c)
	{		
		this.formats[c].compile();
		this.formats[c].apply();
	};


	this.runTest = function(c, context)
	{
		if ( this.tests[c].run( context ) ) 
			return this.tests[c].message;
		else
			return '';
	};

	
	/*
		Run all tests in this test group and return a boolean true if it passes.
	*/
	this.validate = function()
	{
		this.applyFormats();

		context = new FoulContext();
		notify = '';

		for ( var c = 0; c < this.tests.length; c++ )
		{
			estring = this.runTest( c, context );
			if ( estring != '' )
			
				notify += '\n - ' + estring;
			if ( this.notification == 'inline' )
			{   
				if ( estring != '' )
					Foul.insertMessage( this.form.elements[this.tests[c].field_name], this.tests[c].id, estring );
				else
					Foul.deleteMessage( this.form.elements[this.tests[c].field_name], this.tests[c].id );
			}
		}

		if ( notify != '')
		{
			if (this.notification == 'alert')
			{
				Foul.alert( "There is a problem with your submission:\n" + notify );
			}			
			return false;
		}
		
		return true;
	};
				
}


/*
   Class: FoulFormat
*/
FoulFormat = function ( group, format, id )
{
	this.group = group;
	this.format = format;
	this.id = id || Foul.UID++;	
	
	var relfield = format.match(/^\s*\~([^~]+)\~/);
	this.field_name = ( relfield ) ? relfield[1] : null;
	//this.field = ( relfield ) ? this.group.form.elements[this.field_name] : null;
	
	this.type = null;
	this.formatBank = FoulFormatBank;
	
	
	this.string_merge = function(template,data,reverse)
	{
      var dindex = (reverse)?data.length-1:0;
      var dend = (reverse)?-1:data.length;
      var cnt = (reverse)?template.length-1:0;
      var end = (reverse)?-1:template.length;
      var inc = (reverse)?-1:1;
      var value = newdata = '';
      var rep = 0;
   
      while (cnt != end && dindex != dend){

         switch (template.charAt(cnt)){

            case 'x': //replace with next data char
               value = data.charAt(dindex);
               dindex+=inc;
               rep++;
            break;

            case 'X': //replace with next data char and add next template char
               cnt+=inc;

               if(reverse){
                  value = template.charAt(cnt) + data.charAt(dindex);
               } else {
                  value = data.charAt(dindex) + template.charAt(cnt);
               }

               dindex+=inc;
               rep++;
            break;

            default: //add template char
               value = template.charAt(cnt); 
            break;
         }

         newdata = ((reverse==null)?newdata:'') + value + ((reverse)?newdata:''); 
         cnt+=inc;
      }

      //check for overflow//
      if (data.length > rep){
         if (reverse != null){
            newdata = data.substring(0,data.length-rep) + newdata;
         } else {
            newdata = newdata + data.substring(rep,data.length);
         }
      }

      return(newdata);
   };
	
	
	this.compile = function()
	{
      this.type  = this.format.replace(/^\s*\~([^~]+)\~\s*(as)?\s*/,'');

      /* TODO: auto-format
      this.field = this.group.form.elements[this.format.match(/^\s*\~([^~]+)\~/)[1]];		
      if (!this.type)
		{
         this.type = 'nothing';
			for (var reg in Foul.deffmt)
			{				
				if (field.name.search(new RegExp(reg)) != -1)
				{
					this.type = Foul.deffmt[reg].replace(/\[\[field\]\]/g,this.field.name);
					break;
				}
         }
      }
      */
      
      this.type = this.type.split(/\s/);
	};
	
	
	this.apply = function()
	{
		type = this.type;
		f = type.shift();
		p = type;
		if ( !this.formatBank[f] ) 
		{
			Foul.alert("Format " + f + " doesn't exist");
			return;
		}
		
      Foul.input( this.field_name, this.group.form, this.formatBank[f].apply(this, [Foul.input( this.field_name, this.group.form),p]) );
		//this.field.value = this.formatBank[f].apply( this, [this.field.value, p] );
	};
		
};


/*
   A collection of formatting functions
*/
var FoulFormatBank = {

   'nothing': function(s)
	{
      return s;
   },

   'number': function(s)
	{
      return (isNaN(parseInt(s.replace(/[^0-9\.]/g,''))))?'':parseInt(s.replace(/[^0-9\.]/g,''));
   },

   'float': function(s)
	{
      return (isNaN(parseFloat(s.replace(/[^0-9\.]/g,''))))?'':parseFloat(s.replace(/[^0-9\.]/g,''));
   },

   'pad': function(s,p)
	{      
      var s = new String(s);
      while(s.length < p[0]){
         s = (!p[1]?'0':p[1]) + s;
      }
      return s;
   },

   'phone-us': function(s)
	{		
      var s = s.replace(/\D/g,'');
      return this.string_merge('x (Xxx) xxx-xxxx',s,true);
   },

   'credit-card': function(s)
	{
      var s = s.replace(/\D/g,'');
      return this.string_merge('xxxx xxxx xxxx xxxx',s);
   },

   'ssn': function(s)
	{
      var s = s.replace(/\D/g,'');
      return this.string_merge('xxx-xx-xxxx',s);
   },

   'date-us': function(s)
	{
      var str = s.replace(/\s/g,'');
      var matches = str.match(/(\d\d?)\D(\d\d?)\D(\d\d(?:\d\d)?)/);
      if (matches){
         return matches[1] + '/' + matches[2] + '/' + matches[3];
      } else {
         return s;
      }
   },

   'date-us-y2k': function(s)
	{
      var str =   s.replace(/\s/g,'');
      var matches = str.match(/(\d\d?)\D(\d\d?)\D(\d\d(?:\d\d)?)/);
      if (matches){
         if (matches[3].length == 2){
            //hack 2 digit years//
            d = new Date();
            max = d.getFullYear() - 2000 + 20;
            matches[3] = (parseInt(matches[3])>max?'19':'20') + matches[3];
         }
         return matches[1] + '/' + matches[2] + '/' + matches[3];
      } else {
         return s;
      }
   },

   'url-http': function(s)
	{
      if ( Foul.empty(s) ) return s;      
      var matches = s.match(/([a-zA-Z0-9\.\-]+(\/[\S]*)?)\s*$/);
      return 'http://' + matches[1];
   },

   'url-ftp': function(s)
	{
      if ( Foul.empty(s) )return s;
      var matches = s.match(/([a-zA-Z0-9\.\-]+(\/[\S]*)?)\s*$/);
      return 'ftp://' + matches[1];
   },

   'zip-us': function(s)
	{
      var s = s.replace(/\D/g,'');
      return this.string_merge('xxxxx-xxxx',s);
   },

   'uppercase': function(s)
	{
      return s.toUpperCase();
   }
};


FoulFormatBank['padded'] = FoulFormatBank['padding'] = FoulFormatBank['pad'];
FoulFormatBank['cc'] = FoulFormatBank['credit-card'];
FoulFormatBank['integer'] = FoulFormatBank['number'];
FoulFormatBank['decimal'] = FoulFormatBank['float'];
FoulFormatBank['url'] = FoulFormatBank['url-http'];
FoulFormatBank['social-security'] = FoulFormatBank['social-security-number'] = FoulFormatBank['ssn'];
FoulFormatBank['zip'] = FoulFormatBank['zip-us'];
FoulFormatBank['date'] = FoulFormatBank['date-us-y2k'];
FoulFormatBank['phone'] = FoulFormatBank['phone-us'];

/*
	Class: FoulTest
	Where the testing is done.
*/
FoulTest = function( group, test, message, id )
{
	this.group = group;
	this.context = null;
	this.message = message;
	this.test = test;
	this.compiled_test = '';
	
	var relfield = test.match(/^\s*\~([^~:]+)(\~|\:)/);
	this.field_name = ( relfield ) ? relfield[1] : null;
   	
	this.id = id || Foul.UID++;
	this.canceled = false;
	
	this.tests = FoulTestBank;
	
	/*
		Method: run
		Run the validation test and return a boolean
	*/
	this.run = function( context )
	{
		this.canceled = false;
		this.context = context;
		this.compile();				
		return this.parse( this.compiled );
	};


	/*
		Method: compile
		Nabs any form references and literals from the test string so parsing can do its job. This
		gathers all the actual values for the tests.
	*/
	this.compile = function()
	{
		//strip out variables and literals//	
		var matches;
		var val_re = new RegExp("(\\~|\\'|\\\")(.*?)(\\1)",'g');
		var num_re = new RegExp("\\s(\\d+)(\\s|$)",'g');
		
		this.compiled = this.test;
		
		//foreach potential value referece//
		while (matches = val_re.exec( this.test ))
		{		
			if ( matches[1] == '~') //fetch value from form
			{
				//check for var modifier//
				if ( /\:length/.test( matches[2] ) )
					var val = new String(Foul.input( matches[2].replace(':length',''), this.group.form )).length;               
				else
					var val = Foul.input( matches[2], this.group.form );
			} 
			else 
			{
				var val = matches[2];            
			}		
			
			this.compiled = this.compiled.replace( matches[0], '##' + this.context.check( val ));		
		}
		
		//foreach number literal//
		while (matches = num_re.exec( this.test ))
		{				
			this.compiled = this.compiled.replace( matches[0], ' ##' + this.context.check( matches[1] ));		
		}
		
	};

	/*
	 * Method: parse
	 * Parses a foul test string recursivly evaluating boolean conditions
	 */
	this.parse = function(str)
	{	  
		var left,right,bool = null;
		var result = false;
		str = str.chomp();
		
		//check for paranthesis//
		if (str.charAt(0) == '('){
			left = str.onion()[0];
			right = str.substring(str.indexOf(left)+left.length,str.length);
			left = str.substring(1,str.length-1);
			result = this.parse(left);
		} else {         
			left = str.match(/.*?(?= and | or |$)/i)[0];
			right = str.substring(str.indexOf(left)+left.length,str.length);			
			result = this.evaluate(left);			
			if ( result === null ) this.canceled = true;
		}

		bool = right.match(/ or | and |\s*$/i)[0];
		right = right.substring(right.indexOf(bool)+bool.length,right.length);

		//get recursive!//
		switch(bool.chomp()){
			case "":
				return result;
			case "and":
				return(result && this.parse(right));
			case "or":
				return(result || this.parse(right));
		}
	};

	
   /*
      Method: evaluate
      Evaluates a single, non-compound test statement.
      
      Parameters:
         str - foul test string
      
      Returns:
         mixed - boolean true/false result of test or null for invalid or canceled test.
   */
   this.evaluate = function(str)
   {
		//filter out passthru words and detect negatation//		
		var negate = str.match(/\s(not|\!|\!\=|\<\>|is\-not)\s/i) === null ? false : true;
      while ( /\s(is|has|\=\=|does|equal\-to|same\-as|a|not|\!|\!\=|\<\>|is\-not)\s/ig.test( str ) )
         str = str.replace(/\s(is|has|\=\=|does|equal\-to|same\-as|a|not|\!|\!\=|\<\>|is\-not)\s/ig,' ');
		
      var params = str.split(/\s+/);		
      var subj = params.shift();
		var test = params.shift();
		
		//if two vars assume equality test//
		if ( /\#\#/.test(test) )
		{
			params[0] = test;
			test = '=';
		}
		
		if ( !this.tests[test] )
		{			
			Foul.alert(test + " Test doesn't exist");
			this.canceled = true;
		}		      
      
		var result = this.tests[test].apply( this, [subj, params] );
		if ( result === null ) this.canceled = true;
		
		if ( this.canceled ) return false;
		
		return ( negate ) ? !result : result;
   };
}

/*
   Class: FoulContext
   Responsible for storing variables for evaluation throughout a group test.
*/
function FoulContext()
{
	this.variables = new Array();

   /*
      Method: check
      Checks a token into the bank, returns the id for it.
      
      Parameters:
         v - mixed, token to check it to bank
      
      Returns:
         int, unique id for the token for use in evaluations
   */
	this.check = function( v )
	{
		for ( var c = 0; c < this.variables.length; c++ )
			if ( this.variables[c] === v )
				return c;
				
		this.variables[ this.variables.length ] = v;
      
		return (this.variables.length - 1);
	};

	/*
      Method: get
      Returns the token stored in the bank with id passed
      
      Parameters:
         i - mixed, id of the token to retrieve.
      
      Return:
         mixed, stored token
   */
	this.get = function( i )
	{
		if ( typeof(i) == 'string' ) i = parseInt(i.replace(/\#/g,''));
		return this.variables[i];
	}
}


/*
   Namespace: FoulTestBank
   collection of validation tests
*/
FoulTestBank = {
	
	'=' : function ( a, b )
	{		
		return ( this.context.get(a) == this.context.get(b[0]) );
	},

	'empty' : function( val )
	{		
		return Foul.empty( this.context.get(val) );		
	},

   'number': function( val )
	{		
		val = this.context.get(val);
      if ( this.canceled || Foul.empty(val) ) return null;
      return (!isNaN(val));
   },

   'decimal': function( val )
	{
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) ) return null;
      return (!isNaN(val) && /[0-9]+\.[0-9]+/.test(new String(val)) );
   },

   'range': function( val, params )
	{
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) ) return null;
		
      s = parseFloat(val);

      return ( s >= parseFloat(this.context.get(params[0])) && s <= parseFloat(this.context.get(params[1])) );
   },

   'greater-than': function( val, params ){
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) || isNaN(val) ) return null;

      return (parseFloat(val) > parseFloat(this.context.get(params[0])));
   },

   'less-than': function( val, params )
	{
		val = this.context.get(val);      
      
      if ( this.canceled || Foul.empty(val) || isNaN(val) ) return null;
      return (parseFloat(val) < parseFloat(this.context.get(params[0])));
   },

   'email': function( val )
	{
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) ) return null;
      return (/^.+\@..+\..+/.test(val));
   },

   'blanks': function( val )
	{
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) ) return null;
      return (/\s/.test( val ));
   },

   'url': function( val )
	{
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) ) return null;
      return (/^(https?|ftp|news)\:\/\/([\S]+\:[\S]+\@)?[a-zA-Z0-9\.\-]+(\/[\S]*)?$/.test(val));
   },

   'url-http': function( val )
	{
		val = this.context.get(val);   
      if ( this.canceled || Foul.empty(val) ) return null;
      return (/^https?\:\/\/[a-zA-Z0-9\.\-]+(\/[\S]*)?$/.test(val));
   },

   'url-ftp': function(val)
	{
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) ) return null;
      return (/^ftp\:\/\/([\S]+\:[\S]+\@)?[a-zA-Z0-9\.\-]+(\/[\S]*)?$/.test(val));
   },

   'zip': function( val )
	{
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) ) return null;
      return (/^\d{5}(\-\d{4})?$/.test(val));
   },

   'state': function( val )
	{
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) ) return null;
      var re = new RegExp('^(' + Foul.STATES.join('|') + ')$','i');
      return re.test(val);      
   },

   'zip-matches-state': function( val, params )
	{
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) ) return null;
		
      var state = this.context.get(params[0]).toUpperCase();      
      if ( Foul.empty(state) ) return null;

      var range = new String(Foul.STATE_ZIP_LOOKUP[state]).split('-');
      var digits = range[0].length;

      var zip = parseInt(val.substring(0,digits));

      if (range.length > 1){
         return (zip >= parseInt(range[0]) && zip <= parseInt(range[1]))
      } else {
         return (zip == parseInt(range[0]))
      }
   },

   'ssn': function( val, params )
	{
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) ) return null;
   
      return (/^\d\d\d\-\d\d\-\d\d\d\d$/.test(val) &&
         !/(^000)|(\-00\-)|(0000$)/.test(val) &&
         !/987\-65\-432[0-9]/.test(val));      
   },

   'file-type': function( val, params )
	{
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) ) return null;

      var files = this.context.get(params[0]).split(/[\s,]/g);

      for ( cnt=0; cnt < files.length; cnt++)
		{
         var re = new RegExp('\.'+ files[cnt] +'$','ig');
         if ( re.test(val) ) return true;         
      }

      return false;
   },

   'file-type-image': function( val )
	{
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) ) return null;

		for ( var c = 0; c < Foul.IMG_FILE_EXT.length; c++ )
		{
         var re = new RegExp('\.'+ Foul.IMG_FILE_EXT[c] +'$');
			if ( re.test(val) ) return true;
		}
		
		return false;
   },

   'file-type-executable': function( val )
	{
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) ) return null;

		for ( var c = 0; c < Foul.EXE_FILE_EXT.length; c++ )
		{
         var re = new RegExp('\.'+ Foul.EXE_FILE_EXT[c] +'$');
			if ( re.test(val) ) return true;
		}
		
		return false;
   },

   'vcc': function( val )
	{
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) ) return null;

      val = val.replace(/\D/g,'');
      if (val.length > 19) return false;
            
      if (isNaN(val)) return false;
		
      var sum = 0; mul = 1; l = val.length;
      for (i = 0; i < l; i++) {
         var digit = val.substring(l-i-1,l-i);
         var tproduct = parseInt(digit ,10)*mul;
         if (tproduct >= 10)
            sum += (tproduct % 10) + 1;
         else
            sum += tproduct;
         if (mul == 1)
            mul++;
         else
            mul--;
         }
      
      return ((sum % 10) == 0);      
   },

   'date-us': function( val )
	{
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) ) return null;

      if (/\d\d?\/\d\d?\/\d{2,4}/.test(val))
		{
         //logic validation//
         var pcs = val.match(/(\d\d?)\/(\d\d?)\/(\d{2,4})/);
         var d = new Date(pcs[3],pcs[1]-1,pcs[2]);
         var y = ((pcs[3].length == 2)?d.getYear():d.getFullYear());
         if (y == pcs[3] && d.getMonth()+1 == pcs[1] && d.getDate() == pcs[2]){
            return true;
         }
      }      
   
      return false;
   },
      
   'date-us-y2k': function( val )
	{
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) ) return null;

      if (/\d\d?\/\d\d?\/\d{4}/.test(val)) {
         //logic validation//
         var pcs = s.match(/(\d\d?)\/(\d\d?)\/(\d{4})/);
         var d = new Date(pcs[3],pcs[1]-1,pcs[2]);
         if (d.getFullYear() == pcs[3] && d.getMonth()+1 == pcs[1] && d.getDate() == pcs[2]) {
            return true;
         }
      }   

      return false;
   },

   'password': function( val )
	{
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) ) return null;
      return ((!/\s|\t|\n|\r/.test(val)) && val.length > 8);
   },
   
   'password-strength': function( val, params )
	{
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) ) return null;

      var pw = new String(val);

      //length of the password
      var pwlength=(pw.length);
      if (pwlength>5)
        pwlength=5;


      //use of numbers in the password
      var numnumeric = pw.replace (/[0-9]/g, "");
      var numeric=(pw.length - numnumeric.length);
      if (numeric>3)
        numeric=3;

      //use of symbols in the password
      var symbols = pw.replace (/\W/g, "");
      var numsymbols=(pw.length - symbols.length);
      if (numsymbols>3)
        numsymbols=3;

      //use of uppercase in the password
      var numupper = pw.replace (/[A-Z]/g, "");
      var upper=(pw.length - numupper.length);
      if (upper>3)
        upper=3;


      var pwstrength=((pwlength*10)-20) + (numeric*10) + (numsymbols*15) + (upper*10);

      // make sure we're give a value between 0 and 100
      if ( pwstrength < 0 ) {
        pwstrength = 0;
      }

      if ( pwstrength > 100 ) {
        pwstrength = 100;
      }

      return ( pwstrength > this.context.get(params[0]) ) ;
   },

   'in': function( val, params )
	{
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) ) return null;

		for ( var c = 0; c < params.length; c++ )
			if ( this.context.get(params[c]) == val ) return true;
	
      return false;
   },

	
   'phone-us': function( val )
	{
		val = this.context.get(val);      
      if ( this.canceled || Foul.empty(val) ) return null;  
      return (val.match(/^((1[\s\-\.]?)?\(?\d{3}\)?[\s\-\.]?)?\d{3}[\s\-\.]?\d{4}$/)?true:false);
   }

};

//create aliases//

FoulTestBank['null'] = FoulTestBank['blank'] = FoulTestBank['none'] = FoulTestBank['empty'];
FoulTestBank['numeric'] = FoulTestBank['integer'] = FoulTestBank['number'];
FoulTestBank['float'] = FoulTestBank['decimal'];
FoulTestBank['between'] = FoulTestBank['in-between'] = FoulTestBank['range'];
FoulTestBank['>'] = FoulTestBank['greater-than'];
FoulTestBank['<'] = FoulTestBank['less-than'];
FoulTestBank['matches-state'] = FoulTestBank['zip-matches-state'];
FoulTestBank['e-mail'] = FoulTestBank['email'];
FoulTestBank['spaces'] = FoulTestBank['blanks'];
FoulTestBank['valid-credit-card'] = FoulTestBank['valid-cc'] = FoulTestBank['vcc'];
FoulTestBank['zipcode-us'] = FoulTestBank['zip-us'] = FoulTestBank['zip'];
FoulTestBank['state-us'] = FoulTestBank['state'];
FoulTestBank['phone'] = FoulTestBank['phone-us'];
FoulTestBank['date'] = FoulTestBank['date-us'];

