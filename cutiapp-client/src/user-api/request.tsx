import React from "react"
import fetch from 'isomorphic-unfetch'
import Router from 'next/router'
import { useAsync } from "react-async"

export const redirectOnError = (ctx: any) =>
  typeof window !== 'undefined'
    ? Router.push('/')
    : ctx.res.writeHead(302, { Location: '/'}).end()

// Load Users

export interface UsersFetchProps {
  token: string
  page: number
  nim: string
}

export const loadUsers = async ({ token, page, nim }: UsersFetchProps) => {
  const apiUrl = `https://rocky-mountain-69858.herokuapp.com/api/users/?page=${page}`
  const apiNim = `https://rocky-mountain-69858.herokuapp.com/api/users/${nim}`

  const url = nim === '' ? apiUrl : apiNim
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      Authorization: 'token ' + token
    }
  })

  return response.json()
}

export const Users: React.FC<UsersFetchProps> = ({ token, page, children }) => {
  const state = useAsync<{username: string}>({ promiseFn: loadUsers, token: token, page: page })
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
