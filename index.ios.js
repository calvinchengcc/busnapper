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
  View
} from 'react-native';
import MapView from 'react-native-maps';

export default class busnapper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initialPosition: {
        latitude: 49.264,
        longitude: -123.19
      },
      lastPosition: {
        latitude: 49.264,
        longitude: -123.19
      },
      busStopMarkers: [],
      selectedRoute: null
    };
    this.watchID = null;
  }

  fetchStopData(latitude, longitude) {
      let stopQuery = (this.state.selectedRoute === null) ?
        '' :
        `stopNo=${this.state.selectedRoute}`;
      let requestUrl = `https://api.translink.ca/RTTIAPI/V1/stops` +
        `?apiKey=rQef46wC3btmRlRln1gi&radius=2000` +
        `&lat=${latitude.toFixed(6)}&long=${longitude.toFixed(6)}${stopQuery}`;
      let response = fetch(requestUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }}).then((response) => {
          response.json().then((responseStops) => {
            if (typeof responseStops.map !== 'function') {
              console.warn(`No stops found for (${latitude}, ${longitude}.`);
              return;
            }
            let stops = responseStops.map((responseStop) => {
              return {
                stopNum: responseStop.StopNo,
                name: responseStop.Name,
                coordinate: {
                  latitude: responseStop.Latitude,
                  longitude: responseStop.Longitude
                }
              };
            });
            this.setState({busStopMarkers: stops});
          }).catch((error) => {
            console.error(error);
          })
        }).catch((error) => {
          console.error(error);
        });
    }

    buttonPressed(){
      alert("Hi")
    }

    componentWillMount() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let lat = position.coords.latitude;
          let lon = position.coords.longitude;
          this.fetchStopData(lat, lon);
          this.setState({initialPosition: {
            latitude: lat,
            longitude: lon
          }});
        },
        (error) => alert(JSON.stringify(error)),
      );
      this.watchID = navigator.geolocation.watchPosition(
        (position) => {
          this.setState({lastPosition: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }});
        },
        (error) => alert(JSON.stringify(error)),
        {enableHighAccuracy: true}
      );
    }

    componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchID);
    }

    onRegionChangeComplete(region) {
      console.dir(this);
      console.dir(region);
      this.fetchStopData(region.latitude, region.longitude);
    }

    render() {
      return (
        <View style={{ flex: 1 }}>
        <MapView
        style={{flex:0.75}}
        initialRegion={{
          latitude: this.state.initialPosition.latitude,
          longitude: this.state.initialPosition.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        ref = {ref => {this.map = ref; }}
        showsUserLocation = {true}
        onRegionChangeComplete = {this.onRegionChangeComplete.bind(this)}
        >
        {this.state.busStopMarkers.map(busStopMarker => (
          <MapView.Marker
          key={busStopMarker.stopNum}
          coordinate={busStopMarker.coordinate}
          />
        ))}
        </MapView>

        <View style={{ flex: 0.25}}>
        <Text> Initial Location:  </Text>
        <Text> Latitude: {this.state.initialPosition.latitude} </Text>
        <Text> Longitude: {this.state.initialPosition.longitude} </Text>
        <Text> Current Location:  </Text>
        <Text> Latitude: {this.state.lastPosition.latitude} </Text>
        <Text> Longitude: {this.state.lastPosition.longitude} </Text>
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
