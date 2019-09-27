module.exports = {
	"parser": "@typescript-eslint/parser",
	"extends": [
		"xo-space/esnext",
		"plugin:@typescript-eslint/recommended",
		"prettier",
		"prettier/@typescript-eslint"
	],
	"plugins": [
		"@typescript-eslint",
		"prettier"
	],
	"rules": {
		"prettier/prettier": "error",
		"no-return-assign": 0, // Handy for 1 line higher order functions..
	},
	"env": {
		"jest": true,
		"node": true,
	}
}
