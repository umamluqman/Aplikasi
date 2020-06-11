import React from 'react'
import clsx from 'clsx'
import { Divider, Drawer } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Profile, SidebarNav } from './components'

interface SidebarProps {
  open: boolean
  variant: 'permanent'| 'persistent' | 'temporary'
  onClose: () => void
  isStaf: boolean
  name: string
  className?: string
}

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}))

const Sidebar: React.SFC<SidebarProps> = props => {
  const { name, isStaf, open, variant, onClose, className, ...rest } = props

  const classes = useStyles({})

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Profile user={{ name: name, isStaf: isStaf}}/>
        <Divider className={classes.divider} />
        <SidebarNav
          name={name}
          isStaf={isStaf}
          className={classes.nav}
        />
      </div>
    </Drawer>
  )
}

export default Sidebar
