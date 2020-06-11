import React, { useState, SyntheticEvent } from "react";
import { Minimal } from 'src/layouts'
import SignIn from 'src/views/SignIn'
import { login } from 'src/utils/auth'
import fetch from 'isomorphic-unfetch'
import { CustomizedSnackbars } from "src/components";

function SiginPage () {

  const [snackControl, setSnackControl] = useState({
    open: false,
    message: '',
    variant: 'success'
  })

  const handleClose = (_event?: SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackControl({
      ...snackControl, open: false
    })
  }

  const onSubmit = async (data: { username: string, password: string}) => {
    const url = 'https://rocky-mountain-69858.herokuapp.com/api/auth/login'

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: data.username, password: data.password}),
      })

      if (response.status === 200) {
        const { token, user } = await response.json()
        login({ token, user })
      } else {
        const data = await response.json()
        setSnackControl({
          open: true,
          message: data['non_field_errors'][0],
          variant: 'error'
        })
      }
    } catch (error) {
      setSnackControl({
        open: true,
        message: error.message,
        variant: 'error'
      })
    }
  }

  return (
    <Minimal>
      <SignIn onSubmit={onSubmit} />
      <CustomizedSnackbars
        open={snackControl.open}
        message={snackControl.message}
        variant={snackControl.variant as any}
        onClose={handleClose}
      />
    </Minimal>
  )
}

export default SiginPage
