import React, { useContext, useState } from 'react'
import clsx from 'clsx'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { AgendaContext } from 'pages/agenda'
import fetch from 'isomorphic-unfetch'
import cookie from 'js-cookie'
import { makeStyles } from '@material-ui/core/styles'
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
}  from '@material-ui/core'
import moment from 'moment'
import Skeleton from '@material-ui/lab/Skeleton'
import { loadAgendas } from 'src/agenda-api/request'
import { Async } from 'react-async'
import TableToolbar from '../TableToolbar'

interface AgendaTableProps {
  className?: string
  agendas: Array<{
    id: number
    no_surat: string,
    tgl_surat: string,
    jenis_surat: string,
    keperluan: string,
    keterangan: string,
    user: {
      nim: string,
      nama: string,
      jurusan: string,
      tahun_masuk: number
    }
  }>
}

const useStyles = makeStyles(() => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}))

const AgendaTable: React.SFC<AgendaTableProps> = props => {
  const { className, agendas, ...rest} = props

  const classes = useStyles({})

  const { gstate, dispatch } = useContext(AgendaContext)
  const token = cookie.get('token')
  const [page, setPage] = useState(1)

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>, data: any) => {
    if (event.target.checked) {
      const selectedAgendas = data.results.map((agenda: any) => agenda.no_surat)
      dispatch({ type: 'setSelectedAgendas', agendas: selectedAgendas})
    } else {
      dispatch({ type: 'setSelectedAgendas', agendas: []})
    }
  }

  const handleSelectOne = (_, noSurat: number) => {
    const selectedIndex = gstate.selectedAgendas.indexOf(noSurat)
    let newSelectedAgendas = []

    if (selectedIndex === -1) {
      newSelectedAgendas = newSelectedAgendas.concat(gstate.selectedAgendas, noSurat)
    } else if (selectedIndex === 0) {
      newSelectedAgendas = newSelectedAgendas.concat(gstate.selectedAgendas.slice(1))
    } else if (selectedIndex > 0) {
      newSelectedAgendas = newSelectedAgendas.concat(
        gstate.selectedAgendas.slice(0, selectedIndex),
        gstate.selectedAgendas.slice(selectedIndex + 1)
      )
    }

    dispatch({ type: 'setSelectedAgendas', agendas: newSelectedAgendas})
  }

  const handlePageChange = (_event: Object, page: number) => {
    dispatch({ type: 'setSelectedAgendas', agendas: []})
    setPage(page + 1)
  }

  const handleDelete = async (reload: any) => {

    if (gstate.selectedAgendas.length === 1) {
      const url = `https://rocky-mountain-69858.herokuapp.com/api/agenda/${gstate.selectedAgendas[0]}`
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
          console.log('sucesssssss')
          dispatch({ type: 'setNotif', notif: {
            open: true,
            message: `success delete no surat ${gstate.selectedAgendas[0]}`,
            variant: 'success'
          }})
          dispatch({ type: 'setSelectedAgendas', agendas: []})
          setPage(1)
          reload()
        } else {
          dispatch({ type: 'setNotif', notif: {
            open: true,
            message: `error delete no surat ${gstate.selectedAgendas[0]}`,
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

    if (gstate.selectedAgendas.length > 1) {
      const url = 'https://rocky-mountain-69858.herokuapp.com/api/bulk-delete-agenda'
      const token = cookie.get('token')
      try {
        const response = await fetch(url, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'token ' + token
          },
          body: JSON.stringify(gstate.selectedAgendas)
        })

        if (response.ok) {
          dispatch({ type: 'setNotif', notif: {
            open: true,
            message: 'success delete surat',
            variant: 'success'
          }})
          dispatch({ type: 'setSelectedAgendas', agendas: []})
          setPage(1)
          reload()
        } else {
          dispatch({ type: 'setNotif', notif: {
            open: true,
            message: 'error delete surat',
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
      promiseFn={loadAgendas}
      token={token}
      page={page}
      noSurat={gstate.findNoSurat}
      watch={gstate.findNoSurat !==  '' ? gstate.findNoSurat : page}
    >
    {({ isPending, error, data, reload }: {isPending: boolean, error: Error, data: any, run: () => void, reload: () => void})=> {
      if (isPending) {
        return (<Skeleton variant="rect" width={'100%'} height={320} />)
      }
      else if (error) {
        return (<h2>Failed Fetch</h2>)
      }
      else if (!error) {
        console.log('data', gstate)
        return (
        <Card
          {...rest}
          className={clsx(classes.root, className)}
        >
          <CardContent className={classes.content}>
            <TableToolbar selected={gstate.selectedAgendas} handleDelete={() => handleDelete(reload)} />
            <PerfectScrollbar>
              <div className={classes.inner}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={gstate.selectedAgendas.length === data.results.length}
                          disabled={data.results.length === 0}
                          color="primary"
                          indeterminate={
                            gstate.selectedAgendas.length > 0 &&
                            gstate.selectedAgendas.length < data.results.length
                          }
                          onChange={event => handleSelectAll(event, data)}
                        />
                      </TableCell>
                      <TableCell>No Surat</TableCell>
                      <TableCell>Tgl Surat</TableCell>
                      <TableCell>Jenis Surat</TableCell>
                      <TableCell>NIM</TableCell>
                      <TableCell>Nama</TableCell>
                      <TableCell>Jurusan</TableCell>
                      <TableCell>Tahun Masuk</TableCell>
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
                          : data.results.map((agenda: any) => (
                            <TableRow
                              hover
                              key={agenda.noSurat}
                              selected={gstate.selectedAgendas.indexOf(agenda.no_surat) !== -1}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={gstate.selectedAgendas.indexOf(agenda.no_surat) !== -1}
                                  color="primary"
                                  onChange={event => handleSelectOne(event, agenda.no_surat)}
                                  value="true"
                                />
                              </TableCell>
                              <TableCell>{agenda.no_surat}</TableCell>
                              <TableCell>{moment(agenda.tgl_surat).format("DD-MM-YYYY")}</TableCell>
                              <TableCell>{agenda.jenis_surat}</TableCell>
                              <TableCell>{agenda.user.nim}</TableCell>
                              <TableCell>{agenda.user.nama}</TableCell>
                              <TableCell>{agenda.user.jurusan}</TableCell>
                              <TableCell>{agenda.user.tahun_masuk}</TableCell>
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
              count={!data.count ? -1 : data.count}
              onChangePage={handlePageChange}
              page={page - 1}
              rowsPerPageOptions={[]}
              rowsPerPage={10}
            />
          </CardActions>
        </Card>
      )

      }
      else {
        return null
      }
    }}
    </Async>
  )
}

export default AgendaTable
