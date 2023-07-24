module.exports = function () {
	throw new Error(this.getOptions().message);
};
