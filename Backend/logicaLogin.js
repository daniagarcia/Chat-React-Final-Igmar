'use strict'
export class logicaLogin{
 
    //  constructor(props){
    //      super(props)
    //      this.state={}

    // }

    async login() {
        try{
            let response = await fetch(
               ' http://127.0.0.1:3333/login'
            );
            let responseJsonLogin = await response.json();
            return responseJsonLogin
        }catch(error){
            console.error(error)
        }
    }


}