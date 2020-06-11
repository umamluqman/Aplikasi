import React from "react";
import { Grid, TextField, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import useForm from "react-hook-form";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const defaultValues = {
  username: "",
  password: ""
};

interface SignInProps {
  className?: string
  onSubmit: (data: typeof defaultValues) => Promise<void>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      height: "100vh"
    },
    grid: {
      height: "100%"
    },
    quoteContainer: {
      [theme.breakpoints.down("md")]: {
        display: "none"
      }
    },
    quote: {
      backgroundColor: theme.palette.background.paper,
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: "url(/bg.jpg)",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center"
    },
    quoteInner: {
      textAlign: "center",
      flexBasis: "600px",
      padding: theme.spacing(2)
    },
    quoteText: {
      color: theme.palette.text.secondary,
      fontWeight: 300
    },
    name: {
      marginTop: theme.spacing(3),
      color: theme.palette.text.secondary
    },
    bio: {
      color: theme.palette.text.secondary
    },
    content: {
      height: "100%",
      display: "flex",
      flexDirection: "column"
    },
    contentHeader: {
      display: "flex",
      alignItems: "center",
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    logoImage: {
      marginLeft: theme.spacing(4)
    },
    contentBody: {
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      [theme.breakpoints.down("md")]: {
        justifyContent: "center"
      }
    },
    form: {
      paddingLeft: 100,
      paddingRight: 100,
      paddingBottom: 125,
      flexBasis: 700,
      [theme.breakpoints.down("sm")]: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
      }
    },
    title: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3)
    },
    textField: {
      marginTop: theme.spacing(2)
    },
    signInButton: {
      margin: theme.spacing(2, 0)
    }
  })
);

const SignIn: React.SFC<SignInProps> = (props) => {
  const { onSubmit } = props

  const classes = useStyles({})

  const { register, handleSubmit } = useForm({
    defaultValues: defaultValues
  });

  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container>
        <Grid className={classes.quoteContainer} item lg={5}>
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography className={classes.quoteText} variant="h5">
                "Menjadi Fakultas Teknologi Informasi (FTI) yang unggul dibidang Teknik Informatika dan Sistem Informasi, yang mampu mencetak lulusan dengan keahlian profesional bidang komputer, berperan dalam perkembangan ilmu pengetahuan dan teknologi informasi dan menghasilkan solusi aplikatif bagi dunia usaha/industri yang mampu bersaing dalam tataran global pada tahun 2028"
              </Typography>
              <div>
                <Typography className={classes.name} variant="body2">
                  Visi FTI Unibba
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
        <Grid className={classes.content} item lg={7} xs={12}>
          <div className={classes.content}>
            <div className={classes.contentBody}>
              <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                <Typography className={classes.title} variant="h2">
                  Sign in
                </Typography>
                <TextField
                  label="Username"
                  name="username"
                  fullWidth
                  type="text"
                  variant="outlined"
                  inputRef={register({
                    required: "Required"
                  })}
                />
                <TextField
                  label="password"
                  type="password"
                  name="password"
                  margin="normal"
                  variant="outlined"
                  fullWidth
                  inputRef={register({
                    required: "Required"
                  })}
                />
                <Button
                  className={classes.signInButton}
                  color="primary"
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Sign in now
                </Button>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default SignIn;
