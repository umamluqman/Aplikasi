import React, { useState, useContext } from 'react'
import clsx from 'clsx'
import Router from 'next/router'
import Button from '@material-ui/core/Button'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { SearchInput } from 'src/components'
import { UsersContext } from 'pages/users'
import { Dialog, DialogTitle, DialogContentText, DialogContent, TextField, DialogActions } from '@material-ui/core'
import useForm from 'react-hook-form'
import cookie from  'js-cookie'
import FileSaver from 'file-saver'
import moment from 'moment'


interface UsersToolbarProps {
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

const UsersToolbar: React.SFC<UsersToolbarProps> = props => {
  const { className, ...rest } = props
  const [value, setValue] = useState("")
  const [open, setOpen] = useState(false)
  const { register, handleSubmit } = useForm()
  const { dispatch } = useContext(UsersContext)

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
    if (e.keyCode == 13) {
      dispatch({ type: 'setUserWhoFind', value: value})
    }
  }

  const onSubmit = async (data) => {
      const token = cookie.get('token')
      try {
        const url = 'https://rocky-mountain-69858.herokuapp.com/api/users-csv'
        const response = await fetch(
          url,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'token ' + token
            },
            body: JSON.stringify(data)
          }
        )
        if (response.ok) {
          const resData = await response.text()
          const blob = new Blob([resData], {type: "text/plain;charset=utf-8"});
          FileSaver.saveAs(blob, `${moment().format('DD-MM-YYYY').toString()}-users-${data['tahun_masuk']}.csv`);
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
        <Button
          color="primary"
          variant="contained"
          onClick={() => Router.push('/add-user')}
        >
          Add user
        </Button>
      </div>
      <div className={classes.row}>
        <SearchInput
          type="text"
          className={classes.searchInput}
          placeholder="Search User By NIM"
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
          Export Users
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill Tahun Masuk that you want to export
          </DialogContentText>
          <form
            className={classes.form}
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <TextField
              fullWidth
              label="tahun_masuk"
              name="tahun_masuk"
              type="number"
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

export default UsersToolbar
