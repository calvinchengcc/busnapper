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
  buttonPressed(){
    alert("Hi")
  }
  render() {
    return (
    <View style={{ position: 'relative', flex:1}}>
     <MapView
        style={{flex:0.6}}
        initialRegion={{
          latitude: 40.6892,
          longitude: -74.0445,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}/>
        <View style={{flex: 0.2, flexDirection: 'row'}}>
          <View style={{flex: 0.5}}>
            <Text> tarLong: </Text>
            <Text> {"\n"} </Text>
            <Text> {"\n"} </Text>
            <Text> tarLat: </Text>
            </View>
          <View style={{flex: 0.5}}>
          <Text> curLong: </Text>
          <Text> {"\n"} </Text>
          <Text> {"\n"} </Text>
          <Text> CurLat: </Text>
            </View>
          </View>
        <TouchableHighlight onPress={this.buttonPressed} style={{backgroundColor:"grey", flex:0.05}}>
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
