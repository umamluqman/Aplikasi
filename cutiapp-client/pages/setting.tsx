import React, { useState, SyntheticEvent, createContext, useReducer } from 'react'
import MainLayout from 'src/layouts/Main'
// import Router from 'next/router'
import nextCookie from 'next-cookies'
import { SettingView } from 'src/views'
// import { AccountType } from 'src/views/Account/components/AccountDetails/AccountDetails'
import { withAuthSync } from 'src/utils/auth'
import { CustomizedSnackbars } from 'src/components'
// import { extractMessage } from 'src/utils/funcUtils'
import { redirectOnError } from 'src/user-api/request'
import { NextPage } from 'next'

export interface SettingProps {
  data: {
    "nim": string,
    "nama": string,
    "username": string,
    "email": string,
    "tempat_lahir": string,
    "tanggal_lahir": string,
    "jenis_kelamin": string,
    "agama": string,
    "jurusan": string,
    "tahun_masuk": string,
    "semester": string,
    "is_staff": boolean
}
}

export interface NotifControl {
  open: boolean,
  message: string,
  variant: 'success' | 'warning' | 'error' | 'info'
}

const initialState = {
  notif: {
    open: false,
    message: '',
    variant: 'success' as NotifControl['variant']
  }
}

export type Action =
  | { type: 'setNotif', notif: NotifControl}

export interface ContexProps {
  data: SettingProps['data'],
  gstate: typeof initialState
  dispatch?: React.Dispatch<Action>
}

export const SettingContext = createContext<ContexProps | undefined>(undefined)

const usersReducer =  (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case 'setNotif':
      return { ...state, notif: action.notif}
    default:
      return state
  }
}

const Setting: NextPage<SettingProps> = (props) => {
  const [state, dispatch] = useReducer(usersReducer, initialState)
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

  return (
    <SettingContext.Provider
      value={{
        data: props.data,
        gstate: state,
        dispatch: dispatch
      }}
    >
      <MainLayout
        name={props.data.nama}
        isStaf={props.data.is_staff}
      >
        <SettingView />
        <CustomizedSnackbars
          open={snackControl.open}
          message={snackControl.message}
          variant={snackControl.variant as any}
          onClose={handleClose}
        />
      </MainLayout>
    </SettingContext.Provider>
  )
}

Setting.getInitialProps = async ctx => {
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
      return { token: token, data: data}
    } else {
      return redirectOnError(ctx)
    }
  } catch (error) {
    return redirectOnError(ctx)
  }
}

export default withAuthSync(Setting)
