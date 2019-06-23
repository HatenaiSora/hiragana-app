import React, { Component } from 'react';
import '../App.scss';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import firebase from '../firebase';
import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import { ThemeProvider } from '@material-ui/styles';

function TabContainer(props) {
  return (
    <Typography component='div' style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const theme = createMuiTheme({
  palette: {
    primary: red
  }
});

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  button: {
    margin: theme.spacing(1),
    marginTop: '60px',
    width: 270,
    marginBottom: '100px',
    backgroundColor: 'red'
  },
  input: {
    display: 'none'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 270
  }
});

class LogInPage extends Component {
  state = {
    value: 0,
    email: '',
    password: '',
    isLoggedIn: false,
    currentUser: this.props.currentUser
  };

  handleChange = (event, newValue) => {
    this.setState({
      value: newValue
    });
  };
  handleEmail = e => {
    this.setState({
      email: e.target.value
    });
  };
  handlePass = e => {
    this.setState({
      password: e.target.value
    });
  };

  handleRegister = e => {
    e.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.props.logIn();
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  };
  handleLogin = e => {
    e.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.props.logIn();
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        <ThemeProvider theme={theme}>
          <div className='background' />
          <div className={classes.root}>
            <AppBar position='static'>
              <Tabs
                centered={true}
                value={this.state.value}
                onChange={this.handleChange}
              >
                <Tab label='Zaloguj się' />
                <Tab label='Zarejestruj się' />
              </Tabs>
            </AppBar>
            {this.state.value === 0 && (
              <TabContainer>
                <form className='login-form' onSubmit={this.handleLogin}>
                  <TextField
                    id='standard-with-placeholder'
                    label='Email'
                    className={classes.textField}
                    margin='normal'
                    value={this.state.email}
                    onChange={this.handleEmail}
                  />
                  <TextField
                    id='standard-password-input'
                    label='Hasło'
                    className={classes.textField}
                    type='password'
                    autoComplete='current-password'
                    margin='normal'
                    value={this.state.password}
                    onChange={this.handlePass}
                  />
                  <Button
                    variant='contained'
                    color='primary'
                    className={classes.button}
                    type='submit'
                  >
                    Zaloguj
                  </Button>
                </form>
              </TabContainer>
            )}
            {this.state.value === 1 && (
              <TabContainer>
                <form className='login-form' onSubmit={this.handleRegister}>
                  <TextField
                    id='standard-with-placeholder'
                    label='Email'
                    className={classes.textField}
                    margin='normal'
                    value={this.state.email}
                    onChange={this.handleEmail}
                  />
                  <TextField
                    id='standard-password-input'
                    label='Hasło'
                    className={classes.textField}
                    type='password'
                    autoComplete='current-password'
                    margin='normal'
                    value={this.state.password}
                    onChange={this.handlePass}
                  />
                  <Button
                    variant='contained'
                    color='primary'
                    className={classes.button}
                    type='submit'
                  >
                    Zarejestruj
                  </Button>
                </form>
              </TabContainer>
            )}
          </div>
        </ThemeProvider>
      </>
    );
  }
}
LogInPage = withStyles(styles)(LogInPage);

export default LogInPage;
