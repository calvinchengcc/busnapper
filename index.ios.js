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
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
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
            name: responseStop.Name,
            coordinate: {
              latitude: responseStop.Latitude,
              longitude: responseStop.Longitude
            }
          };
        });
        this.setState({busStopMarkers: stops});
      } catch(error) {
        console.error(error);
      }
    }

    buttonPressed(){
      alert("Hi")
    }

    componentWillMount(){
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({initialPosition: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
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
      this.fetchStopData();
    }

    componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchID);
    }

    onRegionChange(region) {
      this.setState({region});
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
            response.json().then(
              (geocode) => {
                let lat = geocode.results[0].geometry.location.lat;
                let long = geocode.results[0].geometry.location.lng;
                this.setState({region: {latitude: lat, longitude: long}});
                alert("lat: " + lat + ", long: " + long);
              }).catch((error) => {
                console.error(error);
              })
          }).catch((error) => {
              console.error(error);
            });
    }

    render() {
      return (
        <View style={{ flex: 1 }}>
        <GooglePlacesAutocomplete
        placeholder='Enter Destination'
        minLength={2} // minimum length of text to search
        autoFocus={false}
        listViewDisplayed='auto'    // true/false/undefined
        fetchDetails={true}
        renderDescription={(row) => row.description} // custom description render
        onPress={this.onButtonPressed.bind(this)}
      //   (data, details = null) => { // 'details' is provided when fetchDetails = true
      //     console.log(data);
      //     console.log(details);
      //     //alert(JSON.stringify(data));
      //     let address = data.description; 
      //     var API = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyC4zC0FQBYsOf8E50t00kmC8lzW7nPUn8s";
      //     let response = fetch(API, {
      //       headers: {
      //         'Accept': 'application/json',
      //         'Content-Type': 'application/json',
      //       }}).then((response) => {
      //           response.json().then(
      //             (geocode) => {
      //               let lat = geocode.results[0].geometry.location.lat;
      //               let long = geocode.results[0].geometry.location.lng;
      //               this.setState({region: {latitude: lat, longitude: long}});
      //               alert("lat: " + lat + ", long: " + long);
      //             }).catch((error) => {
      //               console.error(error);
      //             })
      //         }).catch((error) => {
      //             console.error(error);
      //           });
      //   }
      // }
        getDefaultValue={() => {
          return ''; // text input default value
        }}
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: 'AIzaSyCr1YQ52b_kW7IDE-5e5rEtjuSOuaB8zqA',
          language: 'en', // language of the results
          types: '(cities)', // default: 'geocode'
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


        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

        debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 200ms.
      />
        <MapView
        style={{flex:0.75}}
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
