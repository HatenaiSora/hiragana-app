import React, { Component } from 'react';
import './App.scss';
import CssBaseline from '@material-ui/core/CssBaseline';
import LogInPage from './Components/LogInPage';
import WelcomePage from './Components/WelcomePage';
import firebase from './firebase';
import Learn from './Components/Learn';
import Review from './Components/Review';

class App extends Component {
  state = {
    isLoggedIn: false,
    learn: false,
    currentUser: null,
    review: false,
    knownChars: false
  };

  logIn = () => {
    this.setState({
      isLoggedIn: true,
      currentUser: firebase.auth().currentUser
    });
  };
  handleLearn = () => {
    this.setState({
      learn: true
    });
  };
  handleReview = () => {
    this.setState({
      review: true
    });
  };

  handleGoBack = () => {
    this.setState({
      learn: false,
      review: false
    });
  };

  render() {
    if (this.state.isLoggedIn === false) {
      return (
        <>
          <CssBaseline />
          <LogInPage logIn={this.logIn} currentUser={this.state.currentUser} />
        </>
      );
    } else if (
      this.state.isLoggedIn &&
      this.state.review === false &&
      this.state.learn === false
    ) {
      return (
        <>
          <CssBaseline />
          <WelcomePage
            learn={this.handleLearn}
            review={this.handleReview}
            currentUser={this.state.currentUser}
          />
        </>
      );
    } else if (this.state.review) {
      return (
        <>
          <CssBaseline />
          <Review
            currentUser={this.state.currentUser}
            goBack={this.handleGoBack}
          />
        </>
      );
    } else if (this.state.learn) {
      return (
        <>
          <CssBaseline />
          <Learn
            currentUser={this.state.currentUser}
            goBack={this.handleGoBack}
          />
        </>
      );
    }
  }
}

export default App;
