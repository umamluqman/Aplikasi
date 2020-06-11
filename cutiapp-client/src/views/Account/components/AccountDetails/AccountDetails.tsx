import React, { useState } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Divider,
  Button,
  TextField
} from '@material-ui/core'
import useForm from "react-hook-form"
import MomentUtils from "@date-io/moment"
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers"
import moment from 'moment'
import "moment/locale/id"

const defaultValues = {
  'nim': '',
  'nama': '',
  'username': '',
  'password': '',
  'email': '',
  'tempat_lahir': '',
  'tanggal_lahir': '',
  'jenis_kelamin': '',
  'agama': '',
  'jurusan': '',
  'tahun_masuk': '',
  'semester': '',
}

export type AccountType = typeof defaultValues

export interface AccountDetailsProps {
  className?: string
  onSubmit: (data: AccountType, setError: any, nim?: string) => Promise<void>
  defaultValues?: AccountType
  value?: string
  disabled: boolean
}

const jurusanOptions = [
  {"value": "IF", "label": "INFORMATIKA"},
  {"value": "SI", "label": "SISTEM INFORMASI"}
]

const jenisKelaminOptions = [
  {"value": "L", "label": "Laki-Laki"},
  {"value": "P", "label": "Perempuan"}
]

const agamaOptions = [
  {"value": "Islam", "label": "Islam"},
  {"value": "Kristen", "label": "Kristen"},
  {"value": "Budha", "label": "Budha"},
  {"value": "Hindu", "label": "Hindu"},
  {"value": "Konghucu", "label": "Konghucu"},
]

const useStyles = makeStyles(() => ({
  root: {}
}))

const AccountDetails: React.SFC<AccountDetailsProps> = props => {
  const { disabled, onSubmit, defaultValues: dp, className, ...rest } = props

  const classes = useStyles({})

  const [selectedDate, setSelectedDate] = useState<any>(
    dp ? moment(dp.tanggal_lahir) : moment()
  )

  const handleDateChange = (date: any) => {
    console.log('date from change', date)
    setSelectedDate(date)
  }

  const { register, handleSubmit, errors, setError } = useForm({
    defaultValues: dp ? dp : defaultValues
  })

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form
        autoComplete="off"
        onSubmit={
          handleSubmit(
            (data: any) => onSubmit(
              {...data, tanggal_lahir: selectedDate.format('YYYY-MM-DD')},
              setError
            )
          )
        }
        noValidate
      >
        <CardHeader
          title="Account"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="nim"
                name="nim"
                disabled={dp ? true: false}
                error={errors.nim !== undefined}
                helperText={errors.nim && errors.nim.message}
                inputRef={register({
                  required: "Required"
                })}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="nama"
                name="nama"
                error={errors.nama !== undefined}
                helperText={errors.nama && errors.nama.message}
                inputRef={register({
                  required: "Required"
                })}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="username"
                name="username"
                error={errors.username !== undefined}
                helperText={errors.username && errors.username.message}
                inputRef={register({
                  required: "Required"
                })}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="password"
                name="password"
                type="password"
                disabled={dp ? true : false}
                error={errors.password !== undefined}
                helperText={errors.password && errors.password.message}
                inputRef={dp ? undefined : register({
                  required: "Required"
                })}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="email"
                name="email"
                type="email"
                error={errors.email !== undefined}
                helperText={errors.email && errors.email.message}
                inputRef={register({
                  required: "Required"
                })}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="tempat lahir"
                name="tempat_lahir"
                error={errors.tempat_lahir !== undefined}
                helperText={errors.tempat_lahir && errors.tempat_lahir.message}
                inputRef={register({
                  required: "Required"
                })}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDatePicker
                  autoOk
                  fullWidth
                  variant="inline"
                  name={"tanggal_lahir"}
                  inputVariant="outlined"
                  label="tanggal_lahir"
                  format="DD/MM/YYYY"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="jenis kelamin"
                name="jenis_kelamin"
                error={errors.jenis_kelamin !== undefined}
                helperText={errors.jenis_kelamin && errors.jenis_kelamin.message}
                inputRef={register({
                  required: "Required"
                })}
                select
                SelectProps={{ native: true }}
                variant="outlined"
              >
                {jenisKelaminOptions.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                    defaultValue=""
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="agama"
                name="agama"
                error={errors.agama !== undefined}
                helperText={errors.agama && errors.agama.message}
                inputRef={register({
                  required: "Required"
                })}
                select
                SelectProps={{ native: true }}
                variant="outlined"
              >
                {agamaOptions.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                    defaultValue=""
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="jurusan"
                name="jurusan"
                error={errors.jurusan !== undefined}
                helperText={errors.jurusan && errors.jurusan.message}
                inputRef={register({
                  required: "Required"
                })}
                select
                SelectProps={{ native: true }}
                variant="outlined"
              >
                {jurusanOptions.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                    defaultValue=""
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="tahun masuk"
                name="tahun_masuk"
                type="number"
                error={errors.tahun_masuk !== undefined}
                helperText={errors.tahun_masuk && errors.tahun_masuk.message}
                inputRef={register({
                  required: "Required",
                })}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="semester"
                name="semester"
                type="number"
                error={errors.semester !== undefined}
                helperText={errors.semester && errors.semester.message}
                inputRef={register({
                  required: "Required"
                })}
                select
                SelectProps={{ native: true }}
                variant="outlined"
              >
                {[1,2,3,4,5,6,7,8].map(option => (
                  <option
                    key={option}
                    value={option}
                    defaultValue=""
                  >
                    {option}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={disabled}
          >
            Save
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default AccountDetails
