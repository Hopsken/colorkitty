module.exports = {
  plugins: [
    require('autoprefixer')({
      'browsers': [
        'ie >= 10',
        'last 10 Chrome version',
        'last 10 Firefox version',
        'last 2 Edge version',
        'Safari >= 8',
        'last 5 Opera version'
      ]
    })
  ]
}
