# Foul 2.0

Foul is a JavaScript based, form validation language. If you hate all the rigamarole you have to go through just to check a simple web form, then this script is what you need.

I'm a veteran when it comes to form validation. I know first hand how much of a pain it is. This script makes form validation stupidly easy and still allows for that tweaking that programmers are always looking for.

Foul contains a full language parsing engine which compiles advanced conditions and tests for the fields of a form. The language makes building tests as easy as saying what you want. The tests include, blank fields, numbers, phone numbers, credit cards, urls, zip codes, states, emails, social security numbers ranges, lengths, dates, file types and much more. Foul also contains an auto-formatting feature which fixes the data before it's set.

## Before Foul ( 2,072 Bytes 63 Lines )

    function validate(frm) {
    if ( frm.elements["Name"].value == '') {
    alert( "Please enter your name." );
    frm.elements["Name"].focus();
    return false;
    }
    if ( frm.elements["Title"].value == '' ) {
    alert( "Please enter your title." );
    frm.elements["Title"].focus();
    return false;
    }
    if ( frm.elements["Organization"].value == '' ) {
    alert( "Please enter the name of your company." );
    frm.elements["Organization"].focus();
    return false;
    }
    if ( frm.elements["Address"].value == '' ) {
    alert( "Please enter your address." );
    frm.elements["Address"].focus();
    return false;
    }
    if ( frm.elements["City"].value == '' ) {
    alert( "Please enter your city." );
    frm.elements["City"].focus();
    return false;
    }
    if ( frm.elements["State or Province"].selectedIndex == 0 ) {
    alert( "Please select your state or province.");
    frm.elements["State or Province"].focus();
    return false;
    }
    if ( frm.elements["Postal or Zip Code"].value == '' ) {
    alert( "Please enter your postal or zip code.");
    frm.elements["Postal or Zip Code"].focus();
    return false;
    }
    if ( frm.elements["Country"].value == '' ) {
    alert( "Please enter your country." );
    frm.elements["Country"].focus();
    return false;
    }
    // Check the Email field to see if any characters were entered
    if ( frm.elements["Email Address"].value == '' ) {
    alert( "Please enter an email address." );
    frm.elements["Email Address"].focus();
    return false;
    }
    // Now check Email field for the "@" symbol
    if (!/^.+@..+..+/.test(frm.elements["Email Address"].value)) {
    alert( "Please enter a valid email address." );
    frm.elements["Email Address"].focus()
    return false;
    }
    if ( frm.elements["Phone Number"].value == '' ) {
    alert( "Please enter your phone number." );
    frm.elements["Phone Number"].focus();
    return false;
    }
    if ( frm.elements["Message"].value == '' ) {
    alert( "Please enter your message, comments, or questions." );
    frm.elements["Message"].focus();
    return false;
    }
    }

## After Foul ( 435 Bytes 11 Lines )

    foul.when("~Name~");
    foul.when("~Title~");
    foul.when("~Organization~");
    foul.when("~Address~");
    foul.when("~City~");
    foul.when("~State or Province~");
    foul.when("~Postal or Zip Code~");
    foul.when("~Country~");
    foul.when("~Email Address~");
    foul.when("~Email Address~ is not email");
    foul.when("~Phone Number~");
    foul.when("~Message~");

## Additions in 2.0

Inline notifications next to form elements
Length test changed into a modifier :length
Added password-strength test
Added zip-matches-state test
Added support for using string and numerical literals in tests
Added ability to create validation groups
Added support for inline validation
