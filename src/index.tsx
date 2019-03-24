import { render } from 'react-dom'
import * as React from 'react'

import App from './App'

require('./global.styl')

render(<App />, document.getElementById('app'))
