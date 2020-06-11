import React, { useState } from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme, Theme } from '@material-ui/core/styles'
import { useMediaQuery } from '@material-ui/core'

import { Sidebar, Topbar, Footer } from './components'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: 56,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: '100%'
  }
}))

export interface MainProps {
  name: string
  isStaf: boolean
}

const Main: React.SFC<MainProps> = props => {
  const { children, name, isStaf } = props

  const classes = useStyles({})
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  })

  const [openSidebar, setOpenSidebar] = useState(false)

  const handleSidebarOpen = () => {
    setOpenSidebar(true)
  }

  const handleSidebarClose = () => {
    setOpenSidebar(false)
  }

  const shouldOpenSidebar = isDesktop ? true : openSidebar

  return (
    <div
      className={
        clsx({
          [classes.root]: true,
          [classes.shiftContent]: isDesktop
        })
      }
    >
      <Topbar onSidebarOpen={handleSidebarOpen} />
      <Sidebar
        name={name}
        isStaf={isStaf}
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
      />
      <main className={classes.content}>
        {children}
        <Footer />
      </main>
    </div>
  )
}

export default Main
