'use strict'
import React from 'react';
import { StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
  FlatList,
  Image,
  AsyncStorage,
  ScrollView
} from 'react-native';
import Ws from '@adonisjs/websocket-client';
const ws = Ws('ws://192.168.43.151:3333')



const NAME = '@realDonaldTrump';
const CHANNEL = 'Random';
const AVATAR =
  'https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg';

  export default class ChatView extends React.Component{
    constructor(props){
      super(props);
      this.state = {
          mensajes:[],
          mensaje:'',
          idUsuario: '',
          input:{},
          scroll:{}
      }
    }

    render(){
      
        return(
            <View style={styles.container}>

                <ScrollView  ref={(scroll) => this.state.scroll = scroll }>
                                  
				           {this.MostrarMsj()}
				         </ScrollView>

                <KeyboardAvoidingView behavior="padding">
                <View style={styles.footer}>
                    <TextInput
                    value={this.state.mensaje}
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="Escribe tu mensaje.."
                    onChangeText={(text) => this.setState({ mensaje: text })}
                    ref={(input) => this.state.input = input }/>
                    <TouchableOpacity onPress={() => this.GuardarMensajes()}>
                    <Text style={styles.send}>Enviar</Text>
                    </TouchableOpacity>
                </View>
                </KeyboardAvoidingView>
      </View>
        )
    }

    componentDidMount(){
      ws.connect()
      this.recuperandoValores();
    }

     MostrarMsj() {
      var idUsuario =  this.state.idUsuario
      return this.state.mensajes.map((x, index) => {
          if(idUsuario==x.id_usuario){
            return( 
              <View style={styles.rowDer} >
              <Text style={styles.message2}>{x.mensajes}</Text>
              </View>
      )
          }else{
            return( 
              <View style={styles.rowIzq}>
              <Text style={styles.message2}>{x.mensajes}</Text>
              </View>
      )
          }
        
      })
  }
     async recuperandoValores(){
      var idUsuario = await AsyncStorage.getItem('id_usuario')
      var idUsuario2 = await AsyncStorage.getItem('id_usuario2')
      var tipo = await AsyncStorage.getItem('tipo')

      this.state.idUsuario = idUsuario

      if(tipo == 'privado'){
        var UserArray = [idUsuario,idUsuario2]
      UserArray.sort()
      var ArrayUsers = UserArray.join('_')    
      
      fetch('http://192.168.43.151:3333/chats/'+ArrayUsers,{
         method: 'GET',
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
         this.setState({
          mensajes:responseJson
           }, function(){})
      }).catch((error) =>{
         console.error(error);
       });
       this.subscribirCanal(ArrayUsers)

      }else {
        fetch('http://192.168.43.151:3333/chats/'+idUsuario2,{
          method: 'GET',
       })
       .then((response) => response.json())
       .then((responseJson) => {
         console.log(responseJson)
          this.setState({
           mensajes:responseJson
            }, function(){})
       }).catch((error) =>{
          console.error(error);
        });
        this.subscribirCanal(idUsuario2
        )
      }
     }
    
     async GuardarMensajes(){
      
      var idUsuario2 = await AsyncStorage.getItem('id_usuario2')
      var tipo = await AsyncStorage.getItem('tipo')

      if(this.state.mensaje.trim() != ''){

    
      if(tipo == 'privado' ){
        var UserArray = [this.state.idUsuario,idUsuario2]
        UserArray.sort()
        var ArrayUsers = UserArray.join('_')  
        var tipo = await AsyncStorage.getItem('tipo')
  
        var fromData = new FormData
        fromData.append('mensaje', this.state.mensaje)
        fromData.append('id_usuario', this.state.idUsuario)
        fromData.append('UsersArray', ArrayUsers)
  
        try{         
          let response = await fetch('http://192.168.43.151:3333/chats', {
              method: 'POST',
              body: fromData,
              }).then( () => {
                
              });
              this.state.mensajes.push(this.state.mensaje)
              ws.getSubscription('chat:'+ArrayUsers).emit('message','prueba')
              this.componentDidMount()
          }catch(error){
              console.log(error)
          }

      }else{
        var fromData = new FormData
        fromData.append('mensaje', this.state.mensaje)
        fromData.append('id_usuario', this.state.idUsuario)
        fromData.append('UsersArray', idUsuario2)
  
        try{         
          let response = await fetch('http://192.168.43.151:3333/chats', {
              method: 'POST',
              body: fromData,
              }).then( () => {
                
              });
              this.state.mensajes.push(this.state.mensaje)
              ws.getSubscription('chat:'+idUsuario2).emit('message','prueba')
              this.componentDidMount()
          }catch(error){
              console.log(error)
          }


      }
      this.state.scroll.scrollToEnd(true);
      this.state.input.clear()
    }
    
    }

  
    canal;
    subscribirCanal(room) {
      console.log(room)
      this.canal = ws.subscribe('chat:'+room)  
  
      this.canal.on('error', data => {
  
      })
  
      this.canal.on('message', data => {
        this.componentDidMount()    
      })
      this.canal.on('entrar', data => {
        console.log('acaba de entrar un usuario')
      })
  
      this.canal.on('close', data => {
  
      })
  
    }

}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff'
    },
    row: {
      flexDirection: 'row',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#eee'
    },
    avatar: {
      borderRadius: 20,
      width: 40,
      height: 40,
      marginRight: 10
    },
    rowText: {
      flex: 1
    },
    message1: {
      fontSize: 18,
      color:'purple'
    },
    message2: {
      fontSize: 18,
      color:'white'
    },
    sender: {
      fontWeight: 'bold',
      paddingRight: 10
    },
    footer: {
      flexDirection: 'row',
      backgroundColor: '#eee'
    },
    input: {
      paddingHorizontal: 20,
      fontSize: 18,
      flex: 1
    },
    send: {
      alignSelf: 'center',
      color: 'lightseagreen',
      fontSize: 16,
      fontWeight: 'bold',
      padding: 20
    },
    rowIzq:{
      marginTop:1,
      fontWeight: 'bold',
      paddingRight: 15,
      backgroundColor:'purple',
      alignSelf:'flex-start',
      borderRadius:20,
      borderColor: 'purple',
      borderWidth:1,
      color:'purple'
    },
    rowDer:{
      marginTop:1,
      fontWeight: 'bold',
      paddingLeft: 15,
      paddingRight: 10,
      backgroundColor:'purple',
      alignSelf:'flex-end',
      borderRadius:20,

    },
    textobontonR:{
      color:'white'

  },
  textobonton:{
      color:'purple'

  },

  });