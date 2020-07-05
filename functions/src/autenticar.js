class ValidaFormulario {
    constructor() {
        this.formulario = document.querySelector('.formulario');
        this.eventos();
    }

    eventos() {
        this.formulario.addEventListener('submit', e => {
            this.handleSubmit(e);
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const camposValidos = this.camposValidos();
        const senhasValidas = this.senhasValidas();

        if(camposValidos && senhasValidas) {
            cadastrarCliente();
        }
    }

    senhasValidas() {
        let valid = true;

        const senha = this.formulario.querySelector('.senha');
        const repetirSenha = this.formulario.querySelector('.repetir-senha');

        if(senha.value !== repetirSenha.value) {
            valid = false;
            this.criaErro(senha, 'As senhas devem ser idênticas.');
        }

        if(senha.value.length < 6) {
            valid = false;
            this.criaErro(senha, 'Senha precisa no mínimo 6 caracteres');
        }

        return valid;
    }

    camposValidos() {
        let valid = true;

        for( let errorText of this.formulario.querySelectorAll('.error-text')) {
            errorText.remove()
        }

        for( let campo of this.formulario.querySelectorAll('.validar')) {
            const label = campo.previousElementSibling.innerText;
            if(!campo.value) {
                this.criaErro(campo, `${label} não pode estar em branco.`);
                valid = false;
            }

            if(campo.classList.contains('cpf')) {
                if(!this.validaCPF(campo)) valid = false;
            }

            if(campo.classList.contains('cnpj')) {
                if(!this.validaCNPJ(campo)) valid = false;
            }

            if(campo.classList.contains('cep')) {
                if(!this.validaCEP(campo)) valid = false;
            }
        }

        return valid;
    }

    validaCPF(campo) {
        const cpf = validaCPF(campo.value);

        if(!cpf.valida()) {
            this.criaErro(campo, 'CPF inválido.');
            return false;
        }

        return true;
    }

    validaCNPJ(campo) {
        const cnpj = validaCNPJ(campo.value);
        
        if(!cnpj) {
            this.criaErro(campo, 'CNPJ inválido.');
            return false;
        }

        return true;
    }

    validaCEP(campo){
        const cep = validaCEP(campo.value);
        
        if(!cep) {
            this.criaErro(campo, 'CEP inválido.');
            return false;
        }
        return true;
    }

    criaErro(campo, msg) {
        const div = document.createElement('div');
        div.innerHTML = msg;
        div.classList.add('error-text');
        campo.insertAdjacentElement('afterend', div);
    }
}

const valida = new ValidaFormulario();