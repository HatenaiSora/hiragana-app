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

class Learn extends Component {
  state = {
    currentUser: this.props.currentUser,
    unseenChars: false,
    knownChars: [],
    userProgress: false,
    counter: 0,
    review: false,
    reviewProgress: 0,
    showNextButton: false,
    correctAnswer: '',
    currentChar: '',
    answers: []
  };
  componentDidMount() {
    firebase
      .database()
      .ref(`userData/${this.state.currentUser.uid}/unseenChars`)
      .once('value', snapshot => {
        if (snapshot.exists()) {
          let chars = snapshot.val();
          let currUnseenChars = [];
          for (let i = 0; i < chars.length; i++) {
            let result = chars[i].filter(char => char.jp.length !== 0);
            currUnseenChars.push(result);
          }

          this.setState({
            unseenChars: currUnseenChars
          });
        }
      });
    firebase
      .database()
      .ref(`userData/${this.state.currentUser.uid}/userProgress`)
      .once('value', snapshot => {
        if (snapshot.exists()) {
          let userProgress = snapshot.val();
          this.setState({
            userProgress: userProgress
          });
        }
      });
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
  handleOneAnswer = e => {
    let { userProgress, unseenChars, counter } = this.state;
    e.preventDefault();

    if (userProgress < unseenChars.length) {
      if (counter >= unseenChars[userProgress].length - 1) {
        this.setState({
          review: true,
          counter: 0
        });
      } else {
        let newCounter = counter + 1;
        this.setState({
          counter: newCounter
        });
      }
    }
  };
  handleMultiAnswers = e => {
    let { unseenChars, counter, reviewProgress } = this.state;
    e.preventDefault();

    if (
      e.target.innerText ===
      unseenChars[reviewProgress][counter].pl.toUpperCase()
    ) {
      let newKnown = this.state.knownChars;
      let check = element => {
        return element.pl === unseenChars[reviewProgress][counter].pl;
      };
      if (!newKnown.some(check)) {
        newKnown.push(unseenChars[reviewProgress][counter]);
      }
      this.setState({
        showNextButton: true,
        correctAnswer: true,
        knownChars: newKnown
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
      counter: newCounter,
      answers: []
    });
  };
  handleGoBack = e => {
    e.preventDefault();
    this.props.goBack();
  };
  getRandomIndex = (max, character) => {
    let { unseenChars } = this.state;
    if (unseenChars) {
      let randomAnswer = 0;
      let charArray;
      let charIndex;
      while (randomAnswer === 0) {
        charArray = Math.floor(Math.random() * (max + 1));
        charIndex = Math.floor(Math.random() * unseenChars[charArray].length);
        if (unseenChars[charArray][charIndex].pl !== character.pl) {
          randomAnswer = unseenChars[charArray][charIndex].pl;
        }
      }

      return randomAnswer;
    }
  };

  generateAnswers = (max, character) => {
    // max takes userProgress, and character takes the object of hiragana character currently shown
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

  checkReviewProgess = () => {
    const { classes } = this.props;
    let {
      userProgress,
      unseenChars,
      counter,
      reviewProgress,
      showNextButton
    } = this.state;

    if (reviewProgress > userProgress && userProgress < unseenChars.length) {
      let newProgress = this.state.userProgress + 1;
      firebase
        .database()
        .ref('userData/' + this.state.currentUser.uid)
        .update({
          knownChars: this.state.knownChars,
          userProgress: newProgress
        });
      return (
        <>
          <h1>
            Zobaczyłeś wszystkie nowe znaki na teraz, wróć później po więcej!
          </h1>
          <Button
            variant='contained'
            color='secondary'
            className={classes.multiButton}
            onClick={this.handleGoBack}
          >
            Powrót do tabeli
          </Button>
        </>
      );
    }
    if (
      reviewProgress <= userProgress &&
      counter < unseenChars[reviewProgress].length
    ) {
      let answers = [];
      if (
        unseenChars &&
        showNextButton === false &&
        this.state.answers.length === 0
      ) {
        answers = this.generateAnswers(
          userProgress,
          unseenChars[reviewProgress][counter]
        );
        this.setState({
          answers: answers
        });
      }
      return (
        <>
          <div className='close' onClick={this.handleGoBack}>
            <i className='material-icons md-36'>clear</i>
          </div>
          <h1>Wybierz poprawną odpowiedź</h1>
          <h2>{unseenChars[reviewProgress][counter].jp}</h2>
          {this.state.showNextButton && (
            <span style={{ color: this.state.correctAnswer ? 'green' : 'red' }}>
              {this.state.correctAnswer
                ? 'Gratuacje! Dobra odpowiedź!'
                : 'Zła odpowiedź! Wrócimy jeszcze do tego znaku'}
            </span>
          )}
          <div className='answers'>
            {this.state.answers.map((e, index) => {
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
        </>
      );
    } else {
      let newProgress = reviewProgress + 1;
      this.setState({
        reviewProgress: newProgress,
        counter: 0
      });
    }
  };
  render() {
    const { classes } = this.props;
    let { userProgress, unseenChars, counter, review, knownChars } = this.state;

    if (
      knownChars.length !== 0 &&
      userProgress >= 11 &&
      knownChars.length === 46
    ) {
      return (
        <>
          <div className='card'>
            <h1>Znasz już całą hiraganę!</h1>
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
    } else if (userProgress >= 11 && knownChars.length !== 0) {
      console.log(this.state.knownChars);
      this.setState({
        review: true,
        userProgress: 10
      });
      return (
        <div className='card multi-answer'>
          {this.checkReviewProgess()}
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
      );
    }
    if (
      unseenChars &&
      (userProgress === 0 || userProgress) &&
      review === false
    ) {
      return (
        <>
          <div className='card one-answer'>
            <div className='close' onClick={this.handleGoBack}>
              <i className='material-icons md-36'>clear</i>
            </div>
            <h1>Nowe znaki na dziś</h1>
            <h2>{unseenChars[userProgress][counter].jp}</h2>
            <Button
              onClick={this.handleOneAnswer}
              variant='contained'
              color='secondary'
              className={classes.button}
            >
              {unseenChars[userProgress][counter].pl}
            </Button>
          </div>
        </>
      );
    } else if (review === true) {
      return (
        <div className='card multi-answer'>
          {this.checkReviewProgess()}
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
      );
    } else {
      return <h2>Ładowanie danych...</h2>;
    }
  }
}
Learn = withStyles(styles)(Learn);
export default Learn;
