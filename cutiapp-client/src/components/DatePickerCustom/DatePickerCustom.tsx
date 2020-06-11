import React, { useState } from 'react'
import MomentUtils from "@date-io/moment"
import "moment/locale/id"

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import { Ref } from 'react-hook-form/dist/types'

export interface DatePickerCustomProps {
  id: string
  name: string
  inputRef: Ref
  value?: string
}

const DatePickerCustom: React.SFC<DatePickerCustomProps> = ({
  id,
  name,
  value,
  inputRef,
  ...props
}) => {

  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : new Date("")
  )

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  }

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <KeyboardDatePicker
        {...props}
        autoOk
        fullWidth
        variant="inline"
        id={id}
        name={name}
        inputVariant="outlined"
        label="tanggal_lahir"
        format="MM/DD/YYYY"
        value={selectedDate}
        onChange={handleDateChange}
        inputRef={inputRef}
      />
    </MuiPickersUtilsProvider>
  )
}

export default React.memo(DatePickerCustom)
