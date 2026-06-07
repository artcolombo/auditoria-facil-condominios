# Auditoria Fácil Condomínios

Plataforma web para automatizar a análise de documentos financeiros e auxiliar síndicos, conselhos fiscais, administradoras e auditorias independentes na conferência de prestações de contas condominiais.

## 📋 Visão Geral

O Auditoria Fácil Condomínios utiliza tecnologias de processamento de documentos, extração de dados de PDFs, conciliação financeira e inteligência artificial para transformar documentos financeiros em informações organizadas, auditáveis e de fácil interpretação.

## 🎯 Objetivos

- Automatizar a auditoria financeira de condomínios
- Extrair informações de documentos PDF
- Organizar lançamentos financeiros
- Gerar planilhas automáticas
- Conciliar extratos bancários com comprovantes
- Identificar inconsistências
- Gerar relatórios de auditoria

## 🚀 Funcionalidades (MVP - Versão 1.0)

### ✅ Funcionalidade 1.0: Upload e Extração de Extratos Bancários
- Upload de PDF
- Leitura automática
- Extração de dados (Data, Histórico, Valor, Tipo)
- Exportação para Excel

### 📋 Funcionalidades Futuras
- Conciliação Automática
- Classificação Automática
- Relatório de Auditoria
- Inteligência Artificial

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python** 3.10+
- **FastAPI** - Framework web
- **pdfplumber** - Extração de dados de PDFs
- **pandas** - Manipulação de dados
- **openpyxl** - Geração de planilhas Excel
- **SQLite** - Banco de dados (fase inicial)

### Frontend
- **HTML5**
- **CSS3**
- **Bootstrap 5**
- **JavaScript**

## 📦 Instalação

### Backend

1. Clone o repositório:
```bash
git clone https://github.com/artcolombo/auditoria-facil-condominios.git
cd auditoria-facil-condominios
```

2. Crie um ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
```

3. Instale as dependências:
```bash
cd backend
pip install -r requirements.txt
```

4. Execute a aplicação:
```bash
uvicorn app.main:app --reload
```

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido por [artcolombo](https://github.com/artcolombo)

---

**Status**: 🚧 Desenvolvimento - Versão 1.0 em progresso