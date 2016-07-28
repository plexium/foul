<?php
require_once 'simpletest/autorun.php';
require_once 'foul.php';

class TestOfFoul extends UnitTestCase {
   
   public function setUp()
   {
      $this->post = array(
         'first_name' => 'Bryan',
         'middle_initial' => '',
         'state' => 'MI',
         'phone' => '8105551234',
         'age' => '32',
         'temp' => '98.7',
         'zip' => '48473',
         'credit-card' => '4111111111111111',
         'ssn' => '123-45-6789',
         'email' => 'bryan@bluelinecity.com',
         'password' => 'my long! p@ssw0rd',
         'homepage' => 'http://bluelinecity.com',
         'ftpsite' => 'ftp://someftp.site.com',
         'upload' => 'somefile/test.bat',
         'image' => 'somefolder/profileimage.jpg',
         'dob' => '7/17/1979',
         'blanks' => '  '
      );      
   }
   
   public function testStaticFunctions()
   {      
      $something = null;
      $this->assertTrue(Foul::isEmpty( $something ));
      $this->assertTrue(Foul::isEmpty( '' ));
      
      $onion = Foul::onion('This is ( my (test) string ) with ( pa\\(rans ) and stuff');
      $this->assertEqual(' my (test) string ', $onion[0]);
      $this->assertEqual(' pa\\(rans ', $onion[1]);
   }
   
   public function testCreateTestGroup()
   {
      $tg = Foul::create( $this->post );
      
      $this->assertTrue( $tg );
   }
   
   
   public function testFoulContext()
   {
      $context = new FoulContext();
      
      $this->assertEqual(0,$context->check('Test 1'));
      
      $this->assertEqual('Test 1', $context->get(0));
      
      $this->assertEqual(1,$context->check('Test 2'));
      $this->assertEqual(2,$context->check(56));
      $this->assertEqual(0,$context->check('Test 1'));
      
      $this->assertEqual(56, $context->get('##2'));     
   }
   
   
   public function testTestCompile()
   {
      $tg = Foul::create( $this->post );
      
      $t = new FoulTest( $tg, '~first_name~ is not null', 'First Name is a required field');
      $t->context =& new FoulContext();      
      $t->compile();
      
      $this->assertEqual('##0 is not null', $t->compiled );
      $this->assertEqual('Bryan', $t->context->get(0) );

      $u = new FoulTest( $tg, '~phone~ = 120 and ~phone~ != "1890"', 'Phone number');
      $u->context =& $t->context;      
      $u->compile();
      
      $this->assertEqual('##1 = ##3 and ##1 != ##2', $u->compiled );
      $this->assertEqual('8105551234', $u->context->get(1) );
      
   }

