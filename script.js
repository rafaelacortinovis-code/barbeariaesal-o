// SISTEMA BARBEARIA - FUNCIONALIDADE COMPLETA
class SistemaBarbearia {
    constructor() {
        this.agendamentosKey = 'agendamentos_estilo_perfeito';
        this.init();
    }

    init() {
        this.carregarAgendamentosCliente();
        this.carregarAgendaProfissional();
        this.carregarHistoricoProfissional();
        
        // Formulário novo agendamento
        const form = document.getElementById('formAgendamento');
        if (form) {
            form.addEventListener('submit', (e) => this.novoAgendamento(e));
        }
    }

    novoAgendamento(e) {
        e.preventDefault();
        
        const profissional = document.getElementById('profissionalSelect').value;
        const servicoData = document.getElementById('servicoSelect').value.split('|');
        const servico = servicoData[0];
        const preco = servicoData[1];
        const data = document.getElementById('dataAgendamento').value;
        const horario = document.getElementById('horarioSelect').value;

        // Verificar conflito
        const agendamentos = this.getAgendamentos();
        const conflito = agendamentos.find(ag => 
            ag.profissional === profissional && 
            ag.data === data && 
            ag.horario === horario
        );

        if (conflito) {
            alert('❌ Horário já ocupado!');
            return;
        }

        // Novo agendamento
        const novoAgendamento = {
            id: Date.now(),
            cliente: 'João Silva',
            profissional,
            servico,
            preco,
            data,
            horario,
            status: 'confirmado',
            dataCriacao: new Date().toISOString()
        };

        agendamentos.unshift(novoAgendamento);
        localStorage.setItem(this.agendamentosKey, JSON.stringify(agendamentos));
        
        alert('✅ Agendamento confirmado!');
        e.target.reset();
        this.carregarAgendamentosCliente();
    }

    carregarAgendamentosCliente() {
        const agendamentos = this.getAgendamentos();
        const meusAgendamentos = agendamentos.filter(ag => ag.cliente === 'João Silva');
        const container = document.getElementById('listaAgendamentos');
        
        if (!container) return;

        container.innerHTML = meusAgendamentos.map(ag => `
            <div class="agendamento-nike ${ag.status}">
                <div class="data-nike">${this.formatarData(ag.data)}</div>
                <div class="info-agendamento-nike">
                    <h4>${ag.servico}</h4>
                    <p>${this.getNomeProfissional(ag.profissional)} • ${ag.horario} • ${ag.preco}</p>
                    <div class="botoes-agendamento">
                        <button onclick="barbearia.editarAgendamento(${ag.id})" class="btn-editar">Editar</button>
                        <button onclick="barbearia.cancelarAgendamento(${ag.id})" class="btn-cancelar">Cancelar</button>
                    </div>
                    <div class="status-nike futuro-nike">${ag.status.toUpperCase()}</div>
                </div>
            </div>
        `).join('') || '<p style="text-align:center;color:#666">Nenhum agendamento encontrado</p>';
    }

    carregarAgendaProfissional() {
        const agendamentos = this.getAgendamentos();
        const hoje = '2026-02-25'; // Data fixa para demo
        const agendaHoje = agendamentos.filter(ag => ag.data === hoje);
        const container = document.getElementById('agendaProfissional');
        
        if (!container) return;

        const horarios = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
        container.innerHTML = horarios.map(horario => {
            const ag = agendaHoje.find(a => a.horario === horario);
            if (ag) {
                return `
                    <div class="horario-nike cliente-nike" data-id="${ag.id}">
                        <div class="hora-nike">${horario}</div>
                        <div class="cliente-nike">
                            <h4>${ag.cliente}</h4>
                            <p>${ag.servico} • ${ag.preco}</p>
                        </div>
                        <div class="botoes-agenda-profissional">
                            <button onclick="barbearia.concluirAgendamento(${ag.id})" class="btn-concluir-nike">Concluir</button>
                            <button onclick="barbearia.editarAgendamento(${ag.id})" class="btn-editar">Editar</button>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="horario-nike livre">
                        <div class="hora-nike">${horario}</div>
                        <div class="status-nike">LIVRE</div>
                    </div>
                `;
            }
        }).join('');
    }

    editarAgendamento(id) {
        const agendamentos = this.getAgendamentos();
        const ag = agendamentos.find(a => a.id === id);
        
        const novoServico = prompt('Editar serviço:', ag.servico);
        const novoHorario = prompt('Editar horário (HH:MM):', ag.horario);
        
        if (novoServico && novoHorario) {
            ag.servico = novoServico;
            ag.horario = novoHorario;
            localStorage.setItem(this.agendamentosKey, JSON.stringify(agendamentos));
            
            this.carregarAgendamentosCliente();
            this.carregarAgendaProfissional();
            alert('✅ Agendamento atualizado!');
        }
    }

    concluirAgendamento(id) {
        const agendamentos = this.getAgendamentos();
        const ag = agendamentos.find(a => a.id === id);
        ag.status = 'concluido';
        localStorage.setItem(this.agendamentosKey, JSON.stringify(agendamentos));
        
        this.carregarAgendaProfissional();
        alert('✅ Serviço marcado como concluído!');
    }

    cancelarAgendamento(id) {
        if (confirm('Cancelar este agendamento?')) {
            const agendamentos = this.getAgendamentos().filter(a => a.id !== id);
            localStorage.setItem(this.agendamentosKey, JSON.stringify(agendamentos));
            
            this.carregarAgendamentosCliente();
            alert('❌ Agendamento cancelado!');
        }
    }

    getAgendamentos() {
        return JSON.parse(localStorage.getItem(this.agendamentosKey) || '[]');
    }

    getNomeProfissional(codigo) {
        const nomes = {
            'jp': 'João Pedro',
            'lc': 'Lucas Costa', 
            'ms': 'Maria Santos'
        };
        return nomes[codigo] || 'Profissional';
    }

    formatarData(dataISO) {
        const date = new Date(dataISO + 'T00:00:00');
        return date.toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'}).toUpperCase();
    }
}

// Inicializar
const barbearia = new SistemaBarbearia();
