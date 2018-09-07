'use strict'
import React, {Component} from 'react';
import {View,TextInput,Text,StyleSheet,TouchableHighlight,Button,AsyncStorage}from 'react-native'
import logicaLogin from '../Backend/logicaLogin'
import {createStackNavigator} from 'react-navigation';

export default class LoginView extends Component{
    render(){
        return(
            <View style={styles.container}>
            
                <Text style={styles.textos}>Usuario</Text>
                <TextInput style={styles.cuadro}
                onChangeText={(text) => this.usuario = text}></TextInput>                 
                <Text style={styles.textos}>Contraseña</Text>
                <TextInput style={styles.cuadro}
                 onChangeText={(text) => this.password = text}></TextInput>
                <TouchableHighlight  onPress={() => this.PeticionLogin()} style={styles.boton}>
                     <Text style={styles.textobonton}>LOGIN</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.botonR}>
                     <Text onPress={() => this.Registro()} style={styles.textobontonR}>Registrar</Text>
                </TouchableHighlight>
            </View>
        )
    }

    usuario;
    password;
    formData = new FormData();
    async PeticionLogin(){
        this.formData.append("usu", this.usuario)
        this.formData.append("psw", this.password)
        try{  
         fetch('http://192.168.43.151:3333/login', {
            method: 'POST',
            body: this.formData,
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if(responseJson.sesion.type){
                    AsyncStorage.setItem('id_usuario',responseJson.usuario.id.toString())
                    AsyncStorage.setItem('username',responseJson.usuario.username)
                    this.props.navigation.navigate('Contactos') 
                }
            }).done();         
        }catch(error){
            console.log(error)
        }
    }

    Registro(){
        this.props.navigation.navigate('Registro') 
    }

}



module.exports = LoginView



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    boton:{
        width:200,
        height:40,
        backgroundColor:'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:50,
        marginBottom:10,
        borderRadius:8,
        borderWidth:1,
        borderColor: 'purple'   
        
     },
     botonR:{
        width:200,
        height:40,
        backgroundColor:'purple',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:10,
        marginBottom:10,
        borderRadius:8,
        borderWidth:1,
        borderColor: 'purple'   
        
     },
     textobontonR:{
        color:'white'

    },
    textobonton:{
        color:'purple'

    },
    textos:{
      fontSize:18  
    },
    cuadro:{
        width:300,
        height:40,
        marginTop:10,
        marginBottom:10
    }
})

// var dataObj = {}
// dataObj.uname = uname,
// dataObj.password = password

// fetch("http://192.168.0.11:3333/login", {
//   method: 'post',
//   headers: {
//     'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify(dataObj)
// })
// .then((response) => response.json())
// .then((responseData) => {
//   AlertIOS.alert(
//       "POST Response",
//       "Response Body -> " + JSON.stringify(responseData.body)
//   )
// }).done();
//     this.props.navigation.navigate("Chats")
// };