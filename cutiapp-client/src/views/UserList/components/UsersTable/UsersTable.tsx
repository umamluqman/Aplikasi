import React, { useContext, useState } from 'react'
import clsx from 'clsx'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { UsersContext } from 'pages/users'
import fetch from 'isomorphic-unfetch'
import cookie from 'js-cookie'
import {makeStyles } from '@material-ui/core/styles'
import {
  Card,
  CardContent,
  CardActions,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination
} from '@material-ui/core'
import moment from 'moment'
import Skeleton from '@material-ui/lab/Skeleton'
import TableToolbar from '../TableToolbar'
import { loadUsers } from 'src/user-api/request'
import Async from "react-async"


interface UserTableProps {
  className?: string
}

const useStyles = makeStyles(() => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1600
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}))


const UserTable: React.SFC<UserTableProps> = props => {
  const { className ,...rest } = props
  const { gstate, dispatch } = useContext(UsersContext)
  const token = cookie.get('token')
  const [page, setPage] = useState(1)

  const classes = useStyles({})

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>, data: any) => {
    if (event.target.checked) {
      const selectedUsers = data.results.map(user => user.nim)
      dispatch({ type: 'setSelectedUsers', users: selectedUsers})
    } else {
      dispatch({ type: 'setSelectedUsers', users: []})
    }
  }

  const handleSelectOne = (_, nim: string) => {
    const selectedIndex = gstate.selectedUsers.indexOf(nim)
    let newSelectedUsers = []

    if (selectedIndex === -1) {
      newSelectedUsers = newSelectedUsers.concat(gstate.selectedUsers, nim)
    } else if (selectedIndex === 0) {
      newSelectedUsers = newSelectedUsers.concat(gstate.selectedUsers.slice(1))
    } else if (selectedIndex > 0) {
      newSelectedUsers = newSelectedUsers.concat(
        gstate.selectedUsers.slice(0, selectedIndex),
        gstate.selectedUsers.slice(selectedIndex + 1)
      )
    }

    dispatch({ type: 'setSelectedUsers', users: newSelectedUsers})
  }

  const handlePageChange = (_event: Object, page: number) => {
    dispatch({ type: 'setSelectedUsers', users: []})
    setPage(page + 1)
  }

  const handleDelete = async (reload: any) => {

    if (gstate.selectedUsers.length === 1) {
      const url = `https://rocky-mountain-69858.herokuapp.com/api/users/${gstate.selectedUsers[0]}`
      const token = cookie.get('token')
      try {
        const response = await fetch(url, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            Authorization: 'token ' + token
          }
        })

        if (response.ok) {
          dispatch({ type: 'setNotif', notif: {
            open: true,
            message: `success delete user nim ${gstate.selectedUsers[0]}`,
            variant: 'success'
          }})
          dispatch({ type: 'setSelectedUsers', users: []})
          setPage(1)
          reload()
        } else {
          dispatch({ type: 'setNotif', notif: {
            open: true,
            message: `error delete user nim ${gstate.selectedUsers[0]}`,
            variant: 'error'
          }})
        }
      } catch (error) {
        dispatch({ type: 'setNotif', notif: {
          open: true,
          message: error.message,
          variant: 'error'
        }})
      }
    }

    if (gstate.selectedUsers.length > 1) {
      const url = 'https://rocky-mountain-69858.herokuapp.com/api/bulk-delete-user'
      const token = cookie.get('token')
      try {
        const response = await fetch(url, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'token ' + token
          },
          body: JSON.stringify(gstate.selectedUsers)
        })

        if (response.ok) {
          dispatch({ type: 'setNotif', notif: {
            open: true,
            message: 'success delete users',
            variant: 'success'
          }})
          dispatch({ type: 'setSelectedUsers', users: []})
          setPage(1)
          reload()
        } else {
          dispatch({ type: 'setNotif', notif: {
            open: true,
            message: 'error delete users',
            variant: 'error'
          }})
        }
      } catch (error) {
        dispatch({ type: 'setNotif', notif: {
          open: true,
          message: error.message,
          variant: 'error'
        }})
      }
    }
  }

  return (
    <Async
      promiseFn={loadUsers}
      token={token}
      page={page}
      nim={gstate.userWhoFind}
      watch={gstate.userWhoFind !== '' ? gstate.userWhoFind : page}
    >
    {({ isPending, error, data, reload }: {isPending: boolean, error: Error, data: any, run: () => void, reload: () => void})=> {
      if (isPending) {
        return (<Skeleton variant="rect" width={'100%'} height={320} />)
      }
      else if (error) {
        return (<h2>Failed Fetch</h2>)
      }
      else if (!error) {
        return (
        <Card
          {...rest}
          className={clsx(classes.root, className)}
        >
          <CardContent className={classes.content}>
            <TableToolbar selected={gstate.selectedUsers} handleDelete={() => handleDelete(reload)} />
            <PerfectScrollbar>
              <div className={classes.inner}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={gstate.selectedUsers.length === data.results.length}
                          disabled={data.results.length === 0}
                          color="primary"
                          indeterminate={
                            gstate.selectedUsers.length > 0 &&
                            gstate.selectedUsers.length < data.results.length
                          }
                          onChange={event => handleSelectAll(event, data)}
                        />
                      </TableCell>
                      <TableCell>NIM</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Nama</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Tempat Lahir</TableCell>
                      <TableCell>Tanggal Lahir</TableCell>
                      <TableCell>Jenis Kelamin</TableCell>
                      <TableCell>Agama</TableCell>
                      <TableCell>Jurusan</TableCell>
                      <TableCell>Tahun Masuk</TableCell>
                      <TableCell>Semester</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                      {
                        data.results.length === 0
                          ? (
                            <TableRow>
                              <TableCell colSpan={11}>
                                No Data
                              </TableCell>
                            </TableRow>
                          )
                          : data.results.map(user => (
                          <TableRow
                            hover
                            key={user.nim}
                            selected={gstate.selectedUsers.indexOf(user.nim) !== -1}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={gstate.selectedUsers.indexOf(user.nim) !== -1}
                                color="primary"
                                onChange={event => handleSelectOne(event, user.nim)}
                                value="true"
                              />
                            </TableCell>
                            <TableCell>{user.nim}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.nama}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.tempat_lahir}</TableCell>
                            <TableCell>{moment(user.tanggal_lahir).format('DD-MM-YYYY')}</TableCell>
                            <TableCell>{user.jenis_kelamin}</TableCell>
                            <TableCell>{user.agama}</TableCell>
                            <TableCell>{user.jurusan}</TableCell>
                            <TableCell>{user.tahun_masuk}</TableCell>
                            <TableCell>{user.semester}</TableCell>
                          </TableRow>
                        ))
                      }
                  </TableBody>
                </Table>
              </div>
            </PerfectScrollbar>
          </CardContent>
          <CardActions className={classes.actions}>
            <TablePagination
              component="div"
              count={data.count}
              onChangePage={handlePageChange}
              page={page - 1}
              rowsPerPageOptions={[]}
              rowsPerPage={10}
            />
          </CardActions>
        </Card>
      )

      } else {
        return null
      }
    }}
    </Async>
  )
}

export default UserTable
