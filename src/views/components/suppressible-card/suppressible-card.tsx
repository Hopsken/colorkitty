import * as React from 'react'
import { Icon, Card } from 'antd'
import { CardProps } from 'antd/lib/card'

interface State {
    visible: boolean
}

export class SuppressibleCard extends React.PureComponent<CardProps, State> {

    state = {
        visible: false
    }

    render() {
        const { visible } = this.state
        const icon = (<Icon
            type={visible ? 'eye' : 'eye-invisible'}
            onClick={this.toggleVisible}
        />)
        const bodyStyle = {
            ...this.props.bodyStyle,
            padding: visible ? 12 : 0
        }

        return (
            <Card {...this.props} bodyStyle={bodyStyle} extra={icon}>
                {visible ? this.props.children : null}
            </Card>
        )
    }

    toggleVisible = () => {
        this.setState({
            visible: !this.state.visible
        })
    }
}
