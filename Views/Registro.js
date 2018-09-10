'use strict'
import React, {Component} from 'react';
import {View,TextInput,Text,StyleSheet,TouchableHighlight,Button,AsyncStorage}from 'react-native'
import logicaLogin from '../Backend/logicaLogin'
import {createStackNavigator} from 'react-navigation';

export default class Registro extends Component{
    render(){
        return(
            <View style={styles.container}>
            
                <Text style={styles.textos}>Usuario</Text>
                <TextInput style={styles.cuadro}
                onChangeText={(text) => this.usuario = text}></TextInput>                 
                <Text style={styles.textos}>Correo</Text>
                <TextInput style={styles.cuadro}
                 onChangeText={(text) => this.correo = text}></TextInput>                 
                <Text style={styles.textos}>Contraseña</Text>
                <TextInput style={styles.cuadro}
                onChangeText={(text) => this.password = text}></TextInput>                 
                <TouchableHighlight  onPress={() => this.Registrar()} style={styles.botonR}>
                     <Text style={styles.textobontonR}>Registrar</Text>
                </TouchableHighlight>
            </View>
        )
    }
usuario;
correo;
password;

formaData = new FormData();

    Registrar(){
        this.formaData.append('usu',this.usuario)
        this.formaData.append('email',this.correo)
        this.formaData.append('psw',this.password)

        try{
            fetch('http://192.168.1.130:3333/insertarUser',{
                method:'POST',
                body: this.formaData,                
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if(responseJson){
                    this.props.navigation.navigate('Home') 
                }
            }).done();
        }catch(error){
            console.log(error)
        }


        
        
        
    }
}

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
