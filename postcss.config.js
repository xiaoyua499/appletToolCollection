const postcssPx2rem = require('postcss-px2rem');

module.exports = {
  plugins: [
    postcssPx2rem({
      remUnit: 75,
    }),
  ],
};