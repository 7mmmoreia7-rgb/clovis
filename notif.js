(function(){
  var SURL='https://itqzgxotbzsuwevjpnoi.supabase.co';
  var SKEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0cXpneG90YnpzdXdldmpwbm9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MDU4NTgsImV4cCI6MjA4NzI4MTg1OH0.nS4RuwfULc9uHGh_u93vLZ7uRsLnKl7NULrb2Yesw9k';
  var HDR={'apikey':SKEY,'Authorization':'Bearer '+SKEY};
  var SOM=new Audio('https://pub-4f2a2814e5924e32b4d88e68fc0f96d1.r2.dev/comuns/notifica%C3%A7ao.mp3');
  SOM.preload='auto';
  var ultimoId=0;
  var iniciado=false;

  // desbloqueia o som no primeiro clique/toque
  function desbloquear(){
    SOM.play().then(function(){SOM.pause();SOM.currentTime=0;}).catch(function(){});
    document.removeEventListener('click', desbloquear);
    document.removeEventListener('touchstart', desbloquear);
    iniciado=true;
  }
  document.addEventListener('click', desbloquear);
  document.addEventListener('touchstart', desbloquear);

  // busca o último id atual
  fetch(SURL+'/rest/v1/mensagens?select=id&order=id.desc&limit=1',{headers:HDR})
    .then(function(r){return r.json();})
    .then(function(d){
      if(d&&d.length)ultimoId=d[0].id;
    });

  // verifica de 2 em 2 segundos
  setInterval(function(){
    if(!ultimoId)return;
    fetch(SURL+'/rest/v1/mensagens?select=id&id=gt.'+ultimoId+'&order=id.desc&limit=1',{headers:HDR})
      .then(function(r){return r.json();})
      .then(function(d){
        if(!d||!d.length)return;
        ultimoId=d[d.length-1].id;
        if(!iniciado)return;
        try{
          var s=SOM.cloneNode();
          s.volume=0.7;
          s.play().catch(function(){});
        }catch(e){}
      });
  },2000);
})();
