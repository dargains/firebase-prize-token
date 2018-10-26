import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      database: {},
      tokensList: [],
      number: 0
    }
  }
  componentDidMount() {
    var config = {
      apiKey: "AIzaSyBURMukigLJFCkFkTJGZMi90h7lFi94IqM",
      authDomain: "fir-prize-token.firebaseapp.com",
      databaseURL: "https://fir-prize-token.firebaseio.com",
      projectId: "fir-prize-token",
      storageBucket: "fir-prize-token.appspot.com",
      messagingSenderId: "80979270675"
    };
    firebase.initializeApp(config);
    const database = firebase.firestore();
    this.setState({database}, () => {
      this.getAllTokens();
      this.getSingleToken();
    });
  }
  getAllTokens() {
    this.state.database.collection('tokens').get().then(list => {
      const tokensList = [];
      list.forEach(item => {
        tokensList.push(item.data());
      });
      this.setState({tokensList});
    });
  }
  getSingleToken() {
    let code = Math.floor( Math.random() * 1e6 ).toString().padStart(6, "0");
    let tokensRef = this.state.database.collection('tokens');
    let queryRef = tokensRef.where('code', '==', code);
    queryRef.get().then(snap => {
      if (!snap.docs.length) console.log('No luck');
      snap.forEach(item => {
        console.log('DING DING DING');
      })
    });
  }
  makeNewTokens() {
    const batch = this.state.database.batch();
    for(let i = 0; i < this.state.number; i++) {
      let newDoc = this.state.database.collection('tokens').doc();
      let code = Math.floor( Math.random() * 1e6 ).toString().padStart(6, "0");
      let prize = Math.random() < .1;
      let newToken = {code, prize};
      batch.set(newDoc, newToken);
    }
    batch.commit();
  }
  onNumberChange(e) {
    this.setState({number:e.target.value});
  }
  render() {
    return (
      <div className="App" style={{maxWidth:'800px',margin:'0px auto',padding:'40px'}}>
        <div>
          <h3>Prized token?</h3>
          <p></p>
        </div>
        <div>
          <h3>Include tokens</h3>
          <input type="number" value={this.state.number} onChange={this.onNumberChange.bind(this)}/>
          <button onClick={this.makeNewTokens.bind(this)}>make new tokens!</button>
        </div>
        <div>
          <h3>All tokens</h3>
          <ul>
          {this.state.tokensList.map(item => <li key={item.code} style={{fontWeight: item.prize ? '700' : '400'}}>{item.code}</li>)}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
