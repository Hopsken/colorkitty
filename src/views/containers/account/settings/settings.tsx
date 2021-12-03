import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form/Form'
import { Form, Input, Button, Icon, Row, Col, Divider, notification } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import { UpdateUserInfoPayload } from '@/services'

const FormItem = Form.Item
// const styles = require('./settings.styl')

interface Props extends FormComponentProps, RouteComponentProps<null> {
  updateUserInfo: (payload: UpdateUserInfoPayload) => void
}

class Settings extends React.PureComponent<Props> {

  renderResetPwd() {
    const { getFieldDecorator } = this.props.form

    const pwdField = getFieldDecorator('password', {
      rules: [
        {
          validator: this.validatePwd
        }
      ]
    })(<Input type='password' prefix={<Icon type='lock' />} />)
    const confirmField = getFieldDecorator('confirm', {
      rules: [
        {
          validator: this.comparePwd
        }
      ]
    })(<Input type='password' prefix={<Icon type='lock' />} />)

    return (
      <>
        <Divider orientation='left'>Change Password</Divider>
        <Row gutter={32}>
          <Col sm={24} md={12} >
            <FormItem label={'New Password'}>
              {pwdField}
            </FormItem>
          </Col>

          <Col sm={24} md={12} >
            <FormItem label={'Confirm Password'}>
              {confirmField}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button
              size='large'
              type='primary'
              htmlType='submit'
            >
              Change Password
            </Button>
          </Col>
        </Row>
      </>
    )
  }

  render() {

    return (
      <Form onSubmit={this.handleSubmit}>
        {this.renderResetPwd()}
      </Form>
    )
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err && values['password']) {
        this.props.updateUserInfo({
          password: values['password']
        })
        notification.success({
          message: 'Password Changed.',
          description: 'Successfully changed the password. Please login again.'
        })
        this.props.history.push('/')
      }
      this.props.form.resetFields()
    })
  }

  private validatePwd(_: any, value: any, callback: any) {
    const AZCheck = /[A-Z]/.test(value)
    const azCheck = /[a-z]/.test(value)
    const numCheck = /\d/.test(value)
    const lengthCheck = /^\w{8,26}$/.test(value)

    if (!lengthCheck) {
      callback('Password lenght should be between 8-26.')
    } else if (!AZCheck && !azCheck) {
      callback('Password should contain characters: A-Z, a-z.')
    } else if (!numCheck) {
      callback('Password should contain numbers.')
    } else {
      callback()
    }
  }

  private comparePwd = (_: any, value: any, callback: any) => {
    const { getFieldValue } = this.props.form

    if (value && getFieldValue('password') !== value) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }

}

export const SettingsForm = withRouter(Form.create()(Settings) as any)
