import React from "react"
import fetch from 'isomorphic-unfetch'
import { useAsync } from "react-async"

export interface AgendaPageProps {
  token: string
  page: number
  noSurat: string
}

export const loadAgendas = async ({ token, page, noSurat }: AgendaPageProps) => {
  const apiUrl = `https://rocky-mountain-69858.herokuapp.com/api/agenda/?page=${page}`
  const apiNoSurat = `https://rocky-mountain-69858.herokuapp.com/api/agenda/${noSurat}`

  const url = noSurat !== '' ? apiNoSurat : apiUrl
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      Authorization: 'token ' + token
    }
  })

  return response.json()
}

export const Agandas: React.FC<AgendaPageProps> = ({ token, page, children }) => {
  const state = useAsync<{username: string}>({ promiseFn: loadAgendas, token: token, page: page })
  return children &&  typeof children === 'function' && children(state)
}

// export const FUsers = ([page, token], _props, { signal }) =>
//   fetch(`https://rocky-mountain-69858.herokuapp.com/api/users/?page=${page}`, {
//     method: "GET",
//     headers: {
//       Authorization: 'token ' + token
//     },
//     signal
//   })
