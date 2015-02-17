(function(m) {
	
	m.exports = function(mod, exporting, name) {
		if ( typeof mod === "object" && mod && typeof mod.exports === "object" ) {
			mod.exports = exporting;
		} else {
			if ( typeof define === "function" && define.amd ) {
				define( name, [], function () { return exporting; } );
			}
		}

		if ( typeof window === "object" && typeof window.document === "object" ) {
			window[name] = exporting;
		}
	};

})(module);