import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'

import { AgendaTable, AgendaToolbar } from './components'


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}))

const agendas = [{
  id: 1,
  no_surat: 'XX012',
  tgl_surat: '12/12/2019',
  jenis_surat: 'Penting',
  keperluan: 'tak penting',
  keterangan: 'entahlah',
  user: {
    nim: "C1A120007",
    nama: "Zaenudin1",
    jurusan: "INFORMATIKA",
    tahun_masuk: 2014,
  }
},
{
  id: 2,
  no_surat: 'XX012',
  tgl_surat: '12/12/2019',
  jenis_surat: 'Penting',
  keperluan: 'tak penting',
  keterangan: 'entahlah',
  user: {
    nim: "C1A120007",
    nama: "Zaenudin1",
    jurusan: "INFORMATIKA",
    tahun_masuk: 2014,
  }
}]

const AgendaList: React.SFC = () => {
  const classes = useStyles({})

  return (
    <div className={classes.root}>
      <AgendaToolbar />
      <div className={classes.content}>
        <AgendaTable agendas={agendas} />
      </div>
    </div>
  )
}

export default AgendaList
