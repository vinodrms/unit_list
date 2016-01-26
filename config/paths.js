module.exports = {
	paths: {
		public: __dirname + ((!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? '/../assets' : '/../assets/dist')
	}
}