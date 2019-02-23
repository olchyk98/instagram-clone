const cookieControl = {
	set: function (name, value, daysOut = 32, isObject = false) {
		let d = new Date();
		d.setTime(d.getTime() + (daysOut * 24 * 60 * 60 * 1000));
		let expires = "expires=" + d.toUTCString();
		document.cookie = name + "=" + ((!isObject) ? value : JSON.stringify(value)) + ";" + expires + ";path=/";
	},
	get: function (name) {
		const a = new RegExp(name + "=([^;]+)");
	    const b = a.exec(document.cookie);
	    return (b != null) ? unescape(b[1]) : null;
	},
	delete: function (name) {
		document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	},
	crashCookies: function() {
		// https://stackoverflow.com/questions/179355/clearing-all-cookies-with-javascript

		const cookies = document.cookie.split(";");

		for (var i = 0; i < cookies.length; i++) {
			const cookie = cookies[i];
			const eqPos = cookie.indexOf("=");
			const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		}
	}
}

function convertTime(time, addon = "", complete = true, refill = false) { // clf
	if(!time) return "";

	time = +time;
	time /= 1000;

	let a = (new Date()).getTime() / 1000,
			c = c1 => a - time < c1,
			d = Math.round;

	function comp() {
		let e = new Date(time * 1000),
			f = [
				"Jan",
				"Feb",
				"March",
				"Apr",
				"May",
				"June",
				"July",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Sep",
				"Oct",
				"Nov",
				"Dec"
			][e.getMonth()];
		return `${ f } ${ e.getDate() }, ${ e.getFullYear() } ${ e.getHours() }:${ e.getMinutes() }`
	}

	if(!refill) {
		if(c(60)) { // < minutes
			return d((a - time)) + "s" + ((addon && " " + addon) || "");
		} else if(c(3600)) { // < hours
			return d((a - time) / 60) + "m" + ((addon && " " + addon) || "");
		} else if(c(86400)) { // < days
			return d((a - time) / 3600) + "h" + ((addon && " " + addon) || "");
		} else if(c(604800)) { // < weeks
			return d((a - time) / 86400) + "d" + ((addon && " " + addon) || "");
		} else if(c(2419200)) { // < month
			return d((a - time) / 604800) + "w" + ((addon && " " + addon) || "");
		} else if(time < 0) { // tmp err?
			return "";
		} else if(complete) {
			return comp();
		} else {
			return "";
		}
	} else {
		let d = d => (d.toString().length === 1) ? "0" + d : d;

		// If less than day Then show hours:minutes Else show fulldate
		if(c(86400)) {
			let e = new Date(time * 1000);
			return `${ d(e.getHours()) }:${ d(e.getMinutes()) }`;
		} else {
			return comp();
		}
	}
}

module.exports = { cookieControl, convertTime }
