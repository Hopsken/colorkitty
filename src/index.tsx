import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import * as React from 'react'

import App from './App'

require('./global.styl')

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('app')
)
