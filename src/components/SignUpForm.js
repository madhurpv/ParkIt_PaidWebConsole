import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css'
import { Button, Loader, Segment, Dimmer, Form, Input } from 'semantic-ui-react';
import Cookies from 'universal-cookie';
import database from '../firebase';
import { ref, set, onValue } from "firebase/database";



class SignUpForm extends Component{

  constructor(props){
    super(props);

    this.state = {
      username: '',
      password: '',
    };

  }


  componentDidMount(){
  }


  handleSubmit = (e) => {
    e.preventDefault();
    // do something with username and password
    console.log(this.state.username, this.state.password);

    // Verification
    if(this.state.username === "Hello" && this.state.password === "12345"){
      const cookies = new Cookies();
      cookies.set('signedIn', this.state.username, { path: '/' });
      console.log("Signed In!");
      
      set(ref(database, 'PaidParking/Operators/' + this.state.username), {
        username: this.state.username,
        password: this.state.password,
        loggedIn: Date.now()
      });

      this.props.handler();
    }
  };

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };


  render(){
    const { username, password } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input
          label="Username"
          name="username"
          placeholder="Enter your username"
          value={username}
          onChange={this.handleChange}
        />
        <Form.Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={this.handleChange}
        />
        <Button type="submit">Login</Button>
      </Form>
    );

    
  }
}

export default SignUpForm;
