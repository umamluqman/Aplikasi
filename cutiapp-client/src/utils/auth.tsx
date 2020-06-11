import { useEffect } from 'react'
import Router from 'next/router'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'

export const login = ({ token, user }) => {
  cookie.set('token', token, { expires: 1 })

  if (user.is_staff) {
    Router.push('/users')
  } else {
    Router.push('/user-dashboard')
  }
}

export const auth = ctx => {
  const { token } = nextCookie(ctx)

  if (!token) {
    if (typeof window === 'undefined') {
      ctx.res.writeHead(302, { location: '/'})
      ctx.res.end()
    } else {
      Router.push('/')
    }
  }

  return token
}

export const logout = async () => {
  const url = 'https://rocky-mountain-69858.herokuapp.com/api/auth/logout'
  const token = cookie.get('token')

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'token ' + token
      },
    })

    if (response.ok) {
      cookie.remove('token')
      window.localStorage.setItem('logout', Date.now().toString())
      Router.push('/')
    } else {
      Router.push('/')
    }
  } catch (error) {
    Router.push('/')
  }

  cookie.remove('token')
  window.localStorage.setItem('logout', Date.now().toString())
  Router.push('/')
}

export const withAuthSync = WrappedComponent => {
  const Wrapper = props => {
    const syncLogout = event => {
      if (event.key === 'logout') {
        console.log('logged out from storage!')
        Router.push('/')
      }
    }

    useEffect(() => {
      window.addEventListener('storage', syncLogout)

      return () => {
        window.removeEventListener('storage', syncLogout)
        window.localStorage.removeItem('logout')
      }
    }, [])

    return <WrappedComponent {...props} />
  }

  Wrapper.getInitialProps = async ctx => {
    const token = auth(ctx)

    const componentProps = WrappedComponent.getInitialProps &&
    (await WrappedComponent.getInitialProps(ctx))

    return { ...componentProps, token }
  }

  return Wrapper
}
