import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import { AccountDetails } from './components'
import { AccountType } from './components/AccountDetails/AccountDetails'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(4)
  }
}))

export interface AccountProps {
  className?: string
  onSubmit: (data: AccountType, setError: any) => Promise<void>
  defaultValues?: AccountType
  disabled: boolean
}

const Account = (props: AccountProps) => {
  const { disabled, onSubmit, defaultValues } = props

  const classes = useStyles({})

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          xs={12}
        >
          <AccountDetails
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default Account
