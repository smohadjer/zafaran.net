function Slideshow(options) {
	try {
		$(document);
	} catch (e) {
		alert('jQuery is not available!');
	}
	if (!options.id) {
		alert('Slideshow id has not been set!');
	};
	
	//default settings
	var settings = {
		id                   : null,
		startingSlideNumber  : 1,
		startingSlideId		 : null,
		//visibleSlidesCount   : 1, 		
		displayTime          : 3000,
		delay                : 500,
		slideTab_has_value	 : false,
		
		//if easing values are not linear or swing then jquery.ui plugin is required
		//possible values are: 'linear', 'swing', 'easeOutQuart', 'easeOutExpo'  
		easing				 : 'swing', 
		
		callback			 : false,	
		preload				 : false,
		autoplay             : false,
		loop				 : false,
		transition			 : 'default',	//'default', 'dissolve'	
		align				 : 'left',
		dataType			 : 'html',  //'xml', 'html'
		variableHeight		 : false,
		variableWidth		 : false,
		data				 : null,
		role				 : '',
		touch_enabled		: false
	};
	
	$.extend(true, settings, options);		

	//private properties	
	var slideshow = this;
	var id = '#' + settings.id;
	var slideNum;
	var slideTimer;	
	var previousSlidenum = -1;
	var slide = {};	
	var slides_width = 0;
	var slideshow_width;

	//use below functions to disable/enable autoplay when browser tab loses focus to avoid queing of animations when tab is blurred.
	//currently we use .stop(true, true) to achieve that.
	$(window).blur(function(){
		$('body').addClass('blurred');
	});
	$(window).focus(function(){
		$('body').removeClass('blurred');
	});	
	
	$(window).resize(function() {
		slideshow.resize();
	});
	
	//public methods
	this.slideNumber = function(num) {
		if (num != null) {
			slideNum = parseInt(num);
			update();
			moveToSlide(slideNum);
		} else {
			return slideNum;
		}
	}
	
	slideshow.resize = function() {
		slideshow_width = $(id).width();	
		slide.div.width(slideshow_width);
		positionSlides();		
		moveToSlide(slideNum);
	}
	
	this.align = function() {
		settings.align = alignment;
		moveToSlide(slideNum);
	}
	
	this.getSlideCount = function() {
		return slide.count;
	}	
	
	this.remove_slide_by_id = function(id) {
		if ($('#'+id).length) {
			$('#'+id).remove();
			update();
		} else {
			return false;
		}
	}
	
	this.remove_slide_by_ordinal = function(position) {
		if (slide.div.eq(position).length) {
			slide.div.eq(position).remove();
			update();
		} else {
			return false;		
		}
	}
	
	this.add_slide = function(slide_markup) {
		$(id + ' .slides').prepend(slide_markup);
		slideNum = 1;	
			
		if (slide.count == 0) {
			init();
		} else {
			moveToSlide(1);			
		}		
		
		update();		
	}
	
	this.set_caption = function(id, caption) {
	    if ($('#'+ id + ' .caption').length) {
			$('#'+ id + ' .caption').text(caption);
			update();
		} else {
			return false;
		}
	}
	
	this.move_slide = function(slide_id, position) {
	    if ($('#'+slide_id).length) {	
			slideNum = position;	
			if ( $('#'+slide_id).index() < slideNum-1) {
				$('#'+slide_id).insertAfter(slide.div.eq(slideNum-1));		
			} else {
				$('#'+slide_id).insertBefore(slide.div.eq(slideNum-1));		
			}
			moveToSlide(slideNum);		
			update();	
		} else {
			return false;		
		}
	}
	
	//private methods	
	var preload = function() {
		if (settings.preload) {
			if (jQuery.fn.imagesLoaded) {
				$('.slides').imagesLoaded(function() {
					init();
				});				
			} else {
				alert('JQuery plugin "imagesLoaded" (jquery.imagesloaded.js) is missing!');
				//init();
			}
		} else {
			init();
		}		
	}
	
	var create_slideTabs = function() {
		var slideTabs = $(id + ' .slideTabs');
		
		if (slideTabs.children().length == 0) {
			var tabValue;
			for (var i=0; i<slide.count; i++) {			
				tabValue = settings.slideTab_has_value ? i+1 : '';
				slideTabs.append('<a href="#">' + tabValue + '</a>');
			}
		}
		
		slide.tabs = $(id + ' .slideTabs a');		
		
		slide.tabs.click(function(e) {
			e.preventDefault();
			disableAutoplay();		
			slide.tabs.attr('class', '');
			$(this).attr('class', 'selected');
			slideNum = $(this).index()+1;		
			moveToSlide(slideNum);
			return false;
		});
	}
	
	var init = function() {
		if (settings.startingSlideId) {
			var myitem = $('#'+ settings.startingSlideId);
			slideNum = parseInt($(id + ' .slide').index(myitem)) + 1;
		} else {
			slideNum = parseInt(settings.startingSlideNumber);	
		}
		
		slide.count = $(id + ' .slide').length;		

		if ($(id + ' .slideTabs').length) create_slideTabs();

		slide.margin  =  parseInt($(id + ' .slide').css('margin-right'));
		slide.div = $(id + ' .slide');  //rename this as there may be no div in markup
		slide.prevBtn = $(id + ' .prev');
		slide.nextBtn = $(id + ' .next');
		
		slide.nextBtn.click(function() {		
			navigate('next');
			return false; 
		});
		slide.prevBtn.click(function() {
			navigate('previous');
			return false; 
		});
		
		if (settings.touch_enabled) add_drag_handlers();

		$(id).show(); //slideshow must be visible before positioning code runs as positioning relies on $.width() which doesn't work on hidden elements
		slideshow_width = $(id).width();
		if (settings.variableWidth) {
			slide.div.width(slideshow_width);
		}

		positionSlides();
		if (settings.autoplay) enableAutoplay();		
		moveToSlide(slideNum);
	}
		
	var disableAutoplay = function() {
		if (settings.autoplay) {
			settings.autoplay = false;		
			window.clearInterval(slideTimer);  	
		}
	}	

	var enableAutoplay = function() {
		settings.autoplay = true;
		slideTimer = window.setInterval(function() {
			(slideNum == slide.count) ? slideNum = 1 : slideNum++;
			moveToSlide(slideNum); 
		}, settings.displayTime);		
	}

	var navigate = function(direction) {
		disableAutoplay();
		
		//next/prev buttons only move slides one slide to left/right without changing currently selected slide 
		//usage scenario is when multiple slides are visible
		if (settings.role == 'dual') {
			var visible_slides = find_visible_slides();		
			var slidesLeft = $(id + ' .slides').position().left; 
			var slideMargins = parseInt( slide.div.css('margin-right') + slide.div.css('margin-left') );
						
			if (direction == 'next') {	
				if (visible_slides.last < slide.count) {
					slidesLeft = slide.div.eq(visible_slides.last).position().left - (slideshow_width - slide.div.eq(visible_slides.last).outerWidth()) + slideMargins;
					$(id + ' .slides').animate( { 'left' : -1*slidesLeft }, settings.delay, settings.easing, function() {
						var new_visible_slides = find_visible_slides();
						if (new_visible_slides.last == slide.count) {
							slide.nextBtn.addClass('disabled');	
						}
					});										
				}
				slide.prevBtn.removeClass('disabled'); 
			} else {
				if (visible_slides.first > 1) {
					slidesLeft =  slide.div.eq(visible_slides.first-2).position().left - slideMargins;
					$(id + ' .slides').animate( { 'left' : -1*slidesLeft }, settings.delay, settings.easing, function() {
						var new_visible_slides = find_visible_slides();
						if (new_visible_slides.first == 1) {
							slide.prevBtn.addClass('disabled');	
						}					
					});			
				}	
				slide.nextBtn.removeClass('disabled');				
			}
		} else {
			//update slideNum
			if (direction == 'next') {						
				if (slideNum < slide.count ) {
					slideNum++
				} else if (settings.loop) {
					slideNum = 1;
				}
			} else if (direction == 'previous') {
				if (slideNum > 1) {
					slideNum--;
				} else if (settings.loop) {
					slideNum = slide.count;
				}
			}		
			moveToSlide(slideNum);
		}			
	}
	
	//returns the slide number of the first and last visible slides
	var find_visible_slides = function() {
		var firstVisibleSlideNum;
		var lastVisibleSlideNum;
		var slideLeft;
		var slidesLeft = Math.abs($(id + ' .slides').position().left);		
		
		for (var i = 0; i < slide.count; i++) {
			slideLeft = slide.div.eq(i).position().left;
			if (firstVisibleSlideNum == undefined) {
				if ( slideLeft >= slidesLeft) firstVisibleSlideNum = i+1;
			}
			if (lastVisibleSlideNum == undefined) {
				if ( slideLeft - slidesLeft > slideshow_width - slide.div.eq(i).width()) lastVisibleSlideNum = i;			
			}
		}	
		//hack for bug fixing
		if (lastVisibleSlideNum == undefined) lastVisibleSlideNum = slide.count;
					
		return({first: firstVisibleSlideNum, last:lastVisibleSlideNum});
	}

	var positionSlides = function() {
		var left = 0;
		var marginRight = parseInt(slide.div.css('margin-right'));

		//we set width of div.slides to a very large value so that content of div.slide will not wrap due to slideshows fixed width value. This is important when slide divs's width is not
		//fixed and is calculated on the fly by javascript. After all slides are positioned we update width of div.slides to the correct value (even though there is no need for that).
		//remove this hack later when you find a better solution to avoid wrapping of div.slide content.
		$(id + ' .slides').width(50000);
		for (var i = 0; i < slide.count; i++) {
			if (settings.transition == 'dissolve') {
				slide.div.eq(i).css('z-index', 100-i);
			} else  {		
				slide.div.eq(i).css('left', left+'px');
				left = left + slide.div.eq(i).outerWidth()+ marginRight;
				//+ ( (i != slide.count-1) ? marginRight : 0 );
				slides_width = left;
			}
		}
		$(id + ' .slides').width(slides_width);		
	}		
	
	var moveToSlide = function(num) {
		var currentSlide = slide.div.eq(num-1);
		var slide_left = currentSlide.position().left;
		var slide_center = currentSlide.position().left + currentSlide.width()/2;
		var slideshow_center = slideshow_width/2;		
					
		if (settings.transition == 'default') {
			
			if (settings.align == 'center') {
				if (slide_center > slideshow_center) {
					if (slide_center < slides_width - slideshow_center) {
						slide_left = slide_left - (slideshow_width - currentSlide.width())/2;
					} else {
						slide_left = slides_width - slideshow_width;
					}
				} else {
					slide_left = 0;
				} 
			}			
			
			/*
			if (settings.align == 'center_all') {
				slide_left = slide_left - (slideshow_width - currentSlide.width())/2;
			}
			*/

			$(id + ' .slides').stop(true, true).animate( { 'left' : - slide_left}, settings.delay, settings.easing, function() {
				if (options.variableHeight) {
					addImageErrorLoadHandlers();
					setSlideHeight();
				}			
			});				
		}
				
		if (settings.transition == 'dissolve') {		
			currentSlide.css({'display':'none', 'z-index':100});
			slide.div.eq(previousSlidenum).css('z-index', 99);
			currentSlide.stop(true, true).fadeIn(1000);
			slide.div.eq(previousSlidenum).stop(true, true).fadeOut(1000);			
		}		
		
		if (settings.callback) {
			settings.callback(slideshow);
		}		
		
		updateUI();
		previousSlidenum = num-1;		
		
		slide.div.removeClass('currentSlide');
		currentSlide.addClass('currentSlide');
		
		if ($(id + ' .slideTabs').length) {		
			slide.tabs.removeClass('selected');
			slide.tabs.eq(slideNum-1).addClass('selected');
		}		
	}
	
	var add_drag_handlers = function() {
		var startX, endX;
		var slides = slide.div;
		
		slides.bind(TouchMouseEvent.DOWN, function(e) {
			e.preventDefault();
			startX = e.pageX;
			endX = startX;
		});

		slides.bind(TouchMouseEvent.MOVE, function(e) {
			e.preventDefault();
			endX = e.pageX;
		});			
		
		slides.bind(TouchMouseEvent.UP, function(e) {
			e.preventDefault();
			var slideIndex = slides.index($(this));
			
			if ( endX - startX < 0) {
				navigate('next');
			} else if ( endX - startX > 0) {
				navigate('previous');
			} else {
				if ( slideIndex != slideNum ) {
					//user clicked a side slide
					slideNum = slideIndex;
					positionSlides();
				} else {
					//user has clicked current slide
					//do something
				}
			}
		});
	}	

	var setSlideHeight = function() {
		var heightOfConsole = ($(id + ' .console').length) ? $(id + ' .console').outerHeight(true) : 0;
		var slideHeight = $(id + ' .slide:eq('+(slideNum-1)+')').outerHeight();
		$(id).css('height', slideHeight + heightOfConsole);
	}

	//replace code with one from below:
	// http://stackoverflow.com/questions/4857896/jquery-callback-after-all-images-in-dom-are-loaded
	var addImageErrorLoadHandlers = function() {
		var images = $(id + ' .slide:eq(' + (slideNum-1) + ') img');
		for (var i = 0; i<images.length; i++ ) {
			images[i].onload = function(evt) {
				setSlideHeight();
			}
			images[i].onerror = function(evt) {
				this.src = "images/image_not_found.jpg";
			}
		}
	}

	var update = function() {
		slide.div = $(id + ' .slide');
		slide.count = slide.div.length; 
		positionSlides();
		if ( (slideNum > slide.count) && (slide.count != 0) ) {
			slideNum = slide.count;
			moveToSlide(slideNum);
		} 
		updateUI();
	}

	var updateUI = function() {
		//var count = slide.count - settings.visibleSlidesCount + 1;
		if (slide.count == 0) slideNum = 0;

		$(id + ' .slideNumber').text(slideNum); 
		$(id + ' .slidesCount').text(slide.count);  
		
		if (settings.loop) {
			//buttons are always enabled
			slide.prevBtn.removeClass('disabled'); 
			slide.nextBtn.removeClass('disabled'); 		
		} else {
			if ( (slideNum == slide.count) && (slideNum == 1) ) {
				slide.prevBtn.addClass('disabled');    
				slide.nextBtn.addClass('disabled');   			
			} else if (slideNum == slide.count) {
				slide.prevBtn.removeClass('disabled');    
				slide.nextBtn.addClass('disabled');   
			} else if (slideNum == 1) {
				slide.prevBtn.addClass('disabled');    
				slide.nextBtn.removeClass('disabled');    
			} else {
				slide.prevBtn.removeClass('disabled'); 
				slide.nextBtn.removeClass('disabled'); 
			}		
		}
	}
	
	if (settings.dataType == 'xml') {
		$.ajax({
			url: settings.data,
			dataType: "xml",
			success: function(xml) {
				var content = "";
				$(xml).find('slide').each(function() {
					var id = ( $(this).attr('id')) ? 'id="' + $(this).attr('id') + '"' : '';
					content += '<div class="slide"'+ id +'>'+$(this).text()+'</div>';
				});
				$(id + ' .slides').append(content);
				preload();
			}
		});		
	} else {
		if ($(id + ' .slide').length > 0) {
			preload();
		}		
	}	
}