import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css'
import { Button, Loader, Segment, Dimmer, Form, Input, Container, Table, Header, Menu, Divider, Grid, Message, Confirm } from 'semantic-ui-react';
import Cookies from 'universal-cookie';
import database from '../firebase';
import { ref, set, onValue } from "firebase/database";


class MainPage extends Component{

  constructor(props){
    super(props);

    this.state = {
      vehicleCount: 0,
      enterVehicleState: 'MH',
      enterVehicleRegion: '01',
      enterVehicleTime: 'AA',
      enterVehicleLastNumber: '0000',
      exitVehicleState: 'MH',
      exitVehicleRegion: '01',
      exitVehicleTime: 'AA',
      exitVehicleLastNumber: '0000',
      futureVehicles: ["MH 12 LJ 2463"],
      showConfirmationDelete: false,
      showConfirmationDeleteIndex: -1
    };

  }


  componentDidMount(){
    console.log("Firebase Data Start")
    onValue(ref(database, 'PaidParking/Operators'), (snapshot) => {
      const data = snapshot.val();
      console.log("Firebase Data", data)
      console.log("Firebase Data 2 :", data.Hello.loggedIn)
    });

  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };


  addClick(){
    this.setState(prevState => ({ futureVehicles: [...prevState.futureVehicles, '']}))
  }
  
  removeClick(i){
     this.setState({ showConfirmationDelete: true })
     this.setState({ showConfirmationDeleteIndex: i })
  }

  futureVehicles(){
    return this.state.futureVehicles.map((el, i) => 
        <div key={i}>
           <Button basic type="text" style={{ width: '80%', padding: '5px', height: 40 }} value={el||''} onChange={this.handleChange.bind(this, i)} onClick={this.removeClick.bind(this, i)} >{el||'123'}</Button>
        </div>          
    )
  }

  
  
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
    /*set(ref(database, 'users/'), {
      username: this.state.vehicleCount,
      password: "this.state.password"
    });*/
  }

  addVehicle = (e) => {
    e.preventDefault();
  }

  handleCancelConfirmationDelete = (e) => {
    e.preventDefault();
    this.setState({ showConfirmationDelete: false });
    let futureVehicles = [...this.state.futureVehicles];
    futureVehicles.splice(this.state.showConfirmationDeleteIndex,1);
    this.setState({ futureVehicles });
  }

  handleCancelConfirmationNotDelete = (e) => {
    e.preventDefault();
    this.setState({ showConfirmationDelete: false });
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
                  <Input 
                    style={{width: 130, margin: 15}} 
                    type='numeric' 
                    value={this.state.vehicleCount} 
                    size='massive'
                    onChange={event => this.setState({ vehicleCount: event.target.value })} />
                  <Button color='violet' size='massive' onClick={this.decreaseVehicleCount}>-</Button>
              </Grid.Column>

              <Grid.Column>
              </Grid.Column>
            </Grid.Row>


            <Grid.Row>
              <Grid.Column>
                {this.futureVehicles()}
                <Button type="button" onClick={this.addClick.bind(this)} positive>+</Button>
                <Confirm
                  open={this.state.showConfirmationDelete}
                  content={"Has the vehicle " + this.state.futureVehicles[this.state.showConfirmationDeleteIndex] + " really arrived?"}
                  confirmButton="Yes"
                  cancelButton="No"
                  onCancel={this.handleCancelConfirmationNotDelete}
                  onConfirm={this.handleCancelConfirmationDelete}
                />

              </Grid.Column>

              <Grid.Column>
                <Input 
                  style={{width: 75,margin: 3}} 
                  maxLength="2" 
                  value={this.state.exitVehicleState} 
                  size='huge'
                  onChange={event => this.setState({ exitVehicleState: event.target.value })} />
                <Input 
                  style={{width: 70,margin: 3}} 
                    type='numeric' 
                    maxLength="2" 
                    value={this.state.exitVehicleRegion} 
                    size='huge'
                    onChange={event => this.setState({ exitVehicleRegion: event.target.value })} />
                <Input 
                  style={{width: 75,margin: 3}} 
                  maxLength="2" 
                  value={this.state.exitVehicleTime} 
                  size='huge' 
                  onChange={event => this.setState({ exitVehicleTime: event.target.value })}/>
                <Input 
                  style={{width: 100,margin: 3}} 
                  type='numeric' 
                  maxLength="4" 
                  value={this.state.exitVehicleLastNumber} 
                  size='huge' 
                  onChange={event => this.setState({ exitVehicleLastNumber: event.target.value })}/>

                <center>
                  <Button color='green' size='massive' onClick={this.decreaseVehicleCount}>ENTER</Button>
                </center>
              </Grid.Column>

              <Grid.Column>
              </Grid.Column>
            </Grid.Row>


            <Grid.Row>
              <Grid.Column>
              </Grid.Column>

              <Grid.Column>
              <Input 
                  style={{width: 75,margin: 3}} 
                  maxLength="2" 
                  value={this.state.enterVehicleState} 
                  size='huge'
                  onChange={event => this.setState({ enterVehicleState: event.target.value })} />
                <Input 
                  style={{width: 70,margin: 3}} 
                    type='numeric' 
                    maxLength="2" 
                    value={this.state.enterVehicleRegion} 
                    size='huge'
                    onChange={event => this.setState({ enterVehicleRegion: event.target.value })} />
                <Input 
                  style={{width: 75,margin: 3}} 
                  maxLength="2" 
                  value={this.state.enterVehicleTime} 
                  size='huge' 
                  onChange={event => this.setState({ enterVehicleTime: event.target.value })}/>
                <Input 
                  style={{width: 100,margin: 3}} 
                  type='numeric' 
                  maxLength="4" 
                  value={this.state.enterVehicleLastNumber} 
                  size='huge' 
                  onChange={event => this.setState({ enterVehicleLastNumber: event.target.value })}/>

                <center>
                  <Button color='red' size='massive' onClick={this.decreaseVehicleCount}>EXIT</Button>
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
