import React, { createContext, useReducer, SyntheticEvent } from 'react'
import MainLayout from 'src/layouts/Main'
import { NextPage } from 'next'
import { UserList } from 'src/views'
import { withAuthSync } from 'src/utils/auth'
import { CustomizedSnackbars } from 'src/components'
import nextCookie from 'next-cookies'
import { redirectOnError } from 'src/user-api/request'

export interface UserData {
  nim: string,
  username: string,
  nama: string,
  email: string,
  tempat_lahir: string,
  tanggal_lahir: string,
  jenis_kelamin: string,
  agama: string,
  jurusan: string,
  tahun_masuk: number,
  semester: number
}

export interface UserPageProps {
    users: Response
    token: string
    data: any
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
  },
  selectedUsers: [],
  userWhoFind: "",
  page: 0
}

export interface ContexJoin {
  gstate: typeof initialState
  dispatch?: React.Dispatch<Action>
}

export type Action =
  | { type: 'setSelectedUsers', users: Array<string>}
  | { type: 'setPage', page: number }
  | { type: 'setNotif', notif: NotifControl}
  | { type: 'setUserWhoFind', value: string}


export const UsersContext = createContext<ContexJoin | undefined>(undefined)

const usersReducer =  (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case 'setSelectedUsers':
      return { ...state, selectedUsers: action.users }
    case 'setPage':
      return { ...state, page: action.page}
    case 'setNotif':
      return { ...state, notif: action.notif}
    case 'setUserWhoFind':
      return { ...state, userWhoFind: action.value}
    default:
      return state
  }
}

const UsersPage: NextPage<UserPageProps> = ({ data }) => {
  const [state, dispatch] = useReducer(usersReducer, initialState)
  const { open, message, variant } = state.notif

  const handleClose = (_event?: SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch({ type: 'setNotif', notif: { open: false, message: '', variant: state.notif.variant}})
  }

  return (
    <UsersContext.Provider
      value={{
        gstate: state,
        dispatch: dispatch
      }}>
      <MainLayout
        name={data.nama}
        isStaf={data.is_staff}
      >
        <UserList />
        <CustomizedSnackbars
          open={open}
          message={message}
          variant={variant}
          onClose={handleClose}
        />
      </MainLayout>
    </UsersContext.Provider>
  )
}

UsersPage.getInitialProps = async ctx => {
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
        return { data: data, token: token }
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

export default withAuthSync(UsersPage)
