import React, { createContext, useReducer, SyntheticEvent } from 'react'
import MainLayout from 'src/layouts/Main'
import { NextPage } from 'next'
import { AgendaList } from 'src/views'
import { withAuthSync } from 'src/utils/auth'
import { CustomizedSnackbars } from 'src/components'
import nextCookie from 'next-cookies'
import { redirectOnError } from 'src/user-api/request'

export interface AgendaData {
  'no_surat': number,
  'tgl_surat': string,
  'jenis_surat': string,
  'user': {
      'nim': string,
      'nama': string,
      'jurusan': string,
      'tahun_masuk': number,
      'semester': number
  }
}

export interface AgendaPageProps {
  agenda: Response
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
  findNoSurat: '',
  selectedAgendas: [],
  page: 1
}

export type Action =
  | { type: 'setSelectedAgendas', agendas: Array<string>}
  | { type: 'setfindNoSurat', value: string}
  | { type: 'setPage', page: number }
  | { type: 'setNotif', notif: NotifControl}

export interface ContexJoin {
  gstate: typeof initialState
  dispatch?: React.Dispatch<Action>
}

export const AgendaContext = createContext<ContexJoin | undefined>(undefined)

const agendaReducer =  (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case 'setSelectedAgendas':
      return { ...state, selectedAgendas: action.agendas }
    case 'setfindNoSurat':
      return { ...state, findNoSurat: action.value}
    case 'setNotif':
      return { ...state, notif: action.notif}
    default:
      return state
  }
}

const AgendaPage: NextPage<AgendaPageProps> = ({ data }) => {
  const [state, dispatch] = useReducer(agendaReducer, initialState)
  const { open, message, variant } = state.notif

  const handleClose = (_event?: SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch({ type: 'setNotif', notif: { open: false, message: '', variant: state.notif.variant}})
  }

  return (
    <AgendaContext.Provider
      value={{
        gstate: state,
        dispatch: dispatch
      }}>
      <MainLayout
        name={data.nama}
        isStaf={data.is_staff}
      >
        <AgendaList />
        <CustomizedSnackbars
          open={open}
          message={message}
          variant={variant}
          onClose={handleClose}
        />
      </MainLayout>
    </AgendaContext.Provider>
  )
}

AgendaPage.getInitialProps = async ctx => {
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

export default withAuthSync(AgendaPage)
