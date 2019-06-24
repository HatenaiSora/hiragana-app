import React, { Component } from 'react';
import '../App.scss';
import { db } from '../firebase';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import firebase from '../firebase';

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
    width: '50%'
  }
});

class WelcomePage extends Component {
  state = {
    hiragana: false,
    currentUser: this.props.currentUser,
    currKnownChars: false
  };
  componentDidMount() {
    db.collection('hiragana2')
      .get()
      .then(query => {
        const data = [];
        query.forEach(e => {
          db.collection(`hiragana2/${e.id}/characters`)
            .get()
            .then(query => {
              const char = [];
              query.forEach(e => {
                char.push(e.data());
                if (char.length === 5) {
                  char.sort((a, b) => {
                    return a.order - b.order;
                  });
                  data.push(char);
                }
                data.sort((a, b) => {
                  return a.order - b.order;
                });
              });
              this.setState({
                hiragana: data
              });
            });
        });
        if (this.state.currentUser) {
          var userData = firebase.database().ref('userData/');
          userData.once('value', snapshot => {
            if (snapshot.hasChild(this.state.currentUser.uid)) {
              console.log('użytkownik istnieje!');
              firebase
                .database()
                .ref(`userData/${this.state.currentUser.uid}/knownChars`)
                .once('value', snapshot => {
                  if (snapshot.exists()) {
                    let currKnownChars = snapshot.val();
                    this.setState({
                      currKnownChars: currKnownChars
                    });
                  } else {
                    this.setState({
                      currKnownChars: null
                    });
                  }
                });
            } else {
              console.log('użytkownik dodany do bazy!');
              this.setState({
                currKnownChars: null
              });
              let knownChars = [];
              this.writeUserData(
                this.state.currentUser.uid,
                this.state.currentUser.email,
                [...this.state.hiragana],
                0,
                knownChars
              );
            }
          });
        }
      });
  }
  handleReview = e => {
    e.preventDefault();
    this.props.review();
  };
  handleLearn = e => {
    e.preventDefault();
    this.props.learn();
  };
  writeUserData(userId, email, unseenChars, userProgress, knownChars) {
    firebase
      .database()
      .ref('userData/' + userId)
      .set({
        email: email,
        unseenChars: unseenChars,
        userProgress: userProgress,
        knownChars: knownChars
      });
  }
  chceckKnown(hiraganaIndex) {
    let result = [];
    let element;
    const knownStyle = {
      backgroundColor: '#66bb6a'
    };
    if (this.state.hiragana[hiraganaIndex] && this.state.currKnownChars) {
      this.state.hiragana[hiraganaIndex].map(e => {
        for (let i = 0; i < this.state.currKnownChars.length; i++) {
          if (this.state.currKnownChars[i].order === e.order) {
            element = (
              <td style={knownStyle} key={e.order}>
                {e.jp}
              </td>
            );
            return result.push(element);
          } else {
            element = <td key={e.order}>{e.jp}</td>;
          }
        }
        return result.push(element);
      });
      return result;
    } else if (
      this.state.hiragana[hiraganaIndex] &&
      this.state.currKnownChars == null
    ) {
      this.state.hiragana[hiraganaIndex].map(e => {
        element = <td key={e.order}>{e.jp}</td>;
        return result.push(element);
      });
    }
    return result;
  }

  render() {
    const { classes } = this.props;

    if (this.state.hiragana && this.state.currentUser) {
      return (
        <>
          <div className='container'>
            <h2>Twoja hiragana</h2>
            <div className='hiragana-welcome'>
              <table>
                <thead>
                  <tr>
                    <td />
                    <th>a</th>
                    <th>i</th>
                    <th>u</th>
                    <th>e</th>
                    <th>o</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td />
                    {this.chceckKnown(0)}
                  </tr>
                  <tr>
                    <th>k</th>
                    {this.chceckKnown(1)}
                  </tr>
                  <tr>
                    <th>s</th>
                    {this.chceckKnown(2)}
                  </tr>
                  <tr>
                    <th>t</th>
                    {this.chceckKnown(3)}
                  </tr>
                  <tr>
                    <th>n</th>
                    {this.chceckKnown(4)}
                  </tr>
                  <tr>
                    <th>h</th>
                    {this.chceckKnown(5)}
                  </tr>
                  <tr>
                    <th>m</th>
                    {this.chceckKnown(6)}
                  </tr>
                  <tr>
                    <th>y</th>
                    {this.chceckKnown(7)}
                  </tr>
                  <tr>
                    <th>r</th>
                    {this.chceckKnown(8)}
                  </tr>
                  <tr>
                    <th>w</th>
                    {this.chceckKnown(9)}
                  </tr>
                  <tr>
                    <th>N</th>
                    {this.chceckKnown(10)}
                  </tr>
                </tbody>
              </table>
            </div>
            <Button
              variant='contained'
              color='secondary'
              className={classes.button}
              onClick={this.handleLearn}
            >
              Nowe znaki
            </Button>
            <Button
              variant='contained'
              color='secondary'
              className={classes.button}
              onClick={this.handleReview}
            >
              Powtórka
            </Button>
          </div>
        </>
      );
    } else {
      return (
        <h2 style={{ color: 'red', textAlign: 'center' }}>
          Ładowanie danych...
        </h2>
      );
    }
  }
}
WelcomePage = withStyles(styles)(WelcomePage);
export default WelcomePage;