   public function testTestTest()
   {
      $tg = Foul::create( $this->post );
      
      $t = new FoulTest( $tg, '1 = 1', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ) );

      
      $t = new FoulTest( $tg, '1 = 2', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertFalse( $t->evaluate( $t->compiled ) );
      
      
      $t = new FoulTest( $tg, '~first_name~ is null', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertFalse( $t->evaluate( $t->compiled ) );
      
      //is null//
      $t = new FoulTest( $tg, '~middle_initial~ is null', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ) );
      
      //number//
      $t = new FoulTest( $tg, '~age~ is number', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'number' );
      
      //decimal//
      $t = new FoulTest( $tg, '~temp~ is decimal', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'decimal' );
      
      //range//
      $t = new FoulTest( $tg, '~age~ range 10 40', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();                  
      $this->assertTrue( $t->evaluate( $t->compiled ), 'range' );
      
      //greater-than//
      $t = new FoulTest( $tg, '~age~ greater-than 30', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'greater-than' );
      
      //less-than//
      $t = new FoulTest( $tg, '~age~ less-than 35', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'less-than' );
      
      //email//
      $t = new FoulTest( $tg, '~email~ is email', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'email' );
      
      //blanks//
      $t = new FoulTest( $tg, '~blanks~ has blanks', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'blanks' );
      
      //url//
      $t = new FoulTest( $tg, '~homepage~ is url', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'url' );
      
      //url-http//
      $t = new FoulTest( $tg, '~homepage~ is url-http', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'url-http' );
      
      //url-ftp//
      $t = new FoulTest( $tg, '~ftpsite~ is url-ftp', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'url-ftp' );
      
      //zip//
      $t = new FoulTest( $tg, '~zip~ is a zip', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'zip' );
      
      //state//
      $t = new FoulTest( $tg, '~state~ is a state', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'state' );
      
      //zip-matches-state//
      $t = new FoulTest( $tg, '~zip~ zip-matches-state ~state~', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'zip-matches-state' );
      
      //ssn//
      $t = new FoulTest( $tg, '~ssn~ is a ssn', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'ssn' );
      
      //file-type//
      $t = new FoulTest( $tg, '~upload~ is file-type "bat,exe,dll"', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'file-type' );
      
      //file-type-image//
      $t = new FoulTest( $tg, '~image~ is file-type-image', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'file-type-image' );
      
      //file-type-executable//
      $t = new FoulTest( $tg, '~upload~ is file-type-executable', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'file-type-executable' );
      
      //vcc//
      $t = new FoulTest( $tg, '~credit-card~ is vcc', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'vcc' );
      
      //date-us//
      $t = new FoulTest( $tg, '~dob~ is date-us', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'date-us' );
      
      //date-us-y2k//
      $t = new FoulTest( $tg, '~dob~ is date-us-y2k', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'date-us-y2k' );
      
      //password//
      $t = new FoulTest( $tg, '~password~ is password', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'password' );
      
      //password-strength//
      $t = new FoulTest( $tg, '~password~ password-strength 50', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'password-strength' );
      
      //in//
      $t = new FoulTest( $tg, '~state~ in MI OH CA', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'state' );
      
      //phone-us//
      $t = new FoulTest( $tg, '~phone~ is phone-us', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();            
      
      $this->assertTrue( $t->evaluate( $t->compiled ), 'phone' );
      
   }
   
   public function testParse()
   {
      $tg = Foul::create( $this->post );
      
      $t = new FoulTest( $tg, '~phone~ is phone', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();                  
      $this->assertTrue( $t->parse( $t->compiled ) );

      $t = new FoulTest( $tg, '~phone~ is phone and ~state~ is state', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();                  
      $this->assertTrue( $t->parse( $t->compiled ) );

      $t = new FoulTest( $tg, '~phone~ is phone and ~state~ is not state', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();                  
      $this->assertFalse( $t->parse( $t->compiled ) );

      $t = new FoulTest( $tg, '~phone~ is phone or ~state~ is not state', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();                  
      $this->assertTrue( $t->parse( $t->compiled ) );

      $t = new FoulTest( $tg, '~phone~ is phone or ~state~ is not state', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();                  
      $this->assertTrue( $t->parse( $t->compiled ) );

      $t = new FoulTest( $tg, '~phone~ is not phone or ~state~ is not state', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();                  
      $this->assertFalse( $t->parse( $t->compiled ) );

      $t = new FoulTest( $tg, '(~phone~ is phone and ~state~ is state) or ( ~age~ = 99)', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();                  
      $this->assertTrue( $t->parse( $t->compiled ) );

      $t = new FoulTest( $tg, '(~phone~ is phone and ~state~ is state) and ( ~age~ = 99)', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();                  
      $this->assertFalse( $t->parse( $t->compiled ) );

      $t = new FoulTest( $tg, '(~phone~ is not phone or ~state~ is not state) and ( ~age~ = 99)', 'Test');
      $t->context =& new FoulContext();      
      $t->compile();                  
      $this->assertFalse( $t->parse( $t->compiled ) );
      
   }
   
   
   public function testRun()
   {
      $tg = Foul::create( $this->post );
      $c = new FoulContext();
      
      $t = new FoulTest( $tg, '~phone~ is phone', 'Test');      
      $this->assertTrue( $t->run( $c ) );

      $t = new FoulTest( $tg, '~phone~ is NOT phone', 'Test');      
      $this->assertFalse( $t->run( $c ) );      
   }

   
   public function testWhen()
   {
      $tg = Foul::create( $this->post );
      
      $tg->when('~first_name~');
      $tg->when('~state~ not state','Must indicate a valid state');
      $tg->when('~phone~ not phone','Please specify a valid phone number');
      $tg->when('~email~ not email');
      
      $this->assertEqual($tg->tests[0]->test,'~first_name~ null');
      $this->assertEqual($tg->tests[0]->message,'first_name is a required field.');
      $this->assertEqual($tg->tests[1]->test,'~state~ not state');
      $this->assertEqual($tg->tests[2]->test,'~phone~ not phone');
      $this->assertEqual($tg->tests[3]->message,'Please enter a valid email address.');
   }
   
   public function testValidate()
   {
      $tg = Foul::create( $this->post );
      
      $tg->when('~first_name~');
      $tg->when('~state~ not state','Must indicate a valid state');
      $tg->when('~phone~ not phone','Please specify a valid phone number');
      $tg->when('~email~ not email');    
      $this->assertTrue( $tg->validate() );
      
      $tg = Foul::create( $this->post );
      
      $tg->when('~age~ < 40','Age must be over 40');
      $tg->when('~state~ not in CA','Must be California');
      $this->assertFalse( $tg->validate() );
      $this->assertEqual('Age must be over 40',$tg->errors[0]);      
      $this->assertEqual('Must be California',$tg->errors[1]);      
   }
   
   
   public function testClientCode( $varname = 'foul')
   {
      $tg = Foul::create( $this->post );
      
      $tg->when('~first_name~');
      $tg->when('~state~ not state','Must indicate a valid state');
      $tg->when('~phone~ not phone','Please specify a valid phone number');
      $tg->when('~email~ not email');    
      
      $client = "foul.when('~first_name~ null','first_name is a required field.');
foul.when('~state~ not state','Must indicate a valid state');
foul.when('~phone~ not phone','Please specify a valid phone number');
foul.when('~email~ not email','Please enter a valid email address.');
";
      $this->assertEqual($client,$tg->getClientCode());
   }
}
