import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import { UnibbaLogo } from 'src/icons'

interface TopbarProps {
  className?: string
}

const useStyles = makeStyles(() => ({
  root: {
    boxShadow: 'none'
  }
}))

const Topbar: React.SFC<TopbarProps> = props => {
  const { className, ...rest } = props

  const classes = useStyles({})

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
      color="primary"
      position="fixed"
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
      </Toolbar>
    </AppBar>
  )
}

export default Topbar
