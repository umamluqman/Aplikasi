import { lighten, makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import { Toolbar, Typography, Tooltip, IconButton } from "@material-ui/core"
import DeleteIcon from '@material-ui/icons/Delete'
import clsx from "clsx"

interface TableToolbarProps {
  selected: Array<string>
  handleDelete: () => Promise<any>
}

const useTableToolbarStyle = makeStyles((theme: Theme) =>
createStyles({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}),
)

const TableToolbar = (props: TableToolbarProps) => {
  const { selected, handleDelete } = props
  const classes = useTableToolbarStyle({})

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: selected.length > 0,
      })}
    >
      {
        selected.length > 0
          ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1">
                  {selected.length} selected
                </Typography>
            )
          : (
              <Typography className={classes.title} variant="h6" id="tableTitle">
                Agenda
              </Typography>
            )
      }
      <>
      {
        selected.length > 0
          ? (
            <Tooltip title="Delete">
              <IconButton
                aria-label="delete"
                onClick={handleDelete}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )
          : undefined
      }
      </>
    </Toolbar>
  )
}

export default TableToolbar
