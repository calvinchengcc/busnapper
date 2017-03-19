/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/


import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import MapView from 'react-native-maps';

export default class busnapper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initialPosition: {
        coords: {latitude: 0, longitude: 0}
      },
      lastPosition: {
        coords: {latitude: 0, longitude: 0}
      },
      busStopMarkers: []
    };
    this.watchID = null;
  }

  async fetchStopData() {
      try {
        let response = await fetch('https://api.translink.ca/RTTIAPI/V1/stops?apiKey=rQef46wC3btmRlRln1gi&lat=49.264375&long=-123.194138&radius=2000', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }});
        let responseStops = await response.json();
        let stops = responseStops.map((responseStop) => {
          return {
            stopNum: responseStop.StopNo,
            coordinate: {
              latitude: responseStop.Latitude,
              longitude: responseStop.Longitude
            },
            name: responseStop.Name
          };
        });
        console.log(stops);
        this.setState({busStopMarkers: stops})
      } catch(error) {
        console.error(error);
      }
    }

  buttonPressed(){
    alert("Hi")
  }

  componentDidMount(){
    this.fetchStopData();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = position;
        this.setState({initialPosition});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true}
    );
    this.watchID = navigator.geolocation.watchPosition(
      (position) => {
        var lastPosition = position;
        this.setState({lastPosition});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true}
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
      <MapView
      style={{flex:0.75}}
      initialRegion={{
        latitude: 49.2477158,
        longitude: -123.1401784,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}>
      {this.state.busStopMarkers.map(busStopMarker => (
        <MapView.Marker
        key={busStopMarker.stopNum}
        coordinate={busStopMarker.coordinate}
        />
      ))}
      </MapView>
      <View style={{ flex: 0.25, flexDirection: "row" }}>
      <View>
      <Text> Initial Location:  </Text>
      <Text> Latitude: {this.state.initialPosition.coords.latitude} </Text>
      <Text> Longitude: {this.state.initialPosition.coords.longitude} </Text>
      </View>
      <View>
      <Text> Current Location:  </Text>
      <Text> Latitude: {this.state.lastPosition.coords.latitude} </Text>
      <Text> Longitude: {this.state.lastPosition.coords.longitude} </Text>
      </View>
      </View>
      <TouchableHighlight onPress={this.buttonPressed} style={{backgroundColor:"grey", height: 50}}>
      <Text style={{textAlign:'center'}}>"Touch me ;)"</Text>
      </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('busnapper', () => busnapper);
