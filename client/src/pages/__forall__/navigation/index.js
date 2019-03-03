// Import
// import Standard from './standard';
import Beautiful from './beautiful';

import runTheme from '../../../theme.runner';

// Theme runner // TODO: Settings switch
((marker = "design_style", _default = "LIGHT") => {
	const a = localStorage.getItem(marker);

	if(a) { // set
		runTheme(a);
	} else { // default
		runTheme(_default);

		localStorage.setItem(marker, _default);
	}
})("design_style", "LIGHT");

// Export
// export default Standard;
export default Beautiful;
