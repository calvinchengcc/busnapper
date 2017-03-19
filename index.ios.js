/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/

"use strict";

import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  Vibration,
  View
} from 'react-native';
import MapView from 'react-native-maps';

var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');

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
      region: {
        latitude: 49.264,
        longitude: -123.19,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
      },
      busStopMarkers: [],
      selectedRoute: null,
      destination: null
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
          }}, () => {
            if (this.state.destination !== null) {
              let distance = getDistanceKmBetween(
                this.state.lastPosition,
                this.state.destination);
              console.log(`Distance to dest: ${distance} km`);
              if (distance < 1) {
                console.log("Vibrating!!!");
                Vibration.vibrate();
              }
            }
          });
        }, (error) => alert(JSON.stringify(error)),
        {enableHighAccuracy: true}
      );
    }

    componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchID);
    }

    onButtonPressed(data, details = null) {
      // console.log(data);
      //     console.log(details);
          //alert(JSON.stringify(data));
      let address = data.description;
      var API = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyC4zC0FQBYsOf8E50t00kmC8lzW7nPUn8s";
      let response = fetch(API, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }}).then((response) => {
          response.json().then((geocode) => {
            let lat = geocode.results[0].geometry.location.lat;
            let long = geocode.results[0].geometry.location.lng;
            this.setState({region: {latitude: lat, longitude: long}});
          }).catch((error) => {
            console.error(error);
          })
        }).catch((error) => {
          console.error(error);
        });
    }

    onRegionChange(region) {
      this.setState({region});
    }

    onRegionChangeComplete(region) {
      this.fetchStopData(region.latitude, region.longitude);
    }

    onMarkerSelected(event) {
      let stopMarker = this.state.busStopMarkers.find((marker) => {
        return JSON.stringify(marker.stopNum) == event.nativeEvent.id;
      });
      Alert.alert(
        stopMarker.name,
        `Do you want to set your destination as ` +
        `${stopMarker.stopNum} - ${stopMarker.name}?`,
        [
          {text: 'Nope.', onPress: () => console.log('Cancel pressed')},
          {text: 'Yes, let me nap!', onPress: () => {
            console.log('OK Pressed');
            this.setState({destination: stopMarker.coordinate});
          }}
        ]
      );
    }

    render() {
      return (
        <View style={{flex: 1}}>
        <GooglePlacesAutocomplete
        placeholder='Enter Destination'
        minLength={2} // minimum length of text to search
        autoFocus={false}
        listViewDisplayed='off'    // true/false/undefined
        fetchDetails={true}
        renderDescription={(row) => row.description} // custom description render
        onPress={this.onButtonPressed.bind(this)}
        getDefaultValue={() => {
          return ''; // text input default value
        }}
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: 'AIzaSyCr1YQ52b_kW7IDE-5e5rEtjuSOuaB8zqA',
          language: 'en', // language of the results
        }}
        styles={{
          description: {
            fontWeight: 'bold',
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}

        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GoogleReverseGeocodingQuery={{
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }}
        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: 'distance',
        }}

        debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 200ms.
      />
        <MapView
        style={{flex: 4}}
        initialRegion={{
          latitude: this.state.initialPosition.latitude,
          longitude: this.state.initialPosition.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        region = {this.state.region}
        onRegionChange = {this.onRegionChange.bind(this)}
        ref = {ref => {this.map = ref; }}
        showsUserLocation = {true}
        onRegionChangeComplete = {this.onRegionChangeComplete.bind(this)}
        >
        {this.state.busStopMarkers.map(busStopMarker => (
          <MapView.Marker
          key={busStopMarker.stopNum}
          identifier={JSON.stringify(busStopMarker.stopNum)}
          coordinate={busStopMarker.coordinate}
          onPressed={this.onMarkerSelected.bind(this)}
          onSelect={this.onMarkerSelected.bind(this)}
          />
        ))}
        </MapView>
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

function getDistanceKmBetween(coord1, coord2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(coord1.latitude - coord2.latitude);
  var dLon = deg2rad(coord1.longitude - coord2.longitude);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(coord1.latitude)) * Math.cos(deg2rad(coord2.latitude)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
