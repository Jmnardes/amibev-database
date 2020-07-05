function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function preparar_cep(val){
  
    /* Faço uma validação bem rápida para saber se realmente é um cep */
    if( isNaN(val.replace(/\D+/g, '')) ) return false; // verifica se tem só numeros
    if( val.replace(/\D+/g, '').length != 8 ) return false; // verifica se os numeros tem tamanho de 8 caracteres
  
    return httpGet('https://viacep.com.br/ws/'+ val +'/json/');
}