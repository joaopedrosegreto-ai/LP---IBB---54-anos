/**
 * Inscrições do almoço da Conferência IBB 54 Anos
 * Recebe os dados da página e grava uma linha por inscrição na planilha.
 *
 * Como usar (uma vez só):
 * 1. Crie uma planilha no Google Planilhas, ex.: "Inscrições Almoço IBB 54 Anos".
 * 2. Na planilha: Extensões > Apps Script. Apague o que estiver lá e cole este código. Salve.
 * 3. Clique em Implantar > Nova implantação > tipo "App da Web".
 *    Executar como: Eu. Quem pode acessar: Qualquer pessoa.
 * 4. Autorize com a sua conta e copie o endereço que termina em /exec.
 * 5. Na página (index.html), cole esse endereço em APPS_SCRIPT_URL.
 * Se mudar este código depois, use Implantar > Gerenciar implantações > Editar > Nova versão.
 */

const ABA = "Inscrições";
const CABECALHO = ["Data e hora", "Nome", "Da igreja ou visitante", "Tempo na igreja", "Vai ao almoço?", "Página"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    let d = {};
    if (e && e.postData && e.postData.contents) {
      try { d = JSON.parse(e.postData.contents); } catch (err) { d = e.parameter || {}; }
    } else if (e && e.parameter) {
      d = e.parameter;
    }

    const nome = String(d.nome || "").trim().slice(0, 120);
    if (!nome) return resposta({ ok: false, erro: "nome vazio" });

    const aba = pegarAba();
    garantirResumo();
    aba.appendRow([
      new Date(),
      nome,
      String(d.vinculo || "").slice(0, 40),
      String(d.tempo_igreja || "").slice(0, 40),
      String(d.almoco || "").slice(0, 10),
      String(d.pagina || "").slice(0, 200)
    ]);
    return resposta({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

/** Abrir o endereço /exec no navegador mostra este aviso: serve para testar se está no ar. */
function doGet() {
  return resposta({ ok: true, mensagem: "Inscrições do almoço IBB 54 Anos funcionando." });
}

function pegarAba() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(ABA);
  if (!aba) {
    aba = planilha.insertSheet(ABA);
    aba.appendRow(CABECALHO);
    aba.setFrozenRows(1);
    aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight("bold");
    aba.getRange("A:A").setNumberFormat("dd/MM/yyyy HH:mm");
  }
  return aba;
}

/** Aba "Resumo" com os totais. Usa fórmulas, então se atualiza sozinha a cada inscrição. */
function garantirResumo() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  if (planilha.getSheetByName("Resumo")) return;
  const r = planilha.insertSheet("Resumo");
  const a = "'" + ABA + "'!";
  r.getRange("A1:B6").setValues([
    ["Resumo das inscrições", ""],
    ["Total de inscrições", "=MAX(0,COUNTA(" + a + "B:B)-1)"],
    ["Vão ao almoço", "=COUNTIF(" + a + "E:E,\"Sim\")"],
    ["Não vão", "=COUNTIF(" + a + "E:E,\"Não\")"],
    ["Da igreja", "=COUNTIF(" + a + "C:C,\"Membro da igreja\")"],
    ["Visitantes", "=COUNTIF(" + a + "C:C,\"Visitante\")"]
  ]);
  r.getRange("A1").setFontWeight("bold").setFontSize(13);
  r.getRange("A2:A6").setFontWeight("bold");
  r.getRange("B2:B6").setFontSize(13).setHorizontalAlignment("center");
  r.setColumnWidth(1, 200);
}

/** Rode esta função uma vez pelo editor (botão Executar) para criar as abas antes da primeira inscrição. */
function prepararPlanilha() {
  pegarAba();
  garantirResumo();
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
