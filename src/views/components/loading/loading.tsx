import * as React from 'react'

const styles = require('./loading.styl')

export class Loading extends React.PureComponent {

  render() {
    return (
      <div className={ styles['loading'] }>
        <div/><div/><div/>
      </div>
    )
  }
}
