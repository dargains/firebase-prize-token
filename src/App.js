import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/app';
import 'firebase/firestore';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      database: {},
      tokensList: [],
      includeToken: 0,
      myToken: 0
    }
  }
  componentDidMount() {
    var config = {
      apiKey: "AIzaSyDUuAcq_wwLzOt8eENu3PPffuQwHaL90-E",
      authDomain: "vans-christmas.firebaseapp.com",
      databaseURL: "https://vans-christmas.firebaseio.com",
      projectId: "vans-christmas",
      storageBucket: "vans-christmas.appspot.com",
      messagingSenderId: "786284440793"
    };
    firebase.initializeApp(config);
    const database = firebase.firestore();
    const settings = {timestampsInSnapshots: true};
    database.settings(settings);

    this.setState({database}, this.getAllTokens);
  }
  getAllTokens() {
    this.state.database.collection('tokens').where('prize','==',true).get().then(list => {
      const tokensList = [];
      list.forEach(item => {
        tokensList.push(item.data());
      });
      this.setState({tokensList});
    });
  }
  getSingleToken() {
    //let code = Math.floor( Math.random() * 1e6 ).toString().padStart(6, "0");
    let code = this.state.myToken;
    let tokensRef = this.state.database.collection('tokens');
    let queryRef = tokensRef.where('code', '==', code);
    queryRef.get().then(snap => {
      if (!snap.docs.length) alert('No such token');
      snap.forEach(item => {
        if (item.data().prize) alert('DING DING DING');
        else alert('tough luck');
      })
    });
  }
  makeNewTokens() {
    const batchList = [];
    for (let j = 0; j < 40; j++) {

      const batch = this.state.database.batch();
      for(let i = 0; i < this.state.includeToken; i++) {
        let newDoc = this.state.database.collection('tokens').doc();
        let code = Math.floor( Math.random() * 1e6 ).toString().padStart(6, "0");
        do {
          code = Math.floor( Math.random() * 1e6 ).toString().padStart(6, "0");
        }
        while(batchList.includes(code));
        batchList.push(code);
        let prize = Math.random() < .005;
        let newToken = {code, prize};
        batch.set(newDoc, newToken);
      }
      batch.commit().then(response => console.log(response))
      console.log(batchList.length,' tokens uploaded.');
    }
  }
  onNumberChange(e) {
    this.setState({[e.target.name]:e.target.value});
  }
  render() {
    return (
      <main className="App">
        <div>
          <h3>Prized token?</h3>
          <input type="number" name="myToken" value={this.state.myToken} onChange={this.onNumberChange.bind(this)}/>
          <button onClick={this.getSingleToken.bind(this)}>search!</button>
        </div>
        <div>
          <h3>Include tokens</h3>
          <input type="number" name="includeToken" value={this.state.includeToken} onChange={this.onNumberChange.bind(this)}/>
          <button onClick={this.makeNewTokens.bind(this)}>make new tokens!</button>
        </div>
        <div>
          <h3>All tokens: {this.state.tokensList.length}</h3>
          <ul>
          {this.state.tokensList.map(item => <li key={item.code} style={{fontWeight: item.prize ? '700' : '400'}}>{item.code}</li>)}
          </ul>
        </div>
      </main>
    );
  }
}

export default App;
