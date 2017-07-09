/*
 * @Author: Gilles Coomans
 */

import pathToRegexp from 'path-to-regexp';
import htmlLexicon from 'htsl-lexicon';
htmlLexicon.addAtoms(['router']);
// @usage : h.router(location, compiledRoutes, ?props);

/**
 * compil a route-map
 * @example
 * const routes = compil({
 * 	'/my/:id/:page?': function(params, props){
 * 		return h.div('...');
 * 	},
 * 	...
 * });
 * @param  {Object} routes an object where keys are express-style route paths, 
 *                  and value are funciton handler that should return the "template" 
 *                  (the babelute sentence) used in matching case
 * @return {Array}   the compiled array of routes
 */
function compil(routes) {
	const arr = [];
	for (const path in routes) {
		const keys = [];
		arr.push({ keys, path, render: routes[path], pattern: pathToRegexp(path, keys) });
	}
	return arr;
}

function matchURI(route, uri) {
	const match = route.pattern.exec(uri);
	if (!match) return null;
	const params = Object.create(null);
	for (let i = 1; i < match.length; i++)
		params[route.keys[i - 1].name] = match[i] !== undefined ? match[i] : undefined;
	return params;
}

function matchRoute(location, routes) {
	let found = null;
	routes.some((route) => {
		const uri = location.error ? '/error' : location.pathname;
		const params = matchURI(route, uri);
		return params && (found = { route, params });
	});
	return found;
}

export default {
	compil,
	matchURI,
	matchRoute
};

