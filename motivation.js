Module.regsister("motivation", {
    defaults: {
		quotes: [],
		remoteFile: 'quotes.json',
        updateInterval: 30000,
		fadeSpeed: 4000,
		random: true
	},
    lastIndexUsed:-1,
    /* start()
	 * Start the module.
	 *
	 * sets the interval of the quotes
	 */
	start: function() {
		Log.info("Starting module: " + this.name);

		this.lastQuoteIndex = -1;

		var self = this;
		
		if (this.config.remoteFile !== null) {
			this.quoteFile(function(response) {
				self.config.quotes = JSON.parse(response);
				self.updateDom();
			});
		}

		setInterval(function() {
			self.updateDom(self.config.fadeSpeed);
		}, this.config.updateInterval);
	},
    /* randomIndex(quotes)
	 * Generate a random index for a list of quotes.
	 *
	 * argument quotes Array<String> - Array with quotes.
	 *
	 * return Number - Random index.
	 */
	randomIndex: function(quotes) {
		if (quotes.length === 1) {
			return 0;
		}

		var generate = function() {
			return Math.floor(Math.random() * quotes.length);
		};

		var quoteIndex = generate();

		while (quoteIndex === this.lastQuoteIndex) {
			quoteIndex = generate();
		}

		this.lastQuoteIndex = quoteIndex;

		return quoteIndex;
	},

	/* quoteFile(callback)
	 * Retrieve a file from the local filesystem
	 */
	quoteFile: function(callback) {
		var xobj = new XMLHttpRequest(),
			isRemote = this.config.remoteFile.indexOf("http://") === 0 || this.config.remoteFile.indexOf("https://") === 0,
			path = isRemote ? this.config.remoteFile : this.file(this.config.remoteFile);
		xobj.overrideMimeType("application/json");
		xobj.open("GET", path, true);
		xobj.onreadystatechange = function() {
			if (xobj.readyState === 4 && xobj.status === 200) {
				callback(xobj.responseText);
			}
		};
		xobj.send(null);
	},

	/* quoteArray()
	 * Retrieve a random quote.
	 *
	 * return quote string - A quote.
	 */
	randomQuote: function() {
		var quotes = this.config.quotes;
		let index = 0;

		if(this.config.random){
			index = this.randomIndex(quotes);
		}
		else{
			index = (this.lastIndexUsed >= (quotes.length-1))?0: ++this.lastIndexUsed;
		}

		return quotes[index];
	},

	/* getDom()
	 * Inject a single quote.
	 *
	 * return DOM element - wrapper
	 */
	getDom: function() {
		var wrapper = document.createElement("div");
		var quote = document.createElement('span');
		quote.appendChild(document.createTextNode(this.randomQuote()));
		wrapper.appendChild(quote);

		return wrapper;
	}
});