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
  View
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
      busStopMarkers: [
        {
          id: 61218,
          coordinate: STATUE_OF_LIBERTY
        },
        {
          id: 81524,
          coordinate: EMPIRE_STATE_BUILDING
        },
        {
          id: 1512,
          coordinate: BLOOMBERG_HQ
        },
        {
          id: 362,
          coordinate: CENTRAL_PARK
        }
      ]
    };
  }

  render() {
    return (
      <View style={{ position: 'relative', height: 500 }}>
        <MapView
          style={{flex:1}}
          initialRegion={{
            latitude: 40.6892,
            longitude: -74.0445,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
          }}>
          {this.state.busStopMarkers.map(busStopMarker => (
            <MapView.Marker coordinate={busStopMarker.coordinate} />
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
