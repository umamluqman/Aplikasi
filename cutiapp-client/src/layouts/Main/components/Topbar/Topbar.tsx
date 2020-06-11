import React  from 'react'
import clsx from 'clsx'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { AppBar, Toolbar, Hidden, IconButton, Typography } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import InputIcon from '@material-ui/icons/Input'
import { UnibbaLogo } from 'src/icons'

import { logout } from 'src/utils/auth'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  }
}))

interface TopBarProps {
  className?: string
  onSidebarOpen: () => void
}

const Topbar = React.memo((props: TopBarProps) => {
  const { className, onSidebarOpen, ...rest } = props

  const classes = useStyles({})

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <UnibbaLogo />
        <Typography
          variant="h4"
          color="inherit"
          style={{ marginLeft: 8 }}
        >
          FTI UNIBBA
        </Typography>
        <div className={classes.flexGrow} />
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            onClick={logout}
          >
            <InputIcon />
          </IconButton>

        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>

      </Toolbar>
    </AppBar>
  )
})

export default Topbar
