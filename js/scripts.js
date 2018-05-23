 "use strict";

$(document).ready(function(){
    
		$('ul.thumbnail li').hover(function() {
			$(this).find('span').fadeToggle('fast');
		});
        
		$('.newsletter-button').hover(function() {
			$(this).fadeToggle('fast');
		});        
});