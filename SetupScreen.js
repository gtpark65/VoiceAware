import React, { Component } from 'react';
import { Text, View, Button, TextInput } from 'react-native';

export class SetupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      fullname: 'Full',
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

          <View style={{flex: 1, justifyContent: 'space-around'}}>

            <TextInput
                style={{height: 20, margin: 20}}
                placeholder="Full Name"
                onChangeText={(fullname) => this.setState({fullname})}
                value={this.state.fullname}
            /> 
            <TextInput
                style={{height: 20, margin: 20}}
                placeholder="Gender"
                onChangeText={(gender) => this.setState({gender})}
                value={this.state.gender}
            /> 
            <TextInput
                style={{height: 20, margin: 20}}
                placeholder="Email"
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}
            /> 
            <TextInput
                style={{height: 20, margin: 20}}
                placeholder="Password"
                onChangeText={(password) => this.setState({password})}
                value={this.state.password}
            /> 
            <TextInput
                style={{height: 20, margin: 20}}
                placeholder="Vocal Threshold"
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