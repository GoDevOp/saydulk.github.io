BMX.Calc = (function() {

	/** Fields */
	var _forwardingAddresses = $('#forwardingAddresses'),

		_decimals = 8,
		_fee = sfee/100,
		_fixedFee = sfixedfee;
	
	/** Methods */

	/* Bind events fopr calc */
	function bindEvents() {
		$('#sendInput').off('keyup').on('keyup', function() {
			_fee = Math.round(parseFloat($('#addfee').html())*10000)/1000000;
			
			console.log(_fee*100);
			
			var sendValue = $(this).val().trim(),
				sendValueParts = sendValue.split('.'),
				sendValueLastPart = '';

			if(!sendValue) {
				return;
			}

			if(sendValue === '0.') {
				return;
			}

			if(sendValueParts.length > 2) {
				sendValueParts.length = 2;	
				$(this).val(sendValueParts.join('.'));
				$(this).data('value', sendValueParts.join('.'));

				return false;
			}
			if(sendValueParts.length) {
				sendValueLastPart = sendValueParts[sendValueParts.length - 1];
				if(!(/^\d*$/.test(sendValueLastPart))) {
					sendValueLastPart = sendValueLastPart.substring(0, sendValueLastPart.length-1);
					sendValueParts[sendValueParts.length - 1] = sendValueLastPart;
					$(this).val(sendValueParts.join('.'));
					$(this).data('value', sendValueParts.join('.'));

					return false;
				}
			}
			if(sendValueParts.length === 2) {
				if(sendValueParts[1].length > _decimals) {
					sendValueLastPart = sendValueParts[sendValueParts.length - 1];
					sendValueLastPart = sendValueLastPart.substring(0, sendValueLastPart.length-1);
					sendValueParts[sendValueParts.length - 1] = sendValueLastPart;
					$(this).val(sendValueParts.join('.'));
					$(this).data('value', sendValueParts.join('.'));

					return false;
				}
			}

			$(this).data('value', sendValue);

			calcReceiveFields();
		});
		$('#sendInput').off('blur').on('blur', function() {
			var sendValue = $(this).data('value');

			if(!sendValue) {
				return;
			}

			if(sendValue.length && sendValue[sendValue.length-1]==='.') {
				sendValue = sendValue.substring(0, sendValue.length - 1);
			}

			if(isFinite(sendValue)) {
				sendValue = +sendValue;

				$('#sendInput').val(sendValue.toFormatString(_decimals));
				$('#sendInput').data('value', sendValue);
			}
			calcReceiveFields();
		});

		$('.receive-input').off('keyup').on('keyup', function() {
			var receiveValue = $(this).val().trim(),
				percent = 0,
				sendValue = 0,
				receiveValueParts = receiveValue.split('.'),
				receiveValueLastPart = '';

			if(!receiveValue) {
				return;
			}

			if(receiveValue === '0.') {
				return;
			}

			if(receiveValueParts.length > 2) {
				receiveValueParts.length = 2;	
				$(this).data('value', receiveValueParts.join('.'));

				return false;
			}
			if(receiveValueParts.length) {
				receiveValueLastPart = receiveValueParts[receiveValueParts.length - 1];
				if(!(/^\d*$/.test(receiveValueLastPart))) {
					receiveValueLastPart = receiveValueLastPart.substring(0, receiveValueLastPart.length-1);
					receiveValueParts[receiveValueParts.length - 1] = receiveValueLastPart;
					$(this).val(receiveValueParts.join('.'));
					$(this).data('value', receiveValueParts.join('.'));

					return false;
				}
			}
			if(receiveValueParts.length === 2) {
				if(receiveValueParts[1].length > _decimals) {
					receiveValueLastPart = receiveValueParts[receiveValueParts.length - 1];
					receiveValueLastPart = receiveValueLastPart.substring(0, receiveValueLastPart.length-1);
					receiveValueParts[receiveValueParts.length - 1] = receiveValueLastPart;
					$(this).val(receiveValueParts.join('.'));
					$(this).data('value', receiveValueParts.join('.'));

					return false;
				}
			}

			if(receiveValue.length === 1) {
				receiveValue = +receiveValue;
				if(receiveValue == 0) {
					$('#sendInput').val(0);
					$('#sendInput').data('value', 0);
					$('.receive-input').val(0);
					$('.receive-input').data('value', 0);

					return;
				}
			}
			else {
				receiveValue = +receiveValue;
				if(receiveValue == 0) {
					$('#sendInput').val(0);
					$('#sendInput').data('value', 0);
					$('.receive-input').data('value', 0);

					return;
				}
			}
			if(receiveValue < 0) {
				receiveValue = 0;
				$(this).val(0);
				$(this).data('value', 0);
			}

			$(this).data('value', receiveValue);

			percent = +$(this).parent().parent()
						.find('.percent').text().replace('%', '').replace('(', '').replace(')', '').trim();
			sendValue = (receiveValue + _fixedFee) / ((1 - _fee) * (percent / 100));

			if(sendValue < 0) { 
				sendValue = 0;
			}
			if(sendValue === 99.999999) {
				sendValue = 100;
			}
			$('#sendInput').val(sendValue.toFormatString(_decimals));
			$('#sendInput').data('value', sendValue);

			calcReceiveFields($(this).attr('id'));
		});
		$('.receive-input').off('blur').on('blur', function() {
			var receiveValue = $(this).data('value'),
				percent = 0,
				sendValue = 0;

			if(!receiveValue) {
				return;
			}

			if(!isFinite(receiveValue)) {
				return;
			}

			if(receiveValue.length && receiveValue[receiveValue.length-1]==='.') {
				receiveValue = receiveValue.substring(0, receiveValue.length - 1);
			}

			if(receiveValue.length === 1) {
				receiveValue = +receiveValue;
				if(receiveValue == 0) {
					$('#sendInput').val(0);
					$('#sendInput').data('value', 0);
					$('.receive-input').val(0);
					$('.receive-input').data('value', 0);

					return;
				}
			}
			else {
				receiveValue = +receiveValue;
				if(receiveValue == 0) {
					$('#sendInput').val(0);
					$('#sendInput').data('value', 0);
					$('.receive-input').data('value', 0);

					return;
				}
			}
			if(receiveValue < 0) {
				receiveValue = 0;
				$(this).val(0);
				$(this).data('value', 0);
			}

			$(this).val(receiveValue.toFormatString(_decimals));
			$(this).data('value', receiveValue);

			percent = +$(this).parent().parent()
						.find('.percent').text().replace('%', '').replace('(', '').replace(')', '').trim();
			sendValue = (receiveValue + _fixedFee) / ((1 - _fee) * (percent / 100));

			if(sendValue < 0) { 
				sendValue = 0;
			}
			if(sendValue === 99.999999) {
				sendValue = 100;
			}
			$('#sendInput').val(sendValue.toFormatString(_decimals));
			$('#sendInput').data('value', sendValue);

			calcReceiveFields($(this).attr('id'));
		});
	}

	/* Calculation receive fields */
	function calcReceiveFields(editedFieldId) {
		var sendValue = $('#sendInput').data('value'),
			receiveValue = 0,
			fieldId = null,
			percent = 0;

		if(!isFinite(sendValue)) {
			$('.receive-input').val('');
			$('.receive-input').data('value', '');
			return;
		}

		if(sendValue.toString().length === 1) {
			sendValue = +sendValue;
			if(sendValue == 0) {
				$('#sendInput').val(0);
				$('#sendInput').data('value', 0);
				$('.receive-input').val(0);
				$('.receive-input').data('value', 0);

				return;
			}
		}
		else {
			sendValue = +sendValue;
			if(sendValue == 0) {
				$('#sendInput').data('value', 0);
				$('.receive-input').val(0);
				$('.receive-input').data('value', 0);

				return;
			}
		}

		_forwardingAddresses.find('.item').each(function(index, obj) {
			fieldId = $(obj).find('.receive-input').attr('id');

			if(fieldId !== editedFieldId) {
				percent = +$(obj).find('.percent').text().replace('%', '').replace('(', '').replace(')', '').trim();

				receiveValue = sendValue * (1 - _fee) * (percent / 100) - _fixedFee;
				if(receiveValue < 0) {
					receiveValue = 0;
				}

				$(obj).find('.receive-input').val(receiveValue.toFormatString(_decimals));
				$(obj).find('.receive-input').data('value', receiveValue);
			}
		});

	}


	return {

		init: function() {
			bindEvents();
		}	
			
	};
	
})();

Number.prototype.toFormatString = function(decimals) {
	var preResult = this.toFixed(decimals);

	return preResult.replace(/0*$/, '').replace(/\.$/, '');
};