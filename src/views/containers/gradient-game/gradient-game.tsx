import React from 'react'
import { Card, Slider, Button, Modal } from 'antd'
import { random, TinyColor } from '@ctrl/tinycolor'

const styles = require('./gradient-game.styl')

function formatColor(color: TinyColor) {
  return `R: ${color.r} G:${color.g} B:${color.b}`
}

const colorDistance = (c1: TinyColor, c2: TinyColor) => {
  const rMean = (c1.r - c2.r) / 2
  const r = c1.r - c2.r
  const g = c1.g - c2.g
  const b = c1.b - c2.b

  return Math.sqrt((((512 + rMean) * r * r) >> 8) + 4 * g * g + (((767 - rMean) * b * b) >> 8))
}

function calcScore(target: string[], guess: string[]) {
  const [t1, t2] = target.map(one => new TinyColor(one))
  const [g1, g2] = guess.map(one => new TinyColor(one))
  const diff = colorDistance(t1, g1) + colorDistance(t2, g2)

  // return Math.floor(100 * (1 - diff / 1530))
  return Math.floor(100 * (1 - diff / (767 * 2)))
}

export class GradientGame extends React.PureComponent {

  state = {
    gradient: random({count: 2}).map(one => one.toHexString()),

    left: '#ffffff',
    right: '#000000',
  }

  renderControl(pos: 'left' | 'right') {
    const color = new TinyColor(
      pos === 'left' ? this.state.left : this.state.right
    )

    return (
      <div className={styles['control-panel']}>
        <h3>{formatColor(color)}</h3>
        <Card className={styles['control-card']}>
          <h3>Red</h3>
          <Slider min={0} max={255} onChange={this.handleChange(pos, 'r')} value={color.r} />
          <h3>Green</h3>
          <Slider min={0} max={255} onChange={this.handleChange(pos, 'g')} value={color.g} />
          <h3>Blue</h3>
          <Slider min={0} max={255} onChange={this.handleChange(pos, 'b')} value={color.b} />
        </Card>
      </div>
    )
  }

  render() {
    const { gradient, left, right } = this.state
    const bgGradient = `linear-gradient(to right, ${gradient[0]}, ${gradient[1]})`
    const userGradient = `linear-gradient(to right, ${left}, ${right})`

    return (
      <div className={styles['container']}>
        <h3>Match this gradient</h3>
        <div className={styles['block']} style={{background: bgGradient}} />

        <h3>Your Gradient</h3>
        <div className={styles['block']} style={{background: userGradient}} />

        <div className={styles['control']}>
          {this.renderControl('left')}
          {this.renderControl('right')}
        </div>

        <Button size={'large'} type='primary' shape='round' block={true} onClick={this.handleEvaluate}>
          Evaluate!
        </Button>
      </div>
    )
  }

  handleChange = (pos: 'left' | 'right', type: 'r'|'g'|'b') => (value: number) => {
    this.setState(state => {
      const color = new TinyColor(state[pos])
      color[type] = value
      return {
        [pos]: color.toHexString()
      }
    })
  }

  handleEvaluate = () => {
    const {gradient, left, right} = this.state
    const score = calcScore(gradient, [left, right])

    let title = ''
    if (score < 30) {
      title = 'Emmm...Maybe next time'
    } else if (score <= 60) {
      title = 'Need more pratice'
    } else if (score <= 80) {
      title = 'Not bad'
    } else if (score <= 90) {
      title = 'Feeling good'
    } else if (score < 100) {
      title = 'Aha! You almost had it!'
    } else {
      title = 'Congratulations! You did it!'
    }
    const content = (
      <div className={styles['result']}>
        <p><b>{score}</b> points out of 100.</p>
        <br/>
        <p>Target gradient:</p>
        <p>Left gradient: {formatColor(new TinyColor(gradient[0]))}</p>
        <p>Right gradient: {formatColor(new TinyColor(gradient[1]))}</p>
        <br/>
        <p>Your gradient:</p>
        <p>Left gradient: {formatColor(new TinyColor(left))}</p>
        <p>Right gradient: {formatColor(new TinyColor(right))}</p>
      </div>
    )

    return (score <= 80 ? Modal.info : Modal.success)({
      title,
      content,
    })
  }
}
