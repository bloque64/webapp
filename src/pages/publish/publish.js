import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import './publish.css';
const R = require('ramda');
const base64 = require('base-64');


class Articulo extends Component{
  constructor(props){
    super(props);
    this.findQuery=this.findQuery.bind(this);
    this.state={
      id:0,
      titulo:"",
      cuerpo:"",
      articles:""
    }
    this.sendData=this.sendData.bind(this);
    this.setData=this.setData.bind(this);
    this.getDia=this.getDia.bind(this);
    this.getMes=this.getMes.bind(this);
    this.titulo="";
    this.cuerpo="";
  }
  getDia(){
    const fecha=new Date();
    const days=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
    let dayName;
    dayName="";
    for (var i = 0; i <= days.length; i++) {
      if((fecha.getDay())===i){
        dayName=days[i];
        return dayName;
        break;
      }
    }
  }
  getMes(){
    const fecha=new Date();
    let mes;
    mes="";
    const months=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio",
                  "Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    for (var i = 0; i < months.length; i++) {
      if(fecha.getMonth()===i){
        mes=months[i];
        return mes;
        break;
      }
    }
  }
  findQuery(){
    const parseSearchString = R.compose(
      R.fromPairs,
      R.map(R.split('=')),
      R.split('&'),
      R.slice(1, Infinity));

    const q = parseSearchString(window.location.search);
    return q;
  }
  setData(authorData,titleData,bodyData){
    const jsonData={
      "autor": authorData,
      "title": titleData,
      "cuerpo": bodyData,
      "votado": false,
      "publicado": true
    }
    return jsonData;
  }

sendData(event){
  const data=this.setData("victor",this.state.articles.title,this.state.articles.cuerpo);
  const finalData=JSON.stringify(data);
  const url="http://138.201.188.83:8000/steemit/";
  const url2="http://138.201.188.83:8000/publicaciones/"+this.state.id+"/";



    fetch(url,{
      method: "POST",
      body: finalData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    }).then(res => {console.log(res)
        alert("¡Artículo seleccionado!")

    })
    .catch(function(error) {
      console.log('There has been a problem with your fetch operation: ', error.message);
    });

    fetch(url2,{
      method: "DELETE",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    }).then(res => {console.log(res)
    })
    .catch(function(error) {
      console.log('There has been a problem with your delete operation: ', error.message);
    });
    console.log("/finaldata=", finalData);


}
  componentWillMount(){
    this.setState({id:parseInt(this.findQuery().article)});

   }
   componentDidMount(){

     fetch("http://138.201.188.83:8000/publicaciones/"+this.state.id+"/",{
       method:"GET",
       mode:'cors',
       credentials:'include'

     }).then((response) => {
          return response.json()
      }).then((json) => {
           console.log('parsed json', json)
           this.setState({articles:json});
      }).catch(function(ex) {
        console.log('parsing failed', ex)
      });



  }

  render(){

      const fecha=new Date();
      let fechaString=this.getDia()+", "+fecha.getDate()+" de "+this.getMes()+" de "+fecha.getFullYear().toString();

    return(
    <div className="contenido">
      <div className="header">
        <div  className="clearfix">
            <div className="logo clearfix">
              <h1 className="logo">Bloque64Logo</h1>
            </div>
            <span id="fecha">{fechaString}</span>
          </div>
        </div>
        <div className="previewPage">
           <h1>{this.state.articles.title}</h1>
            <p>{this.state.articles.cuerpo}</p>
            <input type="button" value="publicar" onClick={this.sendData}/>
            <Link to="/test/publishlist"><button><p>Volver</p></button></Link>
        </div>
      </div>

    );

  }

}

export default Articulo;
