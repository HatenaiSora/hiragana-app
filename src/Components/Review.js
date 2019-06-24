import React, { Component } from 'react';
import '../App.scss';
import firebase from '../firebase';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
    width: '50%'
  },
  multiButton: {
    margin: theme.spacing(1),
    width: '40%',
    marginBottom: '20px'
  }
});

class Review extends Component {
  state = {
    currentUser: this.props.currentUser,
    knownChars: false,
    counter: 0,
    showNextButton: false,
    correctAnswer: false
  };
  componentDidMount() {
    console.log(this.state.currentUser.uid);
    if (this.state.currentUser) {
      firebase
        .database()
        .ref(`userData/${this.state.currentUser.uid}/knownChars`)
        .once('value', snapshot => {
          if (snapshot.exists()) {
            let knownChars = snapshot.val();
            this.setState({
              knownChars: knownChars
            });
          }
        });
    }
  }
  handleMultiAnswers = e => {
    let { counter, knownChars } = this.state;
    e.preventDefault();
    if (e.target.innerText === knownChars[counter].pl.toUpperCase()) {
      this.setState({
        showNextButton: true,
        correctAnswer: true
      });
    } else {
      this.setState({
        showNextButton: true,
        correctAnswer: false
      });
    }
  };
  handleNext = e => {
    e.preventDefault();
    let newCounter = this.state.counter + 1;
    this.setState({
      showNextButton: false,
      counter: newCounter
    });
  };
  getRandomIndex = (max, character) => {
    let { knownChars } = this.state;
    if (knownChars) {
      let randomAnswer = 0;
      let charIndex;
      while (randomAnswer === 0) {
        charIndex = Math.floor(Math.random() * (max + 1));
        if (knownChars[charIndex].pl !== character.pl) {
          randomAnswer = knownChars[charIndex].pl;
        }
      }

      return randomAnswer;
    }
  };

  generateAnswers = (max, character) => {
    // max będzie przyjmować userProgress, a character obiekt wyświetlanej hiragany
    // nie powinny się generować jeszcze raz po kliknęciu w dobrą odpowiedź
    let answers = [0, 0, 0, 0];
    let randomIndex = Math.floor(Math.random() * answers.length);
    answers.splice(randomIndex, 1, character.pl);
    let randomAnswer;
    let potentialAnswer;
    for (let i = 0; i < answers.length; i++) {
      if (i !== randomIndex) {
        randomAnswer = 0;
        while (randomAnswer === 0) {
          potentialAnswer = this.getRandomIndex(max, character);
          if (answers.indexOf(potentialAnswer) === -1) {
            randomAnswer = potentialAnswer;
            answers.splice(i, 1, randomAnswer);
          }
        }
      }
    }
    return answers;
  };
  handleGoBack = e => {
    e.preventDefault();
    this.props.goBack();
  };
  render() {
    const { classes } = this.props;
    if (this.state.knownChars) {
      if (this.state.counter < this.state.knownChars.length) {
        return (
          <>
            <div className='card multi-answer'>
              <h1>Wybierz poprawną odpowiedź</h1>
              <h2>{this.state.knownChars[this.state.counter].jp}</h2>
              {this.state.showNextButton && (
                <span
                  style={{ color: this.state.correctAnswer ? 'green' : 'red' }}
                >
                  {this.state.correctAnswer
                    ? 'Gratuacje! Dobra odpowiedź!'
                    : 'Zła odpowiedź! Wrócimy jeszcze do tego znaku'}
                </span>
              )}
              <div className='answers'>
                {this.state.knownChars &&
                  this.generateAnswers(
                    this.state.knownChars.length - 1,
                    this.state.knownChars[this.state.counter]
                  ).map((e, index) => {
                    return (
                      <Button
                        variant='contained'
                        color='secondary'
                        className={classes.multiButton}
                        onClick={this.handleMultiAnswers}
                        key={index}
                      >
                        {e}
                      </Button>
                    );
                  })}
              </div>
              {this.state.showNextButton && (
                <Button
                  color='secondary'
                  variant='outlined'
                  className={classes.button}
                  onClick={this.handleNext}
                >
                  Następny znak >
                </Button>
              )}
            </div>
          </>
        );
      } else {
        return (
          <>
            <div className='card review'>
              <h1>Koniec powtórki!</h1>
              <h3>Naucz się nowych znaków lub zacznij powtórkę do początku</h3>
              <Button
                variant='contained'
                color='secondary'
                className={classes.multiButton}
                onClick={this.handleGoBack}
              >
                Powrót do tabeli
              </Button>
            </div>
          </>
        );
      }
    } else {
      console.log(this.state.knownChars);
      return <h1>Ładowanie danych...</h1>;
    }
  }
}
Review = withStyles(styles)(Review);
export default Review;
