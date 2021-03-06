import React from 'react'
import clsx from 'clsx'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Paper, Input } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'


interface SearchInputProps {
  className?: string;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void
  style?: React.CSSProperties
  placeholder?: string
  type: HTMLInputElement['type']
  onKeyDown: (e: any) => void
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    borderRadius: '4px',
    alignItems: 'center',
    padding: theme.spacing(1),
    display: 'flex',
    flexBasis: 420
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary
  },
  input: {
    flexGrow: 1,
    fontSize: '14px',
    lineHeight: '16px',
    letterSpacing: '-0.05px'
  }
}))

const SearchInput: React.SFC<SearchInputProps> = props => {
  const { type, onKeyDown, className, onChange, style, ...rest } = props

  const classes = useStyles({})

  return (
    <Paper
      {...rest}
      className={clsx(classes.root, className)}
      style={style}
    >
      <SearchIcon className={classes.icon} />
      <Input
        {...rest}
        className={classes.input}
        disableUnderline
        type={type}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </Paper>
  )
}

export default SearchInput
