import React,{ useContext } from 'react'
import { makeStyles, Grid, Card, CardContent, CardActions, TextField, Divider, CardHeader, Button } from '@material-ui/core'
import { SettingContext } from 'pages/setting'
import moment from 'moment'
import cookie from 'js-cookie'
import useForm from "react-hook-form"
import { extractMessage } from 'src/utils/funcUtils'
import { ManualFieldError } from 'react-hook-form/dist/types'
import { logout } from 'src/utils/auth'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}))

const SettingView: React.FC = () => {
  const { dispatch, data } = useContext(SettingContext)
  const { register, handleSubmit, errors, setError } = useForm()
  const classes = useStyles({})

  const handleSubmitFunc = handleSubmit(async data => {
      const token = cookie.get('token')
      try {
        const url = `https://rocky-mountain-69858.herokuapp.com/api/update-password`
        const response = await fetch(
          url,
          {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'token ' + token
            },
            body: JSON.stringify({...data})
          }
        )

        if (response.ok) {
            logout()
        } else {
          const data = await response.json()
          const err = extractMessage(data)
          setError(err as ManualFieldError<Record<string, any>>[])
        }
      } catch (error) {
        dispatch({ type: 'setNotif', notif: {
          open: true,
          message: error.message,
          variant: 'error'
        }})
      }
    })

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        {
          !data.is_staff
          ?  (
              <Grid
              item
              lg={6}
              md={6}
              xl={6}
              xs={12}
              >
                <Card>
                  <CardHeader
                    subheader="User Details"
                    title="User"
                  />
                  <Divider />
                  <CardContent>
                    <TextField
                      disabled
                      fullWidth
                      label="Nim"
                      type="text"
                      value={data.nim}
                      variant="outlined"
                    />
                    <TextField
                      disabled
                      fullWidth
                      label="Nama"
                      type="text"
                      value={data.nama}
                      style={{ marginTop: '1rem' }}
                      variant="outlined"
                    />
                    <TextField
                      disabled
                      fullWidth
                      label="Username"
                      type="text"
                      value={data.username}
                      style={{ marginTop: '1rem' }}
                      variant="outlined"
                    />
                    <TextField
                      disabled
                      fullWidth
                      label="Email"
                      type="text"
                      value={data.email}
                      style={{ marginTop: '1rem' }}
                      variant="outlined"
                    />
                    <TextField
                      disabled
                      fullWidth
                      label="Tempat Lahir"
                      type="text"
                      value={data.tempat_lahir}
                      style={{ marginTop: '1rem' }}
                      variant="outlined"
                    />
                    <TextField
                      disabled
                      fullWidth
                      label="Tanggal Lahir"
                      type="text"
                      value={moment(data.tanggal_lahir).format('DD-MM-YYYY')}
                      style={{ marginTop: '1rem' }}
                      variant="outlined"
                    />
                    <TextField
                      disabled
                      fullWidth
                      label="Jenis Kelamin"
                      type="text"
                      value={data.jenis_kelamin}
                      style={{ marginTop: '1rem' }}
                      variant="outlined"
                    />
                    <TextField
                      disabled
                      fullWidth
                      label="Agama"
                      type="text"
                      value={data.agama}
                      style={{ marginTop: '1rem' }}
                      variant="outlined"
                    />
                    <TextField
                      disabled
                      fullWidth
                      label="Jurusan"
                      type="text"
                      value={data.jurusan}
                      style={{ marginTop: '1rem' }}
                      variant="outlined"
                    />
                    <TextField
                      disabled
                      fullWidth
                      label="Tahun Masuk"
                      type="text"
                      value={data.tahun_masuk}
                      style={{ marginTop: '1rem' }}
                      variant="outlined"
                    />
                    <TextField
                      disabled
                      fullWidth
                      label="Semester"
                      type="text"
                      value={data.semester}
                      style={{ marginTop: '1rem' }}
                      variant="outlined"
                    />
                  </CardContent>
                </Card>
              </Grid>
            )
          : null
        }
        <Grid
          item
          lg={6}
          md={6}
          xl={6}
          xs={12}
        >
          <Card>
            <form
            autoComplete="off"
              onSubmit={handleSubmitFunc}
            >
              <CardHeader
                subheader="Update password"
                title="Password"
              />
              <Divider />
              <CardContent>
                <TextField
                  fullWidth
                  label="Old password"
                  name="old_password"
                  type="password"
                  error={errors.old_password !== undefined}
                  inputRef={register({
                    required: "Required"
                  })}
                  helperText={errors.old_password && errors.old_password.message}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="New password"
                  name="new_password"
                  helperText={errors.new_password && errors.new_password.message}
                  style={{ marginTop: '1rem' }}
                  type="password"
                  error={errors.new_password !== undefined}
                  inputRef={register({
                    required: "Required"
                  })}
                  variant="outlined"
                />
              </CardContent>
              <Divider />
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Update
                </Button>
              </CardActions>
            </form>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default SettingView
