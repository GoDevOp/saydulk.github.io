BMX.App = (function() {

	/** Fields */
	var 	
		termsaccepted=false,
		timerid,
		_step1 = $('#step1'),
		_step2 = $('#step2'),
		_step3 = $('#step3'),

		_bitcode = $('#bitcode'),

		_btnAddForwardAddress = $('#btnAddForwardAddress'),
		_btnMixMyCoins = $('#btnMixMyCoins'),
		_btnOneMoreForwardAddress = $('#btnOneMoreForwardAddress'),
		_resetLink = $('#resetLink'),

		_allAddressesIsValid = false,
		_bitcoinAddressesContainer = $('#bitcoinAddressesContainer'),
		_forwardingAddresses = $('#forwardingAddresses'),
		_addr = $('#addr'),

		_loader = null;



	/** Methods */

	/* Bind base app events */
	function bindEvents() {		
		$('.question').tooltip({
			placement: 'right'
		});
		
		$('#accept1').on('click', function () {
			//BMX.CookieHelper.setItem('termsaccepted', true);
			termsaccepted=true;
			$("#confirmTerms").modal('hide');
			toStep3();
			return false;
		});

		$("#ch1, #ch2").click(function(){    
		    if ($('#ch1').is(':checked') && $('#ch2').is(':checked')){
			$('#accept1').removeAttr('disabled');	
		    } else {	
			$('#accept1').attr('disabled', '');
		    }
		});


		/* Step 1 */

		_btnAddForwardAddress.on('click', function() {
			toStep2();
			return false;
		});


		/* Step 2 */

		_btnMixMyCoins.on('click', function() {
			if (termsaccepted) {toStep3();}
			  else acceptTerms();	  
			return false;
		});

		_btnOneMoreForwardAddress.on('click', function() {	
			addBitcoinAddress();
			return false;
		});


		/* Step 3 */
		_resetLink.on('click', function() {			
			resetValues();
			toStep1();
			return false;
		});

		_addr.on('click', function() {
			selectText(this.id);
		});

	}
	
	function acceptTerms() {
	    termsaccepted=false;
	    $("#ch1").attr("checked", false);
	    $("#ch2").attr("checked", false);
	    $('#accept1').attr('disabled', '');
	    $("#confirmTerms").modal({backdrop: 'static'});
	}

	/* Bind click on delete bitcoin address link */
	function bindRemoveAddresses() {
		_bitcoinAddressesContainer.find('.del-link')
			.off('click')
			.on('click', function() {
				$(this).parent().parent().remove();

				checkBitcoinAddressesCount();
				validateAllAddressFields();

				// Render percentage slider after remove bitcoin address
				BMX.Percentage.render();

				// Render time slider after remove bitcoin address
				BMX.TimeDelay.render();
				
			});
	}

	/* Bind events for validate bictoin address */
	function bindAddressValidate() {
		_bitcoinAddressesContainer.find('input[type=text]')
			.off('blur')
			.on('blur', function() {
				validateAllAddressFields();
			});

		_bitcoinAddressesContainer.find('input[type=text]')
			.off('keyup')
			.on('keyup', function() {
				validateAllAddressFields();
			});
	}

	/* Reset all values */
	function resetValues() {
		removeAllBitcoinAddresses();
		//qrcode.clear(); // clear the code.
	}

	/* Go to step 1 */
	function toStep1() {
		clearTimeout(timerid);
		_step2.hide();
		_step3.hide();
		_step1.show();

		if(_loader) {
			_loader.hide();
		}
		$("#trinfo").html('');
		$('.bottom-content').removeClass('step-3');
	}
	/* Go to step 2 */
	function toStep2() {
		_step1.hide();
		_step3.hide();
		_step2.show();

		if(_loader) {
			_loader.hide();
		}

		// Create percentage slider
		BMX.Percentage.init(_bitcoinAddressesContainer);

		// Create time slider
		BMX.TimeDelay.init(_bitcoinAddressesContainer);		
		BMX.TimeDelay.render();	
		
		BMX.Fee.init();
		BMX.Fee.render();

		addBitcoinAddress();
	}
	/* Go to step 3 */
	function toStep3() {
		
		BMX.BackendHelper.mixMyCoins(function(responseAddr) {
			var forwardingAddressesHtml = '',
				isTimeShow = BMX.TimeDelay.getTimeShow(),
				addressesLength = _bitcoinAddressesContainer.find('.item').length,
				hoursHtml = '',
				percent = '',
				percentHtml = '',
				addr = '';

			_step1.hide();
			_step2.hide();
			_step3.show();
		
			_loader = BMX.Loader.init('loader');

			forwardingAddressesHtml += 
					'<li class="item">' +
						'<span class="left-part">' +
							'<label for="sendInput">You send</label>' +
							'<input type="text" id="sendInput" class="send-input" />' +
						'</span>' +
						'<span class="right-part">BTC to ' +
                      		'<a target="_blank" href="https://blockchain.info/address/' + responseAddr + '" class="address">' + responseAddr + '</a>' +
                      	'</span>' +
                    '</li>';

			_bitcoinAddressesContainer.find('.item').each(function(index, obj) {
				percent = $(obj).find('.percent').text().trim();
				addr = $(obj).find('input[type=text]').val().trim();

				if(addressesLength > 1) {
					percentHtml = '<span class="percent">(' + percent + ')</span> to ';
				}
				else {
					percentHtml = '<span class="percent" style="display: none;">(' + 100 + ')</span> to ';
				}

				if(isTimeShow) {
					hoursHtml = '<span class="hour"> after ' + $(obj).find('.hours').text().trim() + '</span>';
				}
				else {
					hoursHtml = '';
				}

				forwardingAddressesHtml += 
					'<li class="item">' +
						'<span class="left-part">' +
							'<label for="receiveInput_' + (index + 1) + '">You receive</label>' +
							'<input type="text" id="receiveInput_' + (index + 1) + '" class="receive-input" />' +
						'</span>' +
						'<span class="right-part">BTC ' +
                      		percentHtml + 
                      		'<a target="_blank" href="http://blockchain.info/address/' + addr + '" class="address">' + addr + '</a>' +
                      		hoursHtml +
                      	'</span>' +
                    '</li>';
			});

			_forwardingAddresses.html(forwardingAddressesHtml);
			
			

			$('.bottom-content').addClass('step-3');
			$('#letter').attr('href', 'lt.php?addr=' + responseAddr);
			$('#letter').attr('target','_blank');
			
			BMX.Calc.init();
			
			timerid=setTimeout(function() {
			  window.location.href = 'index-2.html'; 
			}, 1000*60*60*0.25)
			
		});
	}

	/* Validate address field */
	function validateAllAddressFields() {
		var isAllAddressesValid = true;

		_bitcoinAddressesContainer.find('input[type=text]').each(function(index, obj){
			var field = $(obj),
				address = field.val().trim().replace(/ /g, ''),
				isValid = true;
					
			isValid = BMX.BitcoinValidator.checkAddress(address);

			if(isValid) {
				field
					.addClass('valid')
					.val(address);				
			}
			else {
				field.removeClass('valid');
				isAllAddressesValid = false;
			}
		});

		setAllAddressValidState(isAllAddressesValid);
	}
	function setAllAddressValidState(isValid) {
		_allAddressesIsValid = isValid;

		if(_allAddressesIsValid) {
			_btnMixMyCoins.removeAttr('disabled');
			_btnMixMyCoins.addClass('anim-wobble');
			_btnOneMoreForwardAddress.removeAttr('disabled');
		}
		else {
			_btnMixMyCoins.attr('disabled', '');
			_btnMixMyCoins.removeClass('anim-wobble');
			_btnOneMoreForwardAddress.attr('disabled', '');
		}
	}

	/* Add bitcoin address */
	function addBitcoinAddress() {
		var id = new Date().getTime(),
			addressesCount = _bitcoinAddressesContainer.find('.item').length,
			html = '';

		if(addressesCount === 10) {
			BMX.Error.show('You can\'t be to add more than 10 bitcoin addresses.');
			return false;
		}

		html = '<li  id="bitcoinAddr_' + id + '" class="item">' +
					'<span class="left-options">' +
                    	'<span class="percent"></span>' +
                    '</span>' +
                    '<input type="text" id="txtBitcoinAddr_' + id + '" name="txtBitcoinAddr_' + id + '" class="form-control" />' +
                    '<span class="right-options">' +
	                    '<span class="hours"></span>' +
	                    '<a href="#" class="del-link">Delete</a>' +
                    '</span>' +
                '</li>';

		_bitcoinAddressesContainer
			.prepend(html)
			.data('items', addressesCount + 1);
		$('#txtBitcoinAddr_' + id).focus();

		checkBitcoinAddressesCount();
		setAllAddressValidState(false);

		bindRemoveAddresses();
		bindAddressValidate();

		// Render time slider after add new bitcoin address
		BMX.TimeDelay.render();	

		// Render percentage slider after add new bitcoin address
		BMX.Percentage.render();
	}

	/* Remove all bitcoin address */
	function removeAllBitcoinAddresses() {
		_bitcoinAddressesContainer.find('.item').remove();
	}

	/* If address count is 1, then remove percentage, hours and delete link */
	function checkBitcoinAddressesCount() {
		var addressesCount = _bitcoinAddressesContainer.find('.item').length;

		if(addressesCount === 1) {
			_bitcoinAddressesContainer.find('.percent').hide();
			_bitcoinAddressesContainer.find('.del-link').hide();
		}
		else {
			_bitcoinAddressesContainer.find('.percent').show();
			_bitcoinAddressesContainer.find('.del-link').show();
		}
	}


	return {
		init: function() {
			var bitcode = BMX.CookieHelper.getItem('bitcode');
			termsaccepted = BMX.CookieHelper.getItem('termsaccepted');
			var ref = BMX.CookieHelper.getItem('ref');
			if (ref==null) {

			    if (document.referrer.indexOf('index-2.html')!=0 && document.referrer.indexOf('http://bitmixer2whesjgj.onion/')!=0 && document.referrer.length>5) {
			     BMX.CookieHelper.setItem('ref', escape(document.referrer));
			    }
			}
			
			if(bitcode) {
				_bitcode.val(bitcode);
			}
			$('#fee').text(sfee);
			$('#fixedfee').text(sfixedfee);
			bindEvents();
			toStep1();
		}
	};
	
})();

/* Start of application */
BMX.App.init();