/* tslint:disable:jsx-no-multiline-js */

import {
  Form,
  Input,
  Button,
  Icon,
  Row,
  Col,
  message,
  Upload,
  Divider,
} from 'antd'
import {
  FormComponentProps,
  GetFieldDecoratorOptions,
} from 'antd/lib/form/Form'
import { UploadChangeParam } from 'antd/lib/upload'
import pickBy from 'lodash/pickBy'
import * as React from 'react'

import { getBase64 } from '@/utilities'
import { User } from '@/types'

const FormItem = Form.Item
// const styles = require('./profile.styl')

interface Props extends FormComponentProps {
  user: User

  updateUserInfo: (payload: Partial<User>) => void
}

interface State {
  loading: boolean
  avatarUrl: string
}

interface FieldOptions {
  label: string
  iconType: string
  span?: number
  decorators?: GetFieldDecoratorOptions
}

class Profile extends React.PureComponent<Props> {
  state: State = {
    loading: false,
    avatarUrl: '',
  }

  renderNormailField(type: string, options: FieldOptions) {
    const { getFieldDecorator } = this.props.form
    const { user } = this.props

    const field = getFieldDecorator(type, {
      initialValue: (user && user[type]) || '',
      ...options.decorators,
    })(<Input prefix={<Icon type={options.iconType} />} />)

    return (
      <Col sm={24} md={options.span || 12}>
        <FormItem label={options.label}>{field}</FormItem>
      </Col>
    )
  }

  renderAvatarField = () => {
    const { loading, avatarUrl } = this.state

    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <p>Upload</p>
      </div>
    )

    return (
      <Upload
        name="avatar"
        listType="picture-card"
        showUploadList={false}
        action={'//jsonplaceholder.typicode.com/posts/'}
        beforeUpload={this.beforeUpload}
        onChange={this.handleAvatarChange}
      >
        {avatarUrl ? <img src={avatarUrl} alt="avatar" /> : uploadButton}
      </Upload>
    )
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { user } = this.props

    const locationField = getFieldDecorator('location', {
      initialValue: (user && user.location) || '',
    })(<Input prefix={<Icon type="environment" />} />)
    // const avatarField = getFieldDecorator('avatar')(this.renderAvatarField())

    return (
      <Form onSubmit={this.handleUpdateProfile}>
        <Divider orientation="left">About Me</Divider>
        <Row>
          {/* <Col span={ 8 }>
            { avatarField }
          </Col> */}
          <Col span={16}>
            <FormItem label="Location">{locationField}</FormItem>
          </Col>
        </Row>

        <Divider orientation="left">Contact Info</Divider>
        <Row gutter={32}>
          {/* { this.renderNormailField('contact', {
            label: 'Contact Mail',
            iconType: 'mail',
            decorators: { rules: [ { type: 'email', message: 'The email address is not valid.' } ] }
          }) } */}

          {this.renderNormailField('instagram', {
            label: 'Instagram',
            iconType: 'instagram',
          })}

          {this.renderNormailField('twitter', {
            label: 'Twitter',
            iconType: 'twitter',
          })}

          {this.renderNormailField('behance', {
            label: 'Behance',
            iconType: 'behance',
          })}

          {this.renderNormailField('dribbble', {
            label: 'Dribbble',
            iconType: 'dribbble',
          })}

          {this.renderNormailField('website', {
            label: 'Website',
            iconType: 'link',
            decorators: {
              rules: [{ type: 'url', message: 'The url is not valid.' }],
            },
          })}
        </Row>

        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" size="large" htmlType="submit">
              Update Profile
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }

  private handleAvatarChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      // todo
      // get this url from response
      getBase64(info.file.originFileObj!, (avatarUrl: string) =>
        this.setState({
          avatarUrl,
          loading: false,
        }),
      )
    }
  }

  private beforeUpload = (file: File) => {
    const allowedFormats = ['image/jpeg', 'image/png']
    const isValidType = allowedFormats.includes(file.type)

    if (!isValidType) {
      message.error('You can only upload JPG/PNG file!')
    }

    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }

    return isValidType && isLt2M
  }

  private handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.updateUserInfo(pickBy(values))
      }
    })
  }
}

export const ProfileForm = Form.create()(Profile)
