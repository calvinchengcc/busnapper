/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/

"use strict";

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  AsyncStorage
} from 'react-native';
import MapView from 'react-native-maps';

const STATUE_OF_LIBERTY = {
  latitude: 40.6892,
  longitude: -74.0445
};

const EMPIRE_STATE_BUILDING = {
  latitude: 40.7484,
  longitude: -73.9857
};

const BLOOMBERG_HQ = {
  latitude: 40.7620,
  longitude: -73.9680
};

const CENTRAL_PARK = {
  latitude: 40.7829,
  longitude: -73.9654
};

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
      busStopMarkers: [
        {
          key: 61218,
          coordinate: STATUE_OF_LIBERTY
        },
        {
          key: 81524,
          coordinate: EMPIRE_STATE_BUILDING
        },
        {
          key: 1512,
          coordinate: BLOOMBERG_HQ
        },
        {
          key: 362,
          coordinate: CENTRAL_PARK
        }
      ]
    };
    this.watchID = null;
  }
  async InitalizeStopsArray(){
    try {
      let value = await AsyncStorage.getItem('@savedStops:');
      if (value == null){
        let stopsArray=[];
        await AsyncStorage.setItem('@savedStops:', JSON.stringify(stopsArray));
      }
    } catch (error) {
      console.log(error);
    }

  }
  async saveStop(stopID){
    let stopsArray = JSON.parse(await this.getStops());
    stopsArray.push(stopID);
    try {
      await AsyncStorage.setItem('@savedStops:', JSON.stringify(stopsArray));
    } catch (error) {
      console.log("Error saving data" + error);
    }
  }
  
  async getStops(print){
    try {
      const value = await AsyncStorage.getItem('@savedStops:');
      if (value !== null){
        if (print){
          console.log("VALUES: " + value);
        }
        return value;
      }else {
        console.log("Nothing there.");
      }
    } catch (error) {
      console.log(error);
    }
  }
    buttonPressed(){
    alert("Hi")
  }

  async componentDidMount(){
    await this.InitalizeStopsArray();
    await this.saveStop(480);
    await this.saveStop(4);
    await this.saveStop(99);
    await this.getStops(1);
    await this.clearData();
    await this.getStops(1);
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
  
  async clearData(){
    try{
      AsyncStorage.removeItem('@savedStops:');
      console.log("Deleted.");
    }catch(error){
      console.log(error);
    }
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
        latitude: 40.7484,
        longitude: -73.9857,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }}>
      {this.state.busStopMarkers.map(busStopMarker => (
        <MapView.Marker
        key={busStopMarker.key}
        coordinate={busStopMarker.coordinate}
        />
      ))}
      </MapView>
      <View style={{ flex: 0.25}}>
      <Text> Initial Location:  </Text>
      <Text> Latitude: {this.state.initialPosition.coords.latitude} </Text>
      <Text> Longitude: {this.state.initialPosition.coords.longitude} </Text>
      <Text> Current Location:  </Text>
      <Text> Latitude: {this.state.lastPosition.coords.latitude} </Text>
      <Text> Longitude: {this.state.lastPosition.coords.longitude} </Text>
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
