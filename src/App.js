import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css'
import { Button, Loader, Segment, Dimmer, Form, Input } from 'semantic-ui-react';
import Cookies from 'universal-cookie';
import SignUpForm from './components/SignUpForm';
import Layout from './components/Layout';
import MainPage from './components/MainPage';


class App extends Component{

  constructor(props){
    super(props);

    this.state = {
      isLoading : true,
      previousSignIn : false
    }

  }


  componentDidMount(){
    this.setState({ isLoading: false })
    const cookies = new Cookies();
    //cookies.set('signedIn', 'HelloPacman', { path: '/' });
    if(cookies.get('signedIn') != undefined){
      this.setState({ previousSignIn: true })
    }
  }

  handlerForSignUpForm = () => {
    const cookies = new Cookies();
    if(cookies.get('signedIn') != undefined){
      this.setState({ previousSignIn: true })
    }
    console.log("Signed in")
  };



  render(){


    if(this.state.isLoading === true){
      return(
        <div>
          <Segment size='massive' className='loader_segment'>
            <Dimmer active>
              <Loader size='massive'>Loading</Loader>
            </Dimmer>
          </Segment>
        </div>
        
      )
    }
    else if(this.state.isLoading === false && this.state.previousSignIn === false){ // Not signed in
      return(
        <Layout>
          <SignUpForm handler={() => {
            this.handlerForSignUpForm();
          }}/>
        </Layout>
      )
    }
    else if(this.state.isLoading === false && this.state.previousSignIn === true){ // Signed in
      return(
        <Layout>
          <MainPage />
        </Layout>
      )
    }
    
  }
}

export default App;
