import React from 'react'
import clsx from 'clsx'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import Avatar from 'react-avatar'

interface ProfileProps {
  className?: String,
  user: {
    name: string,
    isStaf: boolean
  }
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  name: {
    marginTop: theme.spacing(1)
  }
}))

const Profile: React.SFC<ProfileProps> = props => {
  const { className, user, ...rest } = props

  const classes = useStyles({})

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Avatar
        name={user.name}
        size="60"
        round
      />
      <Typography
        className={classes.name}
        variant="subtitle1"
      >
        {user.name}
      </Typography>
      <Typography
        variant="body2"
      >
        {user.isStaf ? "Admin" : "User"}
      </Typography>
    </div>
  )
}

export default Profile
