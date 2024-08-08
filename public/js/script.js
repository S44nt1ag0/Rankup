$("#sign").on("click", function(){
    window.location.href = "/sign"
});

$("#voltar").on("click", function(){
    window.location.href = "/"
});

$(".back").on("click", function(){
    window.location.href = "/dash"
});

$("#cadastrar").on("click", function(){
    window.location.href = "/signup"
});

$(".me").on("click", function(){
    window.location.href = "/dash"
});

$("#grupo").on("click", function(){
    window.location.href = "/team"
});

$("#usuarios").on("click", function(){
    window.location.href = "/usuarios"
});

$("#dash").on("click", function(){
    window.location.href = "/dash"
});

$("#adversario").on("click", function(){
    window.location.href = "/enemy"
});

$("#inscrever").on("click", function(){
    window.location.href = "/signup"
});

$('#error-voltar').on("click", function(){
    window.location.href = "/"
})

$('#nav-error-voltar').on("click", function(){
    window.location.href = "/"
})

$("#logo").on("click", function(){
    window.location.href = "/dash"
});

$("#order").on("click", function(){
    window.location.href = "/order"
});

$("#back-painel").on("click", function(){
    window.location.href = "/admin"
})

$("#chaves").on("click", function(){
    window.location.href = "/chaves"
})

$("#ver").click(function(){
    $(".box-grupo-ver").fadeToggle();
});

$('#entrar-admin').on("click", function(){
    
    let usuario = $('#usuario').val();
    let senha = $('#senha').val();

    if(!usuario || !senha){

        new Notify ({
            title: 'Erro',
            text: "Falta Parametros",
            status: 'error'
        })

        return;
    }

    $.post("/login/admin", { usuario: usuario, senha: senha}, function(data){

        if(data.error == false){

            new Notify ({
                title: 'Logado',
                text: data.msg,
                status: 'success'
            })

            setTimeout(() => {
                window.location.href = "/admin"
            }, "1000");

        } else {

            new Notify ({
                title: 'Erro',
                text: data.msg,
                status: 'error'
            })

        }

    });

})

$("#copiar-sati").click(function(){

    navigator.clipboard.writeText("santiago20098");

    new Notify ({
        title: 'Copiado',
        text: "ID Discord Copiado",
        status: 'success'
    })

});

$("#copiar-duh").click(function(){

    navigator.clipboard.writeText("_duuh.ehz");

    new Notify ({
        title: 'Copiado',
        text: "ID Discord Copiado",
        status: 'success'
    })

});

$("#sair").on("click", function(){
    $.get("./api/sair", function( data ) {

        if(!data) {
            alert("nao foi possivel sair")
        }

        if(data.error == false){
            
            new Notify ({
                title: 'Deslogado',
                text: data.msg,
                status: 'success'
            })

            setTimeout(() => {
                window.location.href = "/"
            }, "1000");
            
        } else {
            
            new Notify ({
                title: 'Erro',
                text: data.msg,
                status: 'error'
            })

        }

    });
});

$("#add-equipe").on("click", function(){

    let participantes = [];

    participantes.push($('#participante1').val());
    participantes.push($('#participante2').val());

    if (participantes.length !== 2) {
        new Notify ({
            title: 'Erro',
            text: "Você deve adicionar 2 participantes!",
            status: 'error'
        });
        return;
    }

    adicionarParticipante(participantes, 0);

});

function adicionarParticipante(participantes, index){

    if (index >= participantes.length) {
        
        setTimeout(() => {
            window.location.href = "/team"
        }, "1000");

        return;
    }

    let participante = participantes[index];

    $.post("/api/participante", { nome: participante }, function(data) {

        if(data.error == false){

        new Notify ({
            title: `Participantes ${participante} Cadastrado`,
            text: data.msg,
            status: 'success'
        })
    
        } else {

            new Notify ({
                title: 'Erro',
                text: data.msg,
                status: 'error'
            })

        }

        adicionarParticipante(participantes, index + 1);
    });

}

$("#create-grupo").on("click", function(){

    let nome_grupo = $('#nome_grupo').val();

    $.post("/api/create", { nome: nome_grupo }, function(data) {
    
        if(data.error == false){

        new Notify ({
            title: 'Cadastrado',
            text: data.msg,
            status: 'success'
        })

        setTimeout(() => {
            window.location.href = "/team"
        }, "1000");

        } else {

            new Notify ({
                title: 'Erro',
                text: data.msg,
                status: 'error'
            })

        }

    });
});

$("#criar").on("click", function(){
    $(".nenhum-grupo").fadeOut("slow", function(){
        $(".criar-grupo").fadeIn("slow");
    });
})


