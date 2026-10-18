# Página da Conferência IBB 54 Anos

Página do evento da Conferência de Aniversário da Igreja Batista Betel (29/10 a 01/11), com contagem regressiva, programação, local e inscrição para o almoço de domingo.

## O que tem na pasta

```
index.html            a página inteira (HTML, CSS e JavaScript)
assets/               imagens: fundo, logo, letterings e imagem de compartilhamento
apps-script/
  Codigo.gs           código que recebe as inscrições e grava na planilha
README.md             este arquivo
```

## 1. Ligar o formulário à planilha (Google Apps Script)

As inscrições do almoço vão para uma planilha do Google. Faça isso uma vez só:

1. Crie uma planilha no Google Planilhas, por exemplo "Inscrições Almoço IBB 54 Anos".
2. Na planilha, abra **Extensões > Apps Script**.
3. Apague o que estiver no editor, cole todo o conteúdo de `apps-script/Codigo.gs` e clique em **Salvar**.
4. Clique em **Implantar > Nova implantação**.
5. Em "Selecione o tipo", escolha **App da Web** e preencha:
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
6. Clique em **Implantar** e autorize com a sua conta. Se aparecer "O Google não verificou este app", clique em **Avançado > Acessar (não seguro)**. É normal para scripts próprios.
7. Copie o endereço do App da Web. Ele termina em `/exec`.
8. Abra o `index.html`, procure por `APPS_SCRIPT_URL` e cole o endereço entre as aspas:

```js
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/SEU_CODIGO/exec";
```

**Opcional:** no editor do Apps Script, escolha a função `prepararPlanilha` no menu de cima e clique em **Executar**. Isso já cria as abas antes da primeira inscrição.

**Para testar:** abra o endereço `/exec` no navegador. Deve aparecer `"Inscrições do almoço IBB 54 Anos funcionando."`. Depois faça uma inscrição de teste na página e confira se apareceu uma linha na aba **Inscrições** da planilha.

A planilha ganha duas abas sozinha:

- **Inscrições:** uma linha por pessoa, com data e hora, nome, se é da igreja ou visitante, tempo na igreja, se vai ao almoço e a página de origem.
- **Resumo:** total de inscrições, quantos vão ao almoço, quantos não vão, quantos são da igreja e quantos são visitantes. As contas são fórmulas, então atualizam sozinhas a cada inscrição.

**Se mudar o `Codigo.gs` depois:** vá em **Implantar > Gerenciar implantações**, clique no lápis, escolha **Nova versão** e **Implantar**. Assim o endereço `/exec` continua o mesmo.

Enquanto `APPS_SCRIPT_URL` estiver vazio, o formulário funciona em **modo de teste**: dá para preencher e ver a tela de sucesso, mas nada é enviado.

## 2. Subir na Vercel

1. Entre em vercel.com e clique em **Add New > Project**.
2. Arraste a pasta inteira (a que tem o `index.html` e a pasta `assets`). Não precisa de build nem de configuração.
3. Clique em **Deploy**.

Depois do deploy, troque a imagem de compartilhamento para o endereço completo, senão a prévia no WhatsApp pode sair sem imagem. No `index.html`, procure `og:image` e troque:

```html
<meta property="og:image" content="https://SEU-DOMINIO.vercel.app/assets/og.jpg">
```

Faça um novo deploy com essa alteração.

## 3. O que dá para editar no index.html

Tudo que costuma mudar fica no bloco **EDITE AQUI**, no começo do `<script>`, perto do fim do arquivo:

| O quê | Onde | Exemplo |
|---|---|---|
| Endereço do Apps Script | `APPS_SCRIPT_URL` | `"https://script.google.com/.../exec"` |
| Horário de cada noite | `HORARIOS` | `"29": "20h"` (vazio mostra "Horário em breve") |
| Texto do compartilhamento no WhatsApp | `MENSAGEM_WHATSAPP` | o link da página entra sozinho no final |

Outras coisas, direto no HTML:

- **Preletores:** procure o nome do pastor (ex.: `Pr. Rogério Goulart`) e troque o nome e o @.
- **Programação de domingo:** procure `Domingo de celebração`. Cada linha tem o horário (`<time>`) e a atividade.
- **Almoço:** procure `Almoço de aniversário da Betel` para mudar o texto, a data, o horário ou o local.
- **Contagem regressiva:** procure `2026-10-29T20:00:00-03:00` para mudar o dia e a hora em que ela termina (horário de Brasília).

## Programação atual

| Dia | Horário | O quê |
|---|---|---|
| Qui 29/10 | 20h | Pr. Rogério Teixeira (@aprogerioluiz) |
| Sex 30/10 | 20h | Pr. Adimar Ferreira (@adimar.ferreira1968) |
| Sáb 31/10 | 19h30 | Pr. Rogério Goulart (@rogerio_goulartpr) |
| Dom 01/11 | 9h | EBD |
| | 10h | Batismo de membros |
| | 12h | Almoço de aniversário (com inscrição) |
| | 18h | Encerramento da conferência com Pr. Kastemberg (@igrejaemcristo) |

Local: Rua Laranjeiras, 127, Durval de Barros, Contagem/MG.

## Problemas comuns

- **A inscrição mostra sucesso, mas não aparece na planilha:** confira se `APPS_SCRIPT_URL` está preenchido e termina em `/exec`, e se a implantação está com acesso para "Qualquer pessoa". Se você mexeu no código, publique uma nova versão (veja o passo 1).
- **A prévia do link no WhatsApp sai sem imagem:** o `og:image` precisa do endereço completo do site. O WhatsApp também guarda prévias antigas por um tempo.
- **O mapa não aparece:** ele carrega do Google Maps e precisa de internet. O botão "Abrir no mapa" funciona sempre.

## Observações

- Os títulos com as fontes Amoresa e Perandory estão como imagem (pasta `assets`), então não é preciso subir arquivo de fonte. Os textos usam Arimo, do Google Fonts.
- A página respeita o modo "reduzir movimento" do celular: quem usa esse modo vê a página sem animações.
