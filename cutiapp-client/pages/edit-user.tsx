import React, { useState, SyntheticEvent } from 'react'
import MainLayout from 'src/layouts/Main'
import Router from 'next/router'
import nextCookie from 'next-cookies'
import { Account } from 'src/views'
import { AccountType } from 'src/views/Account/components/AccountDetails/AccountDetails'
import { withAuthSync } from 'src/utils/auth'
import { CustomizedSnackbars } from 'src/components'
import { extractMessage } from 'src/utils/funcUtils'
import { redirectOnError } from 'src/user-api/request'

const EditUser = ({token, users, nim }) => {

  const [snackControl, setSnackControl] = useState({
    open: false,
    message: '',
    variant: 'success',
    disabled: false
  })

  const handleClose = (_event?: SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackControl({
      ...snackControl, open: false
    })
  }

  const onSubmit = async (data: AccountType, setError) => {
    setSnackControl({
      ...snackControl, disabled: true
    })
    try {
      const url = `https://rocky-mountain-69858.herokuapp.com/api/users/${nim}`
      const response = await fetch(
        url,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'token ' + token
          },
          body: JSON.stringify({...data})
        }
      )

      if (response.ok) {
        setSnackControl({
          open: true,
          disabled: false,
          message: `success edit user nim ${nim}`,
          variant: 'success'
        })
        setTimeout(() => Router.push('/users'), 2000)

      } else {
        const data = await response.json()
        setError(extractMessage(data))
        setSnackControl({
          ...snackControl,
          open: false
        })
      }
    } catch (error) {
      setSnackControl({
        open: true,
        disabled: false,
        message: error.message,
        variant: 'error'
      })
    }
  }

  return (
    <MainLayout
      name={users.nama}
      isStaf={users.is_staff}
    >
      <Account
        onSubmit={onSubmit}
        defaultValues={users}
        disabled={snackControl.disabled}
      />
      <CustomizedSnackbars
        open={snackControl.open}
        message={snackControl.message}
        variant={snackControl.variant as any}
        onClose={handleClose}
      />
    </MainLayout>
  )
}

EditUser.getInitialProps = async ctx => {
  const { token } = nextCookie(ctx)
  const { nim } = ctx.query

  if (!token) {
    return redirectOnError(ctx)
  }

  const apiUrl = `https://rocky-mountain-69858.herokuapp.com/api/users/${nim}`

  try {
    const response = await fetch(apiUrl, {
      credentials: 'include',
      headers: {
        Authorization: 'token ' + token
      }
    })

    if (response.ok) {
      const data = await response.json()
        return { token: token, users: data.results[0], nim: nim }
    } else {
      return redirectOnError(ctx)
    }
  } catch (error) {
    return redirectOnError(ctx)
  }
}

export default withAuthSync(EditUser)
