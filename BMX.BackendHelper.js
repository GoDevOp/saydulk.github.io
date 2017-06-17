BMX.BackendHelper = (function() {

	/** Fields */
	var qrcode;
	var _bitcode = $('#bitcode'),
		_bottomBitcode = $('#bottomBitcode'),
		_maxAmount = $('#maxAmount'),
		_minAmount = $('#minAmount')
		_addr = $('#addr'),    
		_bitcoinAddressesContainer = $('#bitcoinAddressesContainer');
		

	/** Methods */

	function getServer(query) {
		var url="order.php?"+query;
		return $.ajax({
		  type: "GET",
		  url: url,
		  cache: false,
		  async: false
		}).responseText;
	}

	/* Make query for server call */
	function getQuery() {
		var $obj = null,
			bitcode = _bitcode.val().trim();
			addressesCount = _bitcoinAddressesContainer.find('.item').length,
			isTimeShow = BMX.TimeDelay.getTimeShow(),
			number = 0,
			query = '';

		_bitcoinAddressesContainer.find('.item').each(function(index, obj) {
			$obj = $(obj);
			number = index + 1;
			query += 'addr' + number + '=' + $obj.find('input[type=text]').val();
			query += '&pr' + number + '=' + $obj.find('.percent').text().replace('%', '');

			if(isTimeShow) {
				query += '&time' + number + '=' + $obj.find('.hours').text().replace('h', '');
			}

			if(number < addressesCount) { 
				query += '&';
			}
		});

		if(bitcode) {
			query += '&bitcode=' + bitcode;
		}
		query += '&fee' + '=' + servicefee;

		return query;
	}

	/* Parse server response to object */
	function parseResponse(response) {
		var result = {},
			responseParts = [],
			responsePart = [];

		response = decodeURI(response);
		responseParts = response.split('&');

		for(var i = 0, length = responseParts.length; i < length; i += 1) {
			responsePart = responseParts[i].split('=');

			if(responsePart.length === 2) {
				result[responsePart[0]] = responsePart[1];
			}
		}

		return result;
	}


	return {

		mixMyCoins: function(callback) {
			var query = getQuery(),
				response = parseResponse(getServer(query));

			if(response.error) {
				BMX.Error.show(response.error);
			}
			else {
				_bitcode.val(response.bitcode);
				_bottomBitcode.html(response.bitcode);
				_maxAmount.html(response.maxamount);
				_minAmount.html(sminimum);
				_addr.html(response.addr);
				
				if (typeof qrcode == "undefined") {
				   qrcode = new QRCode("qrcode", {
				      text: "bitcoin:"+response.addr,
				      width: 128,
				      height: 128,
				      colorDark : "#202040",
				      colorLight : "#ffffff",
				      correctLevel : QRCode.CorrectLevel.H
				  }); 
				} else
				{
				  qrcode.clear();
				  qrcode.makeCode("bitcoin:"+response.addr);
				}
				document.getElementById("qrcode").onclick = function() { window.location.href="bitcoin:"+response.addr; }
				
				//if(response.bitcode) {
				//	BMX.o.setItem('bitcode', response.bitcode);
				//}

				if(typeof callback === 'function') {
					callback(response.addr);
				}
			}
		}	
			
	};
	
})();
