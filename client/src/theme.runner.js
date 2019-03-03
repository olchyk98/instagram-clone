const themes = {
	"LIGHT": {
		"--__color-l-m25w": "rgba(255, 255, 255, .025)",
	    "--__color-l-m5w": "rgba(255, 255, 255, .05)",
	    "--__color-l-1w": "rgba(255, 255, 255, .1)",
	    "--__color-l-2w": "rgba(255, 255, 255, .2)",
	    "--__color-l-3w": "rgba(255, 255, 255, .3)",
	    "--__color-l-4w": "rgba(255, 255, 255, .4)",
	    "--__color-l-5w": "rgba(255, 255, 255, .5)",
	    "--__color-l-6w": "rgba(255, 255, 255, .6)",
	    "--__color-l-7w": "rgba(255, 255, 255, .7)",
	    "--__color-l-8w": "rgba(255, 255, 255, .8)",
	    "--__color-l-9w": "rgba(255, 255, 255, .9)",
	    "--__color-l": "white",
	    "--__color-d-m25w": "rgba(0, 0, 0, .025)",
	    "--__color-d-m5w": "rgba(0, 0, 0, .05)",
	    "--__color-d-1w": "rgba(0, 0, 0, .1)",
	    "--__color-d-2w": "rgba(0, 0, 0, .2)",
	    "--__color-d-3w": "rgba(0, 0, 0, .3)",
	    "--__color-d-4w": "rgba(0, 0, 0, .4)",
	    "--__color-d-5w": "rgba(0, 0, 0, .5)",
	    "--__color-d-6w": "rgba(0, 0, 0, .6)",
	    "--__color-d-7w": "rgba(0, 0, 0, .7)",
	    "--__color-d-8w": "rgba(0, 0, 0, .8)",
	    "--__color-d-9w": "rgba(0, 0, 0, .9)",
	    "--__color-d": "black",
	    "--__color-sdark": "#F3F3F3",
	    "--__color-searchlist": "white",
	    "--__color-fpostcol": "white",
	    "--__color-fpostauth": "rebeccapurple",
	    "--__color-messagecol": "#F4F4F4",
	    "--__color-messagecol-r": "#D3F3F6",
	    "--glbgcol": "#FAFAFA",
	    "--defaultborder": "rgba(0, 0, 0, .15)",
	    "--__color_special_-invert": "0%"
	},
	"DARK": {
		"--__color-l-m25w": "rgba(0, 0, 0, .025)",
	    "--__color-l-m5w": "rgba(0, 0, 0, .05)",
	    "--__color-l-1w": "rgba(0, 0, 0, .1)",
	    "--__color-l-2w": "rgba(0, 0, 0, .2)",
	    "--__color-l-3w": "rgba(0, 0, 0, .3)",
	    "--__color-l-4w": "rgba(0, 0, 0, .4)",
	    "--__color-l-5w": "rgba(0, 0, 0, .5)",
	    "--__color-l-6w": "rgba(0, 0, 0, .6)",
	    "--__color-l-7w": "rgba(0, 0, 0, .7)",
	    "--__color-l-8w": "rgba(0, 0, 0, .8)",
	    "--__color-l-9w": "rgba(0, 0, 0, .9)",
	    "--__color-l": "black",
	    "--__color-d-m25w": "rgba(255, 255, 255, .025)",
	    "--__color-d-m5w": "rgba(255, 255, 255, .05)",
	    "--__color-d-1w": "rgba(255, 255, 255, .1)",
	    "--__color-d-2w": "rgba(255, 255, 255, .2)",
	    "--__color-d-3w": "rgba(255, 255, 255, .3)",
	    "--__color-d-4w": "rgba(255, 255, 255, .4)",
	    "--__color-d-5w": "rgba(255, 255, 255, .5)",
	    "--__color-d-6w": "rgba(255, 255, 255, .6)",
	    "--__color-d-7w": "rgba(255, 255, 255, .7)",
	    "--__color-d-8w": "rgba(255, 255, 255, .8)",
	    "--__color-d-9w": "rgba(255, 255, 255, .9)",
	    "--__color-d": "white",
	    "--__color-sdark": "#2F2F2F",
	    "--__color-searchlist": "#2F2F2F",
	    "--__color-fpostcol": "#262626",
	    "--__color-fpostauth": "aqua",
	    "--__color-messagecol": "#2F2F2F",
	    "--__color-messagecol-r": "#454646",
	    "--glbgcol": "#1B1B1B",
	    "--defaultborder": "rgba(255, 255, 255, .15)",
	    "--__color_special_-invert": "100%"
	}
}

export default function run(a) {
	let b = themes[a];

	if(!b) b = themes["LIGHT"];

	Object.keys(b).forEach(io => {
		document.documentElement.style.setProperty(io, b[io]);
	});

	return true;
}