import React, { SyntheticEvent, useState } from 'react'
import MainLayout from 'src/layouts/Main'
import { withAuthSync } from 'src/utils/auth'
import { Account } from 'src/views'
import nextCookie from 'next-cookies'
import { AccountType } from 'src/views/Account/components/AccountDetails/AccountDetails'
import Router from 'next/router'
import { NextPage } from 'next'
import { CustomizedSnackbars } from 'src/components'
import { extractMessage } from 'src/utils/funcUtils'
import { redirectOnError } from 'src/user-api/request'

const AddUser: NextPage<{ token: string, data: any }> = (props) => {

  const { token, data } = props

  const [snackControl, setSnackControl] = useState({
    open: false,
    message: '',
    variant: 'success',
    disabled: false
  })

  const onSubmit = async (data: AccountType, setError: any) => {
    setSnackControl({
      ...snackControl, disabled: true
    })
    try {
      const url = 'https://rocky-mountain-69858.herokuapp.com/api/users/'
      const response = await fetch(
        url,
        {
          method: 'POST',
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
          message: `success add user`,
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

  const handleClose = (_event?: SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackControl({
      ...snackControl, open: false
    })
  }

  return (
    <MainLayout
      name={data.nama}
      isStaf={data.is_staff}
    >
      <Account onSubmit={onSubmit} disabled={snackControl.disabled}/>
      <CustomizedSnackbars
        open={snackControl.open}
        message={snackControl.message}
        variant={snackControl.variant as any}
        onClose={handleClose}
      />
    </MainLayout>
  )
}

AddUser.getInitialProps = async ctx => {
  const { token } = nextCookie(ctx)

  if (!token) {
    return redirectOnError(ctx)
  }

  const apiUrl = `https://rocky-mountain-69858.herokuapp.com/api/auth/user`

  try {
    const response = await fetch(apiUrl, {
      credentials: 'include',
      headers: {
        Authorization: 'token ' + token
      }
    })

    if (response.ok) {
      const data = await response.json()

      if (data.is_staff) {
        return { token: token, data: data }
      } else {
        return redirectOnError(ctx)
      }

    } else {
      return redirectOnError(ctx)
    }
  } catch (error) {
    return redirectOnError(ctx)
  }
}

export default withAuthSync(AddUser)
