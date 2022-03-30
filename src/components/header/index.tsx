import React, { useEffect, useState, useMemo } from 'react'
import './style.scss'
import Avatar from '@/components/avatar'
import config from '@/config'
import { Layout, Badge, Popover, Empty } from 'antd'
import { Link } from 'react-router-dom'
import { HomeMainState } from '@/views/main/index'
import { useAppSelector } from '@/hooks'
// import { serviceGetInnerMessage } from '@/services'
import { fullscreen, exitFullscreen, logout } from '@/utils'
import {
  PoweroffOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellFilled,
  BugFilled,
  GithubOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined
} from '@ant-design/icons'

const { Header } = Layout
const popoverList = [
  { name: 'Personal center', path: '/home/setting/base' },
  { name: 'Notification', path: '/home/setting/notification' },
  { name: 'Account', path: '/home/setting/account' }
]

type Props = HomeMainState

const PopoverContent = (
  <div className="popover-content">
  {popoverList.map(el => (
    <Link to={el.path} key={el.name} className="ls">{el.name}</Link>
  ))}
    <div className="ls sign-out" onClick={logout}>
      <PoweroffOutlined style={{ fontSize: '14px', marginRight: '5px' }} />
      Logout
    </div>
  </div>
)

const HomeHeader: React.FC<Props> = function ({
  collapsed,
  setCollapsed,
}) {
  const [messageList, setMessageList] = useState([])
  const [unReadCount, setUnReadCount] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { userInfo } = useAppSelector(state => state.user)

  useEffect(() => {
 
  }, [])

  const MessageContent = useMemo(() => (
    <div className="message-popover">
      <div className="msg-header item-block">
        <span className="left">In-site message notification</span>
        <Link className="right" to="/home/setting/notification">Message reception management</Link>
      </div>
      {messageList.length > 0 ? (
        <>
          {messageList.map((item: any) => (
          <div className="item-block ls" key={item.id}>
            <div className="content">{item.content}</div>
            <div className="date">{item.createdAt}</div>
          </div>
        ))}
        <Link className="item-block ls" to="/home/setting/innerMessage">See more</Link>
        </>
      ) : (
        <Empty style={{ padding: '20px 0' }} />
      )}
    </div>
  ), [messageList])

  function handleFullscreen() {
    setIsFullscreen(isFullscreen => {
      isFullscreen ? exitFullscreen() : fullscreen()
      return !isFullscreen
    })
  }

  return (
    <Header>
      <div className="left">
        {collapsed ? (
          <MenuUnfoldOutlined
            onClick={setCollapsed}
            style={{ cursor: 'pointer', fontSize: '20px' }}
          />
        ) : (
          <MenuFoldOutlined
            onClick={setCollapsed}
            style={{ cursor: 'pointer', fontSize: '20px' }}
          />
        )}
      </div>
      <ul className="right">
        <Popover content={MessageContent}>
          <li>
            <Badge dot={unReadCount > 0}>
              <BellFilled />
            </Badge>
          </li>
        </Popover>
        <li onClick={handleFullscreen}>
          {isFullscreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
        </li>
        <Popover
          placement="bottomRight"
          content={PopoverContent}
        >
        <li>
          <Avatar src={userInfo.avatarUrl} />
          <span className="username">{userInfo.firstName}</span>
        </li>
        </Popover>
      </ul>
    </Header>
  )
}

export default HomeHeader
