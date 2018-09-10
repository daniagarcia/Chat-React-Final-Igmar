'use strict'
import React, {Component} from 'react';
import {View,TextInput,Text,StyleSheet,FlatList,AsyncStorage, ActivityIndicator}from 'react-native'


export default class UsuariosGrupos extends Component{

    constructor(props){
        super(props);
        this.state = {
            users:[],
            groups:[],
            isLoading:true
        }
      }

    render(){
        if(this.state.isLoading){
            return(
              <View style={{flex: 1, padding: 20}}>
                <ActivityIndicator></ActivityIndicator>
              </View>
            )
          }
      
          return(
            <View style={styles.container}>
               <Text>USUARIOS</Text>
              <FlatList 
                   data={this.state.users}
                   renderItem={({item}) => <Text style={styles.usuarios} onPress={() => this.abrirConversacion(item.id, item.username, 'privado')}>{item.username}</Text>}
              />
              <Text>GRUPOS</Text>
              <FlatList  
                   data={this.state.groups}
                   renderItem={({item}) => <Text style={styles.usuarios}  onPress={() => this.abrirConversacion(item.id, item.nombre, 'grupo')}>{item.nombre}</Text>}
              />
            </View>
          );
    }

    componentDidMount(){
         fetch('http://192.168.1.130:3333/users',{
            method: 'GET',
         })
         .then((response) => response.json())
         .then((responseJson) => {
            this.setState({
                isLoading: false,
                users: responseJson.users,
              }, function(){})
         }).catch((error) =>{
            console.error(error);
          });
          this.CargarGrupos()
          
        }

        async CargarGrupos(){
          var idusuario = await AsyncStorage.getItem('id_usuario')
          fetch('http://192.168.1.130:3333/grupos/' + idusuario,{
            method: 'GET',
         })
         .then((response) => response.json())
         .then((responseJson) => {
           console.log(responseJson)
            this.setState({
                isLoading: false,
                groups: responseJson,
              }, function(){})
         }).catch((error) =>{
            console.error(error);
          });
        }
        
        abrirConversacion(idUsuario, username, tipo){
            AsyncStorage.setItem('id_usuario2',idUsuario.toString())
            AsyncStorage.setItem('username_remitente',username)
            AsyncStorage.setItem('tipo', tipo)
            this.props.navigation.navigate('Chats') 
        }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff'
    },
    usuarios:{
      marginTop:5,
      fontSize:20,
      fontWeight: 'bold',
      backgroundColor:'#CEB0CA',
      height:30

    },
})

