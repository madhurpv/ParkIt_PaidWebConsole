import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css'
import { Button, Loader, Segment, Dimmer, Form, Input, Container, Table, Header, Menu, Divider, Grid, Message } from 'semantic-ui-react';
import Cookies from 'universal-cookie';
import database from '../firebase';
import { ref, set } from "firebase/database";


class MainPage extends Component{

  constructor(props){
    super(props);

    this.state = {
      vehicleCount: 0,
    };

  }


  componentDidMount(){
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  
  
  increaseVehicleCount = (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      vehicleCount: prevState.vehicleCount + 1,
    }));
    console.log("Vehicles :", this.state.vehicleCount)
  }

  decreaseVehicleCount = (e) => {
    e.preventDefault();
    if(this.state.vehicleCount >= 1){
      this.setState((prevState) => ({
        vehicleCount: prevState.vehicleCount - 1,
      }));
    }
    console.log("Vehicles :", this.state.vehicleCount)
    set(ref(database, 'users/'), {
      username: this.state.vehicleCount,
      password: "this.state.password"
    });
  }


  render(){
    return (
      <div>
        <Container style={{ padding: '5em 0em' }}>
          <Header as='h2'>Attached Content</Header>
          <Grid columns={3} r celled='internally'>
            <Grid.Row>
              <Grid.Column>
              </Grid.Column>

              <Grid.Column>
                  <Button color='blue' size='massive' onClick={this.increaseVehicleCount}>+</Button>
                  <Input style={{width: 130, margin: 15}} type='numeric' value={this.state.vehicleCount} size='massive' />
                  <Button color='violet' size='massive' onClick={this.decreaseVehicleCount}>-</Button>
              </Grid.Column>

              <Grid.Column>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
              </Grid.Column>

              <Grid.Column>
                <Input style={{width: 75,margin: 3}} maxLength="2" size='huge' />
                <Input style={{width: 70,margin: 3}} type='numeric' maxLength="2" value={this.state.vehicleCount} size='huge' />
                <Input style={{width: 75,margin: 3}} maxLength="2" size='huge' />
                <Input style={{width: 100,margin: 3}} type='numeric' maxLength="4" size='huge' />

                <center>
                  <Button color='green' size='massive' onClick={this.decreaseVehicleCount}>ENTER</Button>
                </center>
              </Grid.Column>

              <Grid.Column>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>

        
      </div>
    );

    
  }
}

export default MainPage;
