import { Contact, IdCard, Menu, UserCog, Users, type LucideIcon } from "lucide-react";

export type modalParamsType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    id: number,
    updateList: () => Promise<void>
};

export type listType = {
    value: number | string | undefined | boolean | null,
    label: string,
    color?: string
}[];

export type optionType = {
    value: any,
    label: string,
    icone?: LucideIcon
}

export type itemSelectType = {
    id: number,
    descricao: string
};

export const opcoesBandeira = [
    { value: "Petrobras - BR", label: "Petrobras - BR" },
    { value: "Shell", label: "Shell" },
    { value: "Ipiranga", label: "Ipiranga" },
    { value: "Ale", label: "Ale" },
    { value: "Bandeira Branca", label: "Bandeira Branca" },
    { value: "Outros", label: "Outros" },
]

export const optionsFuncoes = [
    { value: "isAjudante", label: "Ajudante", icone: Users },
    { value: "isMotorista", label: "Motorista", icone: Contact },
    { value: "isOficina", label: "Oficina", icone: UserCog },
    { value: "isFornecedor", label: "Fornecedor", icone: IdCard },
];

export const tiposCorVeiculo = [
    { value: "Amarelo", label: "Amarelo" },
    { value: "Azul", label: "Azul" },
    { value: "Bege", label: "Bege" },
    { value: "Branco", label: "Branco" },
    { value: "Cinza", label: "Cinza" },
    { value: "Dourada", label: "Dourada" },
    { value: "Grená", label: "Grená" },
    { value: "Laranja", label: "Laranja" },
    { value: "Marrom", label: "Marrom" },
    { value: "Prata", label: "Prata" },
    { value: "Rosa", label: "Rosa" },
    { value: "Roxa", label: "Roxa" },
    { value: "Verde", label: "Verde" },
    { value: "Vermelha", label: "Vermelha" },
    { value: "Fantasia", label: "Fantasia" },
]

export const tiposTanque = [
    { value: 1, label: "Combustível", valueLabel: "Combustivel" },
    { value: 2, label: "Arla", valueLabel: "Arla" },
]

export const selecioneOption = {
    value: undefined,
    label: "Selecione"
};

export const todosOption: optionType = {
    value: undefined,
    label: "Todos",
    icone: Menu
};

export const ativoOptions = [
    { value: true, label: "Ativo" },
    { value: false, label: "Inativo" }
];

export const SimNaoOptions = [
    { value: true, label: "Sim" },
    { value: false, label: "Não" },
];

export const categoriasVeiculos = [
    { value: "A", label: "Motos" },
    { value: "B", label: "Carros de Passeio" },
    { value: "C", label: "Caminhões" },
    { value: "D", label: "Ônibus" },
    { value: "E", label: "Veículos com uniddade acoplada" },
]

export const categoriasCnh = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
    { value: "AB", label: "AB" },
    { value: "AC", label: "AC" },
    { value: "AD", label: "AD" },
    { value: "AE", label: "AE" },
]

export const tiposDataVeiculo = [
    { value: "AQUISICAO", label: "Aquisição" },
    { value: "VENDA", label: "Venda" },
]

export const tiposDataPessoa = [
    { value: "CNH_VALIDADE", label: "Validade CNH" },
    { value: "FUNDACAO_NASCIMENTO", label: "Fundação/Nascimento" },
]

export const tiposRegime = [
    { value: 1, label: "Simples Nacional", valueString: "SimplesNacional" },
    { value: 2, label: "Lucro Presumido", valueString: "LucroPresumido" },
    { value: 3, label: "Lucro Real", valueString: "LucroReal" },
    { value: 4, label: "Regime Especial", valueString: "RegimeEspecial" },
    { value: 5, label: "Micro Empreendedor Individual", valueString: "MicroEmpreendedorIndividual" },
    { value: 6, label: "Gerencial", valueString: "Gerencial" }
];

export const tiposPessoa = [
    { value: 1, label: "Pessoa Física", valueString: "Fisica" },
    { value: 2, label: "Pessoa Jurídica", valueString: "Juridica" }
];

export const tiposCentroCusto = [
    { value: "Receita", label: "Receita" },
    { value: "Despesa", label: "Despesa" },
    { value: "Resultado", label: "Resultado" }
];

export const tiposContribuinte = [
    { value: 1, label: "Contribuinte", valueString: "Contribuinte" },
    { value: 2, label: "Isento", valueString: "Isento" },
    { value: 3, label: "Não Contribuinte", valueString: "NaoContribuinte" }
];

export const tiposRenda = [
    { value: 1, label: "Sem Comprovação", valueString: "SemComprovacao" },
    { value: 2, label: "Renda Fixa", valueString: "RendaFixa" },
    { value: 3, label: "Renda Variável", valueString: "RendaVariavel" }
];

export const sexoOpcoes = [
    { value: 1, label: "Masculino", valueString: "Masculino" },
    { value: 2, label: "Feminino", valueString: "Feminino" },
];

export const tiposConta = [
    { value: 1, valueString: "ContaCorrente", label: "Conta Corrente" },
    { value: 2, valueString: "ContaPoupanca", label: "Conta Poupança" },
    { value: 3, valueString: "CaixaInternoOperacional", label: "Caixa Interno Operacional" },
    { value: 4, valueString: "CaixaInternoAdministrativo", label: "Caixa Interno Administrativo" }
];

export const tiposOperacaoFiscal = [
    { value: 0, valueString: "Entrada", label: "Entrada" },
    { value: 1, valueString: "Saida", label: "Saída" },
];

