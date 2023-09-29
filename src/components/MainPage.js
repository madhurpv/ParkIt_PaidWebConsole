import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css'
import { Button, Loader, Segment, Dimmer, Form, Input, Container, Table, Header, Menu, Divider, Grid, Message, Confirm } from 'semantic-ui-react';
import Cookies from 'universal-cookie';
import database from '../firebase';
import { ref, set, onValue, child, get, update } from "firebase/database";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';


class MainPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      enterVehicleState: 'MH',
      enterVehicleRegion: '01',
      enterVehicleTime: 'AA',
      enterVehicleLastNumber: '0000',
      exitVehicleState: 'MH',
      exitVehicleRegion: '01',
      exitVehicleTime: 'AA',
      exitVehicleLastNumber: '0000',
      futureVehicles: [],
      insideVehicles: [],
      showConfirmationVehicleEntered: false,
      showConfirmationVehicleEnteredIndex: -1,
      showConfirmationVehicleExited: false,
      showConfirmationVehicleExitedIndex: -1,
      pieChartData: [
        { name: 'Pre-Booked filled', value: 0, fill: "#FF1100" },
        { name: 'Pre-booked remaining', value: 0, fill: "#88DD00" },
        { name: 'Filled', value: 20, fill: "#FF8800" },
        { name: 'Vacant', value: 10, fill: "#00FF00" },
        { name: 'Vacant', value: 0, fill: "#00FF00" }
      ],
      maxPreBooking: 0,                     // Maximum preBooking allowed
      maxCapacity: 0,                      // Total max capacity of parking
      currentVehicleCount: 0,             // Total non-pre-booked vehicles in parking currently
      currentPreBookedVehicles: 0        // Pre-booked vehicles who have arrived
    };

  }


  async componentDidMount() {
    console.log("Firebase Data Start")

    // TODO: Check if previous timestamp is there, and if present, flag it in dashboard

    // CURRENT VEHICLES
    const cookies = new Cookies();
    onValue(ref(database, 'PaidParking/Operators/' + cookies.get('signedIn')), async (snapshot) => {
      var receivedData = snapshot.val();
      var data = receivedData.currentVehicles;
      if (parseInt(data) === NaN || data === null) {
        this.setState({ currentVehicleCount: 0 });
      }
      else {
        this.setState({ currentVehicleCount: parseInt(data) }, () => {
          console.log("The state has been set : ", this.state.currentVehicleCount);
          this.setState({ currentVehicleCount: parseInt(data) })
        })
      }
      console.log("Firebase Vehicles", data)
      this.setState({ maxPreBooking: receivedData.maxPreBooking });
      this.setState({ maxCapacity: receivedData.maxCapacity });
      this.setState({ currentNonPreBookedVehicles: receivedData.currentNonPreBookedVehicles });
      //this.setState({ currentVehicleCount: receivedData.currentVehicles });
      this.setState({ currentPreBookedVehicles: receivedData.currentPreBookedVehicles });
      const delay = ms => new Promise(res => setTimeout(res, ms));
      await delay(0.1);                 // Delay for sync
      console.log("Received Data :", receivedData, "\nPrebooked :", this.state.currentPreBookedVehicles);
      let pieChartData2 = this.state.pieChartData;
      pieChartData2[2].value = this.state.currentVehicleCount;
      pieChartData2[3].value = this.state.maxCapacity - this.state.currentVehicleCount;
      this.setState({ pieChartData: pieChartData2.slice(0, 4) }, function () {
        this.setState({ pieChartData: pieChartData2 });
      });

      // Future Vehicles
      const date = new Date();
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      const hourTimestamp = Math.floor(date.getTime() / 1000);
      console.log("Timestamp :", hourTimestamp);
      onValue(ref(database, 'PaidParking/Operators/' + cookies.get('signedIn') + "/futureVehicles/" + hourTimestamp), (snapshot) => {
        var data = snapshot.val();
        console.log("DATA : ", data);
        if (data == null) { // No entry in firebase
          this.state.futureVehicles = [];
          this.setState({ totalBooking: 0 });
        }
        else {
          this.state.futureVehicles = [];
          for (let index = 0; index < Object.keys(data).length; index++) {
            if (Object.keys(data)[index] != "booked") {
              console.log("Number", Object.keys(data)[index]);
              var mykey = Object.keys(data)[index]
              if (Object.keys(data[mykey]).includes("arrived")) {  // Vehicle already arrived
                if (!this.state.insideVehicles.includes(Object.keys(data)[index])) { // Vehicle not already in list
                  this.state.insideVehicles.push(Object.keys(data)[index]);
                }
              }
              else {
                this.state.futureVehicles.push(Object.keys(data)[index]);
              }
            }
            else {  // 'booked'
              this.setState({ totalBooking: data.booked })

              let pieChartData2 = this.state.pieChartData;
              pieChartData2[0].value = this.state.currentPreBookedVehicles;                                        // Set filled pre-booked spots
              pieChartData2[1].value = data.booked - this.state.currentPreBookedVehicles;                         // Set empty pre-booked spots
              pieChartData2[2].value = this.state.currentVehicleCount;                                           // Set Filled non-pre-booked spots
              pieChartData2[3].value = this.state.maxCapacity - data.booked - this.state.currentVehicleCount;   // Set vacant non-pre-booked spots
              this.setState({ pieChartData: pieChartData2.slice(0, 4) }, function () {
                this.setState({ pieChartData: pieChartData2 });
              });
              console.log("Data of booked remaining to enter :", this.state.pieChartData[1].value, this.state.currentPreBookedVehicles)
            }
          }
          //console.log("Future Vehicles : ", Object.keys(data))
          //console.log("FutureVehicles: ", this.state.futureVehicles)
          this.setState({ a: "0" }) // Just for calling Render method
        }
      });
    });


  }




  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };


  addClick() {
    this.setState(prevState => ({ futureVehicles: [...prevState.futureVehicles, ''] }))
  }

  vehicleEnteredClick(i) {
    this.setState({ showConfirmationVehicleEntered: true })
    this.setState({ showConfirmationVehicleEnteredIndex: i })
  }

  vehicleExitedClick(i) {
    this.setState({ showConfirmationVehicleExited: true })
    this.setState({ showConfirmationVehicleExitedIndex: i })
  }

  futureVehicles() {
    return this.state.futureVehicles.map((el, i) =>
      <div key={i}>
        <Button basic type="text" style={{ width: '80%', padding: '5px', height: 40 }} value={el || ''} onChange={this.handleChange.bind(this, i)} onClick={this.vehicleEnteredClick.bind(this, i)} >{el || '123'}</Button>
      </div>
    )
  }

  insideVehicles() {
    return this.state.insideVehicles.map((el, i) =>
      <div key={i}>
        <Button basic type="text" style={{ width: '80%', padding: '5px', height: 40 }} value={el || ''} onClick={this.vehicleExitedClick.bind(this, i)} >{el || '123'}</Button>
      </div>
    )
  }


  increasecurrentVehicleCount = (e) => {
    e.preventDefault();
    console.log("totalBooking : ", this.state.totalBooking);
    const cookies = new Cookies();
    if (this.state.maxCapacity - this.state.totalBooking - this.state.currentVehicleCount >= 1) {  // Vacancy >= 1
      this.setState((prevState) => ({
        currentVehicleCount: prevState.currentVehicleCount + 1,
      }));
      update(ref(database, 'PaidParking/Operators/' + cookies.get('signedIn')), {
        currentVehicles: parseInt(this.state.currentVehicleCount) + 1
      });
      console.log("Vehicles :", this.state.currentVehicleCount)

      // Update Piechart
      let pieChartData2 = this.state.pieChartData;
      pieChartData2[2].value++;
      pieChartData2[3].value--;
      pieChartData2[1].value = this.state.totalBooking - pieChartData2[0].value; // Pre booking remaining
      this.setState({ pieChartData: pieChartData2.slice(0, 4) }, function () {
        this.setState({ pieChartData: pieChartData2 });
      });
    }
  }

  decreasecurrentVehicleCount = (e) => {
    e.preventDefault();
    const cookies = new Cookies();
    if (this.state.currentVehicleCount >= 1) {
      this.setState((prevState) => ({
        currentVehicleCount: prevState.currentVehicleCount - 1,
      }));
      update(ref(database, 'PaidParking/Operators/' + cookies.get('signedIn')), {
        currentVehicles: parseInt(this.state.currentVehicleCount) - 1
      });
      // Update Piechart
      let pieChartData2 = this.state.pieChartData;
      pieChartData2[2].value--;
      pieChartData2[3].value++;
      this.setState({ pieChartData: pieChartData2.slice(0, 4) }, function () {
        this.setState({ pieChartData: pieChartData2 });
      });
    }
    console.log("Vehicles :", this.state.currentVehicleCount)
  }

  changecurrentVehicleCount = (e) => {
    e.preventDefault();
    const cookies = new Cookies();
    this.setState({ currentVehicleCount: e.target.value })
    update(ref(database, 'PaidParking/Operators/' + cookies.get('signedIn')), {
      currentVehicles: parseInt(e.target.value)
    });
  }


  handleConfirmationVehicleEntered = async (e) => {
    e.preventDefault();
    this.setState({ showConfirmationVehicleEntered: false });
    let futureVehicles = [...this.state.futureVehicles];
    const newVehicle = futureVehicles.splice(this.state.showConfirmationVehicleEnteredIndex, 1);
    this.setState({ futureVehicles });
    /*if(!this.state.insideVehicles.includes(newVehicle)){  // insideVehicles does not contain newVehicle
      this.state.insideVehicles.push(newVehicle);
    }*/

    // Update on firebase
    const date = new Date();
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    const hourTimestamp = Math.floor(date.getTime() / 1000);
    const cookies = new Cookies();
    update(ref(database, 'PaidParking/Operators/' + cookies.get('signedIn') + "/futureVehicles/" + hourTimestamp + "/" + newVehicle), {
      arrived: (Date.now() / 1000) | 0
    });
    console.log("Vehicles :", this.state.currentVehicleCount)

    this.state.currentPreBookedVehicles += 1;
    update(ref(database, 'PaidParking/Operators/' + cookies.get('signedIn')), {
      currentPreBookedVehicles: this.state.currentPreBookedVehicles
    });

    // Update Piechart
    let pieChartData2 = this.state.pieChartData;
    pieChartData2[0].value = this.state.currentPreBookedVehicles;
    pieChartData2[1].value--;
    this.setState({ pieChartData: pieChartData2.slice(0, 4) }, function () {
      this.setState({ pieChartData: pieChartData2 });
    });
  }

  handleCancelConfirmationVehicleEntered = (e) => {
    e.preventDefault();
    this.setState({ showConfirmationVehicleEntered: false });
  }

  handleConfirmationVehicleExited = async (e) => {
    e.preventDefault();
    this.setState({ showConfirmationVehicleExited: false });
    let insideVehicles = [...this.state.insideVehicles];
    const goneVehicle = insideVehicles.splice(this.state.showConfirmationVehicleExitedIndex, 1);
    this.setState({ insideVehicles });

    // Update on firebase
    const date = new Date();
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    const hourTimestamp = Math.floor(date.getTime() / 1000);
    const cookies = new Cookies();
    set(ref(database, 'PaidParking/Operators/' + cookies.get('signedIn') + "/futureVehicles/" + hourTimestamp + "/" + goneVehicle), {
    });
    this.state.currentPreBookedVehicles -= 1;
    update(ref(database, 'PaidParking/Operators/' + cookies.get('signedIn')), {
      currentPreBookedVehicles: this.state.currentPreBookedVehicles
    });

    // Update Piechart
    let pieChartData2 = this.state.pieChartData;
    pieChartData2[0].value--;
    pieChartData2[3].value++;
    this.setState({ pieChartData: pieChartData2.slice(0, 4) }, function () {
      this.setState({ pieChartData: pieChartData2 });
    });
  }

  handleCancelConfirmationVehicleExited = (e) => {
    e.preventDefault();
    this.setState({ showConfirmationVehicleExited: false });
  }


  render() {
    return (
      <div>
        <Container style={{ padding: '5em 0em' }}>
          <Header as='h2'>Dashboard</Header>
          <Grid columns={3} r celled='internally'>
            <Grid.Row>
              <Grid.Column>
              </Grid.Column>

              <Grid.Column>
                <Button color='blue' size='massive' onClick={this.increasecurrentVehicleCount}>+</Button>
                <Input
                  style={{ width: 130, margin: 15 }}
                  type='numeric'
                  value={this.state.currentVehicleCount}
                  size='massive'
                  onChange={this.changecurrentVehicleCount} />
                <Button color='violet' size='massive' onClick={this.decreasecurrentVehicleCount}>-</Button>
              </Grid.Column>

              <Grid.Column>
              </Grid.Column>
            </Grid.Row>


            <Grid.Row>
              <Grid.Column>
                <div style={{ height: '290px', overflowY: 'scroll' }}>
                  {this.futureVehicles()}
                </div>
                <Button type="button" onClick={this.addClick.bind(this)} positive>+</Button>
                <Confirm
                  open={this.state.showConfirmationVehicleEntered}
                  content={"Has the vehicle " + this.state.futureVehicles[this.state.showConfirmationVehicleEnteredIndex] + " really arrived?"}
                  confirmButton="Yes"
                  cancelButton="No"
                  onCancel={this.handleCancelConfirmationVehicleEntered}
                  onConfirm={this.handleConfirmationVehicleEntered}
                />

              </Grid.Column>

              <Grid.Column>
                <Input
                  style={{ width: 75, margin: 3 }}
                  maxLength="2"
                  value={this.state.exitVehicleState}
                  size='huge'
                  onChange={event => this.setState({ exitVehicleState: event.target.value })} />
                <Input
                  style={{ width: 70, margin: 3 }}
                  type='numeric'
                  maxLength="2"
                  value={this.state.exitVehicleRegion}
                  size='huge'
                  onChange={event => this.setState({ exitVehicleRegion: event.target.value })} />
                <Input
                  style={{ width: 75, margin: 3 }}
                  maxLength="2"
                  value={this.state.exitVehicleTime}
                  size='huge'
                  onChange={event => this.setState({ exitVehicleTime: event.target.value })} />
                <Input
                  style={{ width: 100, margin: 3 }}
                  type='numeric'
                  maxLength="4"
                  value={this.state.exitVehicleLastNumber}
                  size='huge'
                  onChange={event => this.setState({ exitVehicleLastNumber: event.target.value })} />

                <center>
                  <Button color='green' size='massive' onClick={this.decreasecurrentVehicleCount}>ENTER</Button>
                </center>
              </Grid.Column>

              <Grid.Column>
                <div style={{ height: '290px', overflowY: 'scroll' }}>
                  {this.insideVehicles()}
                </div>
                <Confirm
                  open={this.state.showConfirmationVehicleExited}
                  content={"Has the vehicle " + this.state.futureVehicles[this.state.showConfirmationVehicleExitedIndex] + " really exited?"}
                  confirmButton="Yes"
                  cancelButton="No"
                  onCancel={this.handleCancelConfirmationVehicleExited}
                  onConfirm={this.handleConfirmationVehicleExited}
                />
              </Grid.Column>
            </Grid.Row>


            <Grid.Row>
              <Grid.Column>
                <Grid style={{ height: '300px' }}>
                  <Grid.Column>
                    <Slider
                      vertical
                      defaultValue={20}
                      min={5}
                      max={50}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Slider
                      vertical
                      defaultValue={20}
                      min={5}
                      max={50}
                    />
                  </Grid.Column>
                </Grid>
              </Grid.Column>

              <Grid.Column>
                <Input
                  style={{ width: 75, margin: 3 }}
                  maxLength="2"
                  value={this.state.enterVehicleState}
                  size='huge'
                  onChange={event => this.setState({ enterVehicleState: event.target.value })} />
                <Input
                  style={{ width: 70, margin: 3 }}
                  type='numeric'
                  maxLength="2"
                  value={this.state.enterVehicleRegion}
                  size='huge'
                  onChange={event => this.setState({ enterVehicleRegion: event.target.value })} />
                <Input
                  style={{ width: 75, margin: 3 }}
                  maxLength="2"
                  value={this.state.enterVehicleTime}
                  size='huge'
                  onChange={event => this.setState({ enterVehicleTime: event.target.value })} />
                <Input
                  style={{ width: 100, margin: 3 }}
                  type='numeric'
                  maxLength="4"
                  value={this.state.enterVehicleLastNumber}
                  size='huge'
                  onChange={event => this.setState({ enterVehicleLastNumber: event.target.value })} />

                <center>
                  <Button color='red' size='massive' onClick={this.decreasecurrentVehicleCount}>EXIT</Button>
                </center>
              </Grid.Column>

              <Grid.Column>
                <PieChart width={500} height={700}>
                  <Legend layout="horizontal" verticalAlign="top" align="center" />
                  <Pie data={this.state.pieChartData.slice(0, 4)} dataKey="value" outerRadius={200}
                    innerRadius={150}
                    fill="green"
                    label
                    startAngle={180}
                    endAngle={0}
                    nameKey="name" />
                </PieChart>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>


      </div>
    );


  }
}

export default MainPage;
