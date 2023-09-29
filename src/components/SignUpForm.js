import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css'
import { Button, Loader, Segment, Dimmer, Form, Input, Message, Grid } from 'semantic-ui-react';
import Cookies from 'universal-cookie';
import database from '../firebase';
import { ref, set, onValue, update } from "firebase/database";



class SignUpForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      reEnteredPassword: '',
      fullName: '',
      mobileNumber: '',
      emailAddress: '',
      addressOfParking: '',
      maximumCapacity: '',
      passwordsNotSameMessage: true,
      allFieldsMandatory: true
    };

  }


  componentDidMount() {
  }


  handleSubmit = (e) => {
    e.preventDefault();
    // do something with username and password
    //console.log(this.state.username, this.state.password);
    if(this.state.fullName === '' || this.state.mobileNumber === '' || this.state.addressOfParking === '' || this.state.username === '' || this.state.password === '' || this.state.reEnteredPassword === '' || this.state.maximumCapacity === '' || this.state.maximumCapacity === 0){
      this.setState({ allFieldsMandatory: false });
    }
    else if(this.state.password !== this.state.reEnteredPassword){
      this.setState({ passwordsNotSameMessage: false });
      this.setState({ allFieldsMandatory: true });
    }
    else{
      this.setState({ passwordsNotSameMessage: true });
      this.setState({ allFieldsMandatory: true });

      set(ref(database, 'PaidParking/Operators/' + this.state.username), {
        username: this.state.username,
        password: this.state.password,
        fullName: this.state.fullName,
        address: this.state.addressOfParking,
        mobileNumber: this.state.mobileNumber,
        maxCapacity: this.state.maximumCapacity,
        maxPreBooking: (this.state.maximumCapacity/3)|0,
        currentPreBookedVehicles: 0,
        currentVehicles: 0,
        loggedIn: Date.now()
      });
      const cookies = new Cookies();
      cookies.set('signedIn', this.state.username, { path: '/' });

    }

    this.props.handler();
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };


  render() {
    const { username, password, addressOfParking, fullName, mobileNumber, maximumCapacity } = this.state;
    return (
      <div>
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 750 }}>
            <Segment stacked>
              <Form onSubmit={this.handleSubmit}>
                <Grid columns={2}>
                  <Grid.Column>
                <Form.Input
                  label="Full Name"
                  name='fullName'
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={this.handleChange}
                />
                <Form.Input
                  label="Mobile Number"
                  placeholder="+91 9876543210"
                  name='mobileNumber'
                  type='tel'
                  value={mobileNumber}
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
                <Form.Input
                  label="Re-enter Password"
                  name="reEnteredPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={this.state.reEnteredPassword}
                  onChange={this.handleChange}
                />
                </Grid.Column>
                <Grid.Column>
                <Form.Input
                  label="Username"
                  name="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={this.handleChange}
                />
                <Form.Input
                  label="Maximum Parking Capacity"
                  placeholder="Maximum Parking Capacity of Parking"
                  name='maximumCapacity'
                  type='number'
                  value={maximumCapacity}
                  onChange={this.handleChange}
                />
                <Form.Input
                  label="Address"
                  name="addressOfParking"
                  placeholder="Postal address of situated parking"
                  value={addressOfParking}
                  onChange={this.handleChange}
                />
                </Grid.Column>
                </Grid>
                <Button type="submit" style={{ marginTop: '20px' }}>Sign Up</Button>
              </Form>
              <Message negative
                hidden={this.state.passwordsNotSameMessage}>
                <Message.Header>Passwords do not match!</Message.Header>
                <p>Recheck whether both the entered passwords are same</p>
              </Message>
              <Message negative
                hidden={this.state.allFieldsMandatory}>
                <Message.Header>All fields are mandatory!</Message.Header>
                <p>Make sure all the fields are filled</p>
              </Message>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );


  }
}

export default SignUpForm;
