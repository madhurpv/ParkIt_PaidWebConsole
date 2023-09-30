import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css'
import { Button, Loader, Segment, Dimmer, Form, Input, Message, Grid } from 'semantic-ui-react';
import Cookies from 'universal-cookie';
import database from '../firebase';
import { ref, set, onValue, update } from "firebase/database";



class LogInForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };

  }


  componentDidMount() {
  }


  handleSubmit = (e) => {
    e.preventDefault();
    // do something with username and password
    console.log(this.state.username, this.state.password);

    // Verification
    if (this.state.username === "Hello" && this.state.password === "12345") {
      const cookies = new Cookies();
      cookies.set('signedIn', this.state.username, { path: '/' });
      console.log("Signed In!");

      update(ref(database, 'PaidParking/Operators/' + this.state.username), {
        //username: this.state.username,
        //password: this.state.password,
        loggedIn: Date.now()
      });

      this.props.handler();
    }
  };

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };


  render() {
    const { username, password } = this.state;
    return (
      <div>
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Segment stacked>
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
            </Segment>
            <Message>
              New to us? <a onClick={this.props.newSignInHandler}>Sign Up</a>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );


  }
}

export default LogInForm;
