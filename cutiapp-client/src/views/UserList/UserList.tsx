import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { UsersTable, UsersToolbar } from './components'


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}))

const UserList: React.SFC = () => {
  const classes = useStyles({})

  return (
    <div className={classes.root}>
      <UsersToolbar />
      <div className={classes.content}>
        <UsersTable />
      </div>
    </div>
  )
}

export default UserList
