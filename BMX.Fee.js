BMX.Fee = (function() {

	/** Fields */
	var 	addresses=10,
		_element = $('#feeSlider'),
		_sliderIsInit = false,

		_minSliderValue = 0,
		_maxSliderValue = 300;


	/** Methods */

	/* Get array of handles positions */
	function getHandlesArray() {
		var result = [];
		result.push(10+Math.round(30 * Math.random()));
		console.log(result);

		return result;
	}

	/* Set percent values to addresses */
	function setPercentageValues(handles) {
		var fee=0;
		if (handles[0]!=0) fee=handles[0]/100 + Math.random()/100;
		fee=Math.round((fee+sfee)*10000)/10000;
		$('#addfee').html(fee);
		$('#fee').html(fee);
		servicefee=fee;
	}

	/* Percentage slider onslide callback */
	function onSliderSlide(event, ui) {
		var handles = _element.slider('values'),
			normalHandles = checkSlideHandles(ui);

		if(normalHandles === null) {
			setPercentageValues(handles);
		}
		else {
			_element.slider('destroy');		
			_element.slider({
				values: normalHandles,
				slide: onSliderSlide,
				stop: onSliderSlide,
				min: _minSliderValue,
				max: _maxSliderValue - 1
			});

			setPercentageValues(normalHandles);
			return false;
		}
	}

	/* Check handles on superposition. 
	(If handles positions are wrong then return normal positions for handles) */
	function checkSlideHandles(ui) {
		var isNormal = true,
			handles = _element.slider('values'),
			moveHandleIndex = -1;

		if(handles.length < 2) {
			return null;
		}

		_element.find('a').each(function(index, obj) {
			if($(ui.handle).equals($(obj))) {
				moveHandleIndex = index;
			}
		});

		// for first handle
		if(moveHandleIndex === 0) {
			if( handles[moveHandleIndex] >= handles[moveHandleIndex + 1]) {
				handles[moveHandleIndex] = handles[moveHandleIndex + 1] - 1;
				isNormal = false;
			}
		}
		// for last handle
		else if(moveHandleIndex === handles.length - 1) {
			if( handles[moveHandleIndex] <= handles[moveHandleIndex - 1]) {
				handles[moveHandleIndex] = handles[moveHandleIndex - 1] + 1;
				isNormal = false;
			}
		}
		// for other handles
		else {
			if( handles[moveHandleIndex] >= handles[moveHandleIndex + 1]) {
				handles[moveHandleIndex] = handles[moveHandleIndex + 1] - 1;
				isNormal = false;
			}
			else if( handles[moveHandleIndex] <= handles[moveHandleIndex - 1]) {
				handles[moveHandleIndex] = handles[moveHandleIndex - 1] + 1;
				isNormal = false;
			}
		}

		if(isNormal) {
			return null;
		}
		else {
			return handles;
		}
	}


	return {
		init: function() {

			if(_sliderIsInit) {
				_element.slider('destroy');
				_sliderIsInit = false;
			}
		},

		render: function() {
			var handles = [];

			//_element.parent().show();
			handles = getHandlesArray();

			if(_sliderIsInit) {
				_element.slider('destroy');				
			}
			_element.slider({
				values: handles,
				slide: onSliderSlide,
				stop: onSliderSlide,
				min: _minSliderValue,
				max: _maxSliderValue - 1
			});

			setPercentageValues(handles);
			_sliderIsInit = true;
		}
	};
	
})();