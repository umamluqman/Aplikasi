import React, { useState, useContext } from 'react'
import clsx from 'clsx'
import Button from '@material-ui/core/Button'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { SearchInput } from 'src/components'
import useForm from 'react-hook-form'
import { AgendaContext } from 'pages/agenda'
import { Dialog, DialogTitle, DialogContentText, DialogContent, TextField, DialogActions } from '@material-ui/core'
import cookie from  'js-cookie'
import FileSaver from 'file-saver'
import moment from 'moment'


interface AgendaProps {
  className?: string
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  },
  dialog: {
    padding: theme.spacing(4)
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6)
  },
  button: {
    marginTop: theme.spacing(2)
  },
  title: {
    fontSize: 24
  }
}))

const Agenda: React.SFC<AgendaProps> = props => {
  const { className, ...rest } = props
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const { register, handleSubmit } = useForm()
  const { dispatch } = useContext(AgendaContext)

  const classes = useStyles({})

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onKeyDownHandle = (e) => {
    console.log(value)
    if (e.keyCode == 13) {
      dispatch({ type: 'setfindNoSurat', value: value})
    }
  }

  const onSubmit = async (data) => {
    const token = cookie.get('token')
    try {
      const url = 'https://rocky-mountain-69858.herokuapp.com/api/agenda-csv'
      const dataToSend = data['bulan'] === '' ? {'tahun': data['tahun']} : data
      const response = await fetch(
        url,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'token ' + token
          },
          body: JSON.stringify(dataToSend)
        }
      )
      if (response.ok) {
        const resData = await response.text()
        const blob = new Blob([resData], {type: "text/plain;charset=utf-8"})
        const fileName = data['bulan'] ? `${data['bulan']}-${data['tahun']}` : data['tahun']
        FileSaver.saveAs(blob, `${moment().format('DD-MM-YYYY').toString()}-agenda-${fileName}.csv`);
        setOpen(false)
      } else {
        dispatch({ type: 'setNotif', notif: {
          open: true,
          message: 'users not found.',
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


  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.row}>
        <span className={classes.spacer} />
        <Button
          className={classes.exportButton}
          onClick={handleOpen}
        >
          Export
        </Button>
      </div>
      <div className={classes.row}>
        <SearchInput
          type="number"
          className={classes.searchInput}
          placeholder="Search Agenda By No Surat"
          onChange={handleChange}
          onKeyDown={onKeyDownHandle}
        />
      </div>
      <Dialog
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        className={classes.dialog}
      >
        <DialogTitle className={classes.title}>
          Export Agenda
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill bulan and tahun or tahun that you want to export
          </DialogContentText>
          <form
            className={classes.form}
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <TextField
              fullWidth
              label="bulan"
              name="bulan"
              type="number"
              inputRef={register({})}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="tahun"
              name="tahun"
              type="number"
              className={classes.button}
              inputRef={register({
                required: "Required"
              })}
              variant="outlined"
            />
            <Button
              fullWidth
              size="large"
              color="primary"
              variant="contained"
              type="submit"
              className={classes.button}
            >
              Export
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Agenda
