import React from 'react'
import clsx from 'clsx'
import { makeStyles, Theme} from '@material-ui/core/styles'
import { List, ListItem, Button, colors } from '@material-ui/core'
import PeopleIcon from '@material-ui/icons/People'
import DraftsIcon from '@material-ui/icons/Drafts'
import SettingsIcon from '@material-ui/icons/Settings'
import DashboardIcon from '@material-ui/icons/Dashboard'
import Router from 'next/router'

interface SidebarNavProps {
  className?: string
  isStaf: boolean
  name: string
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: colors.blueGrey[800],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: colors.blueGrey[500],
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main
    }
  }
}))

const pagesAdmin = [
  {
    'title': 'Users',
    'href' : '/users',
    'icon': <PeopleIcon />
  },
  {
    'title': 'Agenda',
    'href' : '/agenda',
    'icon': <DraftsIcon />
  },
  {
    'title': 'Setting',
    'href': '/setting',
    'icon': <SettingsIcon />
  }
]

const pagesUser = [
  {
    'title': 'Dashboard',
    'href' : '/user-dashboard',
    'icon': <DashboardIcon />
  },
  {
    'title': 'Setting',
    'href': '/setting',
    'icon': <SettingsIcon />
  }
]

const SidebarNav: React.SFC<SidebarNavProps> = props => {
  const { isStaf, className, ...rest } = props

  const classes = useStyles({})

  return (
    <List
      {...rest}
      className={clsx(classes.root, className)}
    >
      {
        isStaf
        ?
          pagesAdmin.map(page => (
            <ListItem
              className={classes.item}
              disableGutters
              key={page.title}
            >
              <Button
                className={classes.button}
                onClick={() => Router.push(page.href)}
              >
                <div className={classes.icon}>
                  {page.icon}
                </div>
                {page.title}
              </Button>
            </ListItem>
          ))
        :
          pagesUser.map(page => (
            <ListItem
              className={classes.item}
              disableGutters
              key={page.title}
            >
              <Button
                className={classes.button}
                onClick={() => Router.push(page.href)}
              >
                <div className={classes.icon}>
                  {page.icon}
                </div>
                {page.title}
              </Button>
            </ListItem>
          ))
      }
    </List>
  )
}

export default SidebarNav
