import React, { Component } from 'react';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';

export class SetupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      fullname: '',
      gender: '',
      email: '',
      password: '',
      threshold: '',         
    };
  }

  static navigationOptions = {
    title: 'Setup',
  };

  componentDidMount() {
    console.log('SetupScreen Component Mounted')
  }
  
  render() {
    return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{margin: 20, fontSize: 20}}>Please enter your information to setup your profile:</Text> 

          <View style={{flex: 1, justifyContent: 'flex-start'}}>
            <TextInput
                style={TextStyles.TI}
                placeholder="Full Name"
                placeholderTextColor="#908887"
                onChangeText={(fullname) => this.setState({fullname})}
                value={this.state.fullname}
            /> 
            <TextInput
                style={TextStyles.TI}
                placeholder="Gender"
                placeholderTextColor="#908887"
                onChangeText={(gender) => this.setState({gender})}
                value={this.state.gender}
            /> 
            <TextInput
                style={TextStyles.TI}
                placeholder="Email"
                placeholderTextColor="#908887"
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}
            /> 
            <TextInput
                style={TextStyles.TI}
                placeholder="Password"
                placeholderTextColor="#908887"
                onChangeText={(password) => this.setState({password})}
                value={this.state.password}
            /> 
            <TextInput
                style={TextStyles.TI}
                placeholder="Vocal Threshold"
                placeholderTextColor="#908887"
                onChangeText={(threshold) => this.setState({threshold})}
                value={this.state.threshold}
            /> 
          </View>
          <View style={{flex: 1}} ></View>

          <View style={{margin: 20, alignSelf: 'stretch'}}>
            <Button
                title="Continue To Your Dashboard"
                color="rgb(0, 51, 160)"
                onPress={() => this.props.navigation.navigate('Dash')}
            />
          </View>
        </View>
    );
  }
}

const TextStyles = StyleSheet.create({
  TI: {
    height: 20, 
    margin: 20, 
    color: 'black', 
    borderBottomColor: 'gray', 
    borderBottomWidth: 2
  }
});