$("#cadastro").on("click", function(){

    let usuario = $('#usuario').val();
    let senha = $('#senha').val();
    let email = $('#email').val();

    $.post("./api/cadastrar", { usuario: usuario, senha: senha, email: email}).done(function(data){

        if(!data){
            
            new Notify ({
                title: 'Erro',
                text: "Erro Interno",
                status: 'error'
            })

            return;
        }
        
        if(data.error == true){
          
            new Notify ({
                title: 'Erro',
                text: data.msg,
                status: 'error'
            })

            return;

        } else {

            new Notify ({
                title: 'Cadastrado',
                text: data.msg,
                status: 'success'
            })

            setTimeout(() => {
                window.location.href = "/sign"
            }, "1000");

        }

    });

})

$("#entrar").on("click", function() {

    let usuario = $('#usuario').val();
    let senha = $('#senha').val();

    $.post("./api/logar", { usuario: usuario, senha: senha }).done(function(data) {

        if(!data){
            new Notify ({
                title: 'Erro',
                text: "Erro Interno",
                status: 'error'
            })
            return;
        }

        if(data.error == true){

            new Notify ({
                title: 'Erro',
                text: data.msg,
                status: 'error'
            })

            return;

        } else {
            
            new Notify ({
                title: 'Logado',
                text: data.msg,
                status: 'success'
            })

            setTimeout(() => {
                window.location.href = "/dash"
            }, "1000");

        }

    });

});

function animateProgressBar() {

    var animationDuration = 300000;
    
    $('.progress-bar').animate({
        width: '0%'
    }, animationDuration, 'linear');
}

$('#recibo').click(function(){

    var transacao = $('#transacao').text();

    if($(this).text() === " Baixar Recibo "){

        var url = `./recibos/${transacao}.txt`;
        var fileName = url.substring(url.lastIndexOf('/')+1);
        var link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        $(this).text('Continuar');

    } else {
        window.location.href = "/dash"
    }
});

$("#pagar").click(function(){

    $.get("/api/gerar/pix", function(data) {

        if(!data){

            new Notify ({
                title: 'Erro',
                text: "Pix nao gerado!",
                status: 'error'
            })

            return;
        }

        let qr_code_image = `data:image/png;base64,${data.data.qr_code_image}`;
        let qr_code = data.data.qr_code;
        let id_transacao = data.data.id;

        if(!qr_code_image || !qr_code || !id_transacao){

            new Notify ({
                title: 'Erro',
                text: "erro ao gerar pix",
                status: 'error'
            })

            return;
        }

        $("#qr_code").attr('src', qr_code_image);
        $('#copia_cola').text(qr_code);
        $('#transacao').text(id_transacao);

        $(".pix-container").fadeOut("slow", function(){
            $(".pix-pagar").fadeIn("slow");
            loop_pix(id_transacao);
            animateProgressBar(id_transacao);
        });

    });

});

function loop_pix(transacao){

    function verificarEstado(transacao) {
    
        $.get(`/api/consulta/pix/${transacao}`, function(data) {
          
            if (data.error == false) {
                
                new Notify ({
                    title: 'Sucesso',
                    text: "Pagamento Confirmado",
                    status: 'success'
                })

                $('#tax_id').text(data.dados.id_transacao);
                $('#id_pix').text(data.dados.id_pagamento);
                area_comprovante()

            } else {

                setTimeout(function() {
                    verificarEstado(transacao)
                }, 5000)

            }
        });
    }

    verificarEstado(transacao);

}

function area_comprovante(){
    $(".pix-pagar").fadeOut("slow", function(){
        $(".pix-sucesso").fadeIn("slow");
    }); 
}

$("#pix-paguei").click(function(){
    
    var transacao = $('#transacao').text();

    $.get(`/api/consulta/pix/${transacao}`, function(data) {

        if (data.error == false) {
            
            new Notify ({
                title: 'Sucesso',
                text: "Pagamento Confirmado",
                status: 'success'
            })

            $('#tax_id').text(data.dados.id_transacao);
            $('#id_pix').text(data.dados.id_pagamento);
            area_comprovante()

        } else {
            
            new Notify ({
                title: 'Erro',
                text: "Pix Não Pago!",
                status: 'error'
            })

        }

    });

})

$(window).on('load', function() {
    $('.pre-loader').addClass('hidden');
});

const btnCopy = document.querySelector('#copiar');
const textArea = document.querySelector('textarea');

btnCopy.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(textArea.value);

    new Notify ({
        title: 'Copiado',
        text: "Codigo Pix Copiado",
        status: 'success'
    })

});

function em_breve(){

    new Notify ({
        title: 'Breve',
        text: "Em Breve",
        status: 'success'
    })

}
