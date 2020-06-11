import React from 'react'
import clsx from 'clsx'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, Link } from '@material-ui/core'

interface FooterProps {
  className?: string
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(4)
  }
}))

const Footer: React.SFC<FooterProps> = (props) => {
  const { className, ...rest } = props

  const classes = useStyles({})

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Typography variant="body1">
        &copy;{' '}
        <Link
          component="a"
          href="https://devias.io/"
          target="_blank"
        >
          Fakultas Teknologi Informasi UNIBBA 2019
        </Link>
      </Typography>
    </div>
  )
}

export default Footer
