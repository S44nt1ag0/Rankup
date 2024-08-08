const axios = require('axios');

const webhook = "https://discord.com/api/webhooks/1237175383216881694/O48RNDlCRyu08L8si7UiIGvlaUECvO1ci_LEgan5XqzV4Y14U58qQ-J2uLbT9g250UjV";

function webhook_pago(){
    axios.post(webhook, `{"embeds":[{"title":"Pagamento Recebido","color":5763719,"fields":[{"name":"Valor Debitado -> 3$","value":"Equipe Anarquia Agradece  :heart: "}]}]}`, {
        headers: {
          'Content-Type': 'application/json' 
        }
    }).then(response => {
        console.log({error:false, msg:"WebHook Pagamento Enviado"})
    }).catch(error => {
        console.log({error:true, msg:"Erro ao enviar WebHook Pagamento"})
    }) 
}

module.exports = {
    webhook_pago
}