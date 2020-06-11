import React, { createContext, SyntheticEvent, useReducer } from 'react'
import MainLayout from 'src/layouts/Main'
import { NextPage } from 'next'
import { withAuthSync } from 'src/utils/auth'
import { CustomizedSnackbars } from 'src/components'
import nextCookie from 'next-cookies'
import { redirectOnError } from 'src/user-api/request'
import { CreateSurat } from 'src/views'


export interface UserDasboarProps {
  data: any
  token: string
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
  gstate: typeof initialState
  dispatch?: React.Dispatch<Action>
}

export const UsersDashboardContext = createContext<ContexProps | undefined>(undefined)

const usersReducer =  (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case 'setNotif':
      return { ...state, notif: action.notif}
    default:
      return state
  }
}

const UserDashboard: NextPage<UserDasboarProps> = ({ data }) => {
  const [state, dispatch] = useReducer(usersReducer, initialState)
  const { open, message, variant } = state.notif

  const handleClose = (_event?: SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch({ type: 'setNotif', notif: { open: false, message: '', variant: state.notif.variant}})
  }

  return (
    <UsersDashboardContext.Provider
      value={{
        gstate: state,
        dispatch: dispatch
      }}
    >
      <MainLayout
        name={data.nama}
        isStaf={data.is_staff}
      >
        <CreateSurat />
        <CustomizedSnackbars
          open={open}
          message={message}
          variant={variant}
          onClose={handleClose}
        />
      </MainLayout>
    </UsersDashboardContext.Provider>
  )
}

UserDashboard.getInitialProps = async ctx => {
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
        return redirectOnError(ctx)
      } else {
        return { data: data, token: token }
      }

    } else {
      return redirectOnError(ctx)
    }
  } catch (error) {
    return redirectOnError(ctx)
  }

}

export default withAuthSync(UserDashboard)
