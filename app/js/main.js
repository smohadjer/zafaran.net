$(document).ready(function () {
    $('a[rel*=external]').attr('target', '_blank');
	
	if ($('#home').length) zafaran.home.init();
	
	/*
	$(window).resize(function() {
		zafaran.home.init();	
	});
	*/	
});		

zafaran = {
	sidebar: {},
	home: {}
}

/*
zafaran.sidebar.vertical_center = function() {
	var win_h = $(window).height();
	var sidebar_h = $('#sidebar').height();
	
	if (sidebar_h < win_h) {
		var m_top = (win_h - sidebar_h) /2
		$('#sidebar').css('margin-top', m_top);
	}
}
*/

zafaran.home.init = function() {
	var win_h = $(window).height();
	$('#side_banner').height(win_h);

	//zafaran.sidebar.vertical_center();	
}