export const tiposTransacao = [
    { value: 1, valueString: "AVista", label: "À vista" },
    { value: 2, valueString: "Parcelado", label: "À Parcelado" },
];

export const tiposParcelamento = [
    { value: 1, valueString: "NaoParcela", label: "Nao Parcela" },
    { value: 2, valueString: "QtdParcelasFixas", label: "Qtd Parcelas Fixas" },
    { value: 3, valueString: "QtdParcelasVariaveis", label: "Qtd Parcelas Variáveis" }
];

export const tiposPeriodicidade = [
    { value: 1, valueString: "Diario", label: "Diário" },
    { value: 7, valueString: "Semanal", label: "Semanal" },
    { value: 15, valueString: "Quinzenal", label: "Quinzenal" },
    { value: 30, valueString: "Mensal", label: "Mensal" },
    { value: 60, valueString: "Bimestral", label: "Bimestral" },
    { value: 90, valueString: "Trimestral", label: "Trimestral" },
    { value: 120, valueString: "Quadrimestral", label: "Quadrimestral" },
    { value: 180, valueString: "Semestral", label: "Semestral" },
    { value: 360, valueString: "Anual", label: "Anual" },
];

export const tiposUso = [
    { value: 1, valueString: "Recebimento", label: "Recebimento" },
    { value: 2, valueString: "Pagamento", label: "Pagamento" },
    { value: 3, valueString: "Ambos", label: "Ambos" }
];

export const meiosPagamento = [
    { value: 1, valueString: "Dinheiro", label: "Dinheiro" },
    { value: 2, valueString: "Pix", label: "Pix" },
    { value: 3, valueString: "CartaoCreditoo", label: "Cartão Crédito" },
    { value: 4, valueString: "CartaoDebito", label: "Cartão Débito" },
    { value: 5, valueString: "TransferenciaBancaria", label: "Transferência Bancária" },
    { value: 6, valueString: "Cheque", label: "Cheque" },
    { value: 7, valueString: "Promissoria", label: "Promissória" },
    { value: 8, valueString: "Outro", label: "Outro" },
    { value: 9, valueString: "ValeCreditoSistema", label: "Vale Crédito Sistema" },
    { value: 11, valueString: "TrocaProdutoSistema", label: "Troca Produto Sistema" },
];

export const naturezasPlanoConta = [
    { value: 1, valueString: "Receita", label: "Receita" },
    { value: 2, valueString: "Despesa", label: "Despesa" },
    { value: 3, valueString: "Resultado", label: "Resultado" },
    { value: 4, valueString: "Ativo", label: "Ativo" },
    { value: 5, valueString: "Passivo", label: "Passivo" },
    { value: 6, valueString: "PatrimonioLiquido", label: "Patrimônio Líquido" },
    { value: 7, valueString: "Outros", label: "Outros" },
];

export const formaVendaProduto = [
    { value: 1, valueString: "Unidade", label: "Unidade" },
    { value: 2, valueString: "Fracionado", label: "Fracionado" },
    { value: 3, valueString: "FracionadoComEtiquetaDePeso", label: "Fracionado com etiqueta de peso" },
];

export const tipoProduto = [
    { value: 1, valueString: "Normal", label: "Normal" },
    { value: 2, valueString: "Composto", label: "Composto" },
    { value: 3, valueString: "Rendimento", label: "Rendimento" },
];

export const tipoRelacionemtoProduto = [
    { value: 1, valueString: "Substituto", label: "Substituto" },
    { value: 2, valueString: "Similar", label: "Similar" },
    { value: 3, valueString: "Relacionado", label: "Relacionado" },
    { value: 4, valueString: "Complementar", label: "Complementar" },
];

export const tipoQuantidadeRendimentoEnum = [
    { value: 1, valueString: "Quantidade", label: "Quantidade" },
    { value: 2, valueString: "Porcentagem", label: "Porcentagem" },
    { value: 3, valueString: "Nenhuma", label: "Nenhuma" },
];

export const tipoFinanceiroTituloEnum = [
    { value: 1, label: "Receber" },
    { value: 2, label: "Pagar" }
];

// titulo financeiro
export const statusGeralFinanceiroTituloEnum = [
    { value: 1, valueString: "EmAberto", label: "Em aberto" },
    { value: 2, valueString: "Quitado", label: "Quitado" },
    { value: 3, valueString: "Cancelado", label: "Cancelado" },
];

// usado em titulo financeiro parcela
export const statusFinanceiroTituloEnum = [
    { value: 1, valueString: "EmAberto", label: "Em aberto" },
    { value: 2, valueString: "Quitado", label: "Quitado" },
    { value: 3, valueString: "ParcialmentePago", label: "Parcialmente pago" },
    { value: 4, valueString: "Vencido", label: "Vencido" },
    { value: 5, valueString: "Cancelado", label: "Cancelado" },
];

export const tipoTituloMultaEnum = [
    { value: 1, valueString: "NaoCobrada", label: "Não cobrada" },
    { value: 2, valueString: "Percentual", label: "Percentual" },
    { value: 3, valueString: "ValorFixo", label: "Valor fixo" },
];

export const tipoTituloDescontoEnum = [
    { value: 1, valueString: "SemDesconto", label: "Sem desconto" },
    { value: 2, valueString: "Percentual", label: "Percentual" },
    { value: 3, valueString: "ValorFixo", label: "Valor fixo" },
];