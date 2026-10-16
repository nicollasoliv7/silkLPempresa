/* Orçamento de uniforme escolar.
 * Monta o pedido, soma o total e abre o WhatsApp pedindo confirmação de estoque.
 * Os valores ficam em precos-escolares.js — este arquivo não contém preço nenhum.
 */
(() => {
  const escolas = window.ESCOLAS;
  const tamanhos = window.TAMANHOS;
  const raiz = document.getElementById('orcamento-escolar');
  if (!escolas || !tamanhos || !raiz) return;

  const WHATSAPP = '5531986002054';

  const $ = (sel) => raiz.querySelector(sel);
  const selEscola = $('#oe-escola');
  const selProduto = $('#oe-produto');
  const selTamanho = $('#oe-tamanho');
  const inpQtd = $('#oe-qtd');
  const btnAdd = $('#oe-add');
  const elPreco = $('#oe-preco');
  const elLista = $('#oe-lista');
  const elVazio = $('#oe-vazio');
  const elTotal = $('#oe-total');
  const elAviso = $('#oe-aviso');
  const form = $('#oe-form');

  let carrinho = [];
  let escolaDoPedido = '';

  /* ---------- formatação ---------- */
  const moeda = (v) => {
    const [inteiro, centavos] = v.toFixed(2).split('.');
    return `R$ ${inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${centavos}`;
  };

  const escolaAtual = () => escolas.find((e) => e.id === selEscola.value);

  /* A lista adulta pode ser maior em algumas escolas (Jayme Martins tem EG). */
  const gradeAdulto = () => {
    const escola = escolaAtual();
    return (escola && escola.gradeAdulto) || tamanhos.adulto;
  };

  /* SENAI e IFMG têm grade própria; aí não existe infantil/adulto. */
  const faixaDoTamanho = (tam) => {
    const escola = escolaAtual();
    if (escola && escola.tamanhos) return 'propria';
    return gradeAdulto().includes(tam) ? 'adulto' : 'infantil';
  };

  const rotuloTamanho = (tam) => (faixaDoTamanho(tam) === 'infantil' ? `Tam. ${tam}` : tam);

  /* Preço de um produto num tamanho. Exceção por tamanho vence tudo. */
  const precoDe = (produto, tam) => {
    if (!produto) return 0;
    if (produto.excecoes && typeof produto.excecoes[tam] === 'number') return produto.excecoes[tam];
    if (typeof produto.unico === 'number') return produto.unico;
    return faixaDoTamanho(tam) === 'adulto' ? produto.adulto : produto.infantil;
  };

  const produtoAtual = () => {
    const escola = escolaAtual();
    return escola && selProduto.value !== '' ? escola.produtos[Number(selProduto.value)] : null;
  };

  const opcao = (valor, texto) => {
    const o = document.createElement('option');
    o.value = valor;
    o.textContent = texto;
    return o;
  };

  /* ---------- montagem dos selects ---------- */
  const montarEscolas = () => {
    selEscola.replaceChildren(opcao('', 'Selecione a escola…'));
    escolas.forEach((e) => selEscola.appendChild(opcao(e.id, e.nome)));
  };

  const montarProdutos = () => {
    const escola = escolaAtual();
    if (!escola) {
      selProduto.replaceChildren(opcao('', 'Escolha a escola primeiro'));
      selProduto.disabled = true;
      return;
    }
    selProduto.disabled = false;
    selProduto.replaceChildren(opcao('', 'Selecione a peça…'));
    escola.produtos.forEach((p, i) => selProduto.appendChild(opcao(String(i), p.nome)));
  };

  const montarTamanhos = () => {
    const escola = escolaAtual();
    selTamanho.replaceChildren(opcao('', escola ? 'Selecione…' : '—'));
    selTamanho.disabled = !escola;
    if (!escola) return;

    const grupos = escola.tamanhos
      ? [['Tamanhos', escola.tamanhos]]
      : [['Infantil', tamanhos.infantil], ['Adulto', gradeAdulto()]];

    grupos.forEach(([rotulo, lista]) => {
      const g = document.createElement('optgroup');
      g.label = rotulo;
      lista.forEach((t) => g.appendChild(opcao(t, rotulo === 'Infantil' ? `Tam. ${t}` : t)));
      selTamanho.appendChild(g);
    });
  };

  /* ---------- preço unitário em destaque ---------- */
  const atualizarPreco = () => {
    const p = produtoAtual();
    const t = selTamanho.value;
    if (!p || !t) {
      elPreco.textContent = 'Escolha a peça e o tamanho para ver o valor.';
      elPreco.classList.remove('is-ativo');
      btnAdd.disabled = true;
      return;
    }
    const faixa = faixaDoTamanho(t);
    const valor = document.createElement('strong');
    valor.textContent = moeda(precoDe(p, t));
    const legenda = document.createElement('span');
    legenda.textContent = faixa === 'propria' ? 'por peça' : `por peça · tamanho ${faixa}`;
    elPreco.replaceChildren(valor, legenda);
    elPreco.classList.add('is-ativo');
    btnAdd.disabled = false;
  };

  /* ---------- carrinho ---------- */
  const avisar = (msg) => {
    elAviso.textContent = msg;
    elAviso.hidden = !msg;
  };

  const desenharCarrinho = () => {
    const temItens = carrinho.length > 0;
    elVazio.hidden = temItens;
    elLista.hidden = !temItens;
    elLista.replaceChildren();

    carrinho.forEach((item, i) => {
      const li = document.createElement('li');

      const info = document.createElement('div');
      const nome = document.createElement('strong');
      nome.textContent = item.produto;
      const det = document.createElement('span');
      det.textContent = `${rotuloTamanho(item.tamanho)} · ${item.qtd} un. × ${moeda(item.preco)}`;
      info.append(nome, det);

      const valor = document.createElement('b');
      valor.textContent = moeda(item.preco * item.qtd);

      const remover = document.createElement('button');
      remover.type = 'button';
      remover.className = 'oe-remover';
      remover.setAttribute('aria-label', `Remover ${item.produto} tamanho ${item.tamanho}`);
      remover.textContent = '×';
      remover.addEventListener('click', () => {
        carrinho.splice(i, 1);
        desenharCarrinho();
      });

      li.append(info, valor, remover);
      elLista.appendChild(li);
    });

    const total = carrinho.reduce((s, it) => s + it.preco * it.qtd, 0);
    const pecas = carrinho.reduce((s, it) => s + it.qtd, 0);
    const rotulo = document.createElement('span');
    rotulo.textContent = temItens ? `${pecas} ${pecas === 1 ? 'peça' : 'peças'}` : 'Nenhuma peça';
    const soma = document.createElement('strong');
    soma.textContent = moeda(total);
    elTotal.replaceChildren(rotulo, soma);
  };

  const adicionar = () => {
    const produto = produtoAtual();
    const tamanho = selTamanho.value;
    const qtd = Math.max(1, Math.min(999, Math.floor(Number(inpQtd.value)) || 1));
    if (!escolaAtual() || !produto || !tamanho) return;

    const preco = precoDe(produto, tamanho);
    const existente = carrinho.find((i) => i.produto === produto.nome && i.tamanho === tamanho);
    if (existente) existente.qtd = Math.min(999, existente.qtd + qtd);
    else carrinho.push({ produto: produto.nome, tamanho, qtd, preco });

    avisar('');
    desenharCarrinho();
    selTamanho.value = '';
    inpQtd.value = '1';
    atualizarPreco();
    selTamanho.focus();
  };

  /* ---------- mensagem do WhatsApp ---------- */
  const montarMensagem = () => {
    const escola = escolaAtual();
    const total = carrinho.reduce((s, it) => s + it.preco * it.qtd, 0);
    const aluno = $('#oe-aluno').value.trim();

    const linhas = [
      '*PEDIDO DE UNIFORME ESCOLAR*',
      '',
      `*Escola:* ${escola ? escola.nome : '-'}`,
      `*Nome:* ${$('#oe-nome').value.trim()}`,
    ];
    if (aluno) linhas.push(`*Aluno(a):* ${aluno}`);
    linhas.push(`*WhatsApp:* ${$('#oe-fone').value.trim()}`, '', '*Peças:*');
    carrinho.forEach((it) => {
      linhas.push(`• ${it.produto} — ${rotuloTamanho(it.tamanho)} — ${it.qtd} un. × ${moeda(it.preco)} = ${moeda(it.preco * it.qtd)}`);
    });
    linhas.push('', `*Total estimado:* ${moeda(total)}`, '', 'Gostaria de confirmar se vocês têm esses tamanhos em estoque.');
    return linhas.join('\n');
  };

  /* ---------- máscara de telefone ---------- */
  const fone = $('#oe-fone');
  fone.addEventListener('input', () => {
    const d = fone.value.replace(/\D/g, '').slice(0, 11);
    let s = '';
    if (d.length) s = `(${d.slice(0, 2)}`;
    if (d.length >= 2) s += ') ';
    if (d.length > 2) {
      s += d.length <= 10
        ? d.slice(2, 6) + (d.length > 6 ? `-${d.slice(6, 10)}` : '')
        : `${d.slice(2, 7)}-${d.slice(7, 11)}`;
    }
    fone.value = s;
  });

  /* ---------- validação e envio ---------- */
  const erro = (campo, msg) => {
    const caixa = campo.closest('.oe-campo');
    if (!caixa) return;
    caixa.classList.add('tem-erro');
    const alvo = caixa.querySelector('.oe-erro');
    if (alvo) alvo.textContent = msg;
  };

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    raiz.querySelectorAll('.tem-erro').forEach((c) => c.classList.remove('tem-erro'));
    avisar('');

    if (!carrinho.length) {
      avisar('Adicione pelo menos uma peça ao pedido antes de enviar.');
      elAviso.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const nome = $('#oe-nome');
    let ok = true;
    if (nome.value.trim().length < 3) { erro(nome, 'Informe seu nome completo.'); ok = false; }
    if (fone.value.replace(/\D/g, '').length < 10) { erro(fone, 'Informe um WhatsApp válido com DDD.'); ok = false; }
    if (!ok) {
      const primeiro = raiz.querySelector('.tem-erro input');
      if (primeiro) primeiro.focus();
      return;
    }

    /* Abre o WhatsApp em nova aba por um link real: funciona em celular e
     * desktop e não redireciona a aba do site (window.open com "noopener"
     * sempre devolve null, o que fazia a versão antiga abrir duas vezes). */
    const link = document.createElement('a');
    link.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(montarMensagem())}`;
    link.target = '_blank';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  /* ---------- ligações ---------- */
  /* Cada orçamento vale para uma escola só: preço, grade e catálogo mudam
   * entre elas. Se o pedido já tem peças e a escola muda, limpamos. */
  selEscola.addEventListener('change', () => {
    if (carrinho.length && selEscola.value !== escolaDoPedido) {
      carrinho = [];
      desenharCarrinho();
      avisar('Você trocou de escola, então o pedido foi limpo — cada orçamento vale para uma escola.');
    }
    escolaDoPedido = selEscola.value;
    montarProdutos();
    montarTamanhos();
    atualizarPreco();
  });
  selProduto.addEventListener('change', atualizarPreco);
  selTamanho.addEventListener('change', atualizarPreco);
  btnAdd.addEventListener('click', adicionar);

  montarEscolas();
  montarProdutos();
  montarTamanhos();
  atualizarPreco();
  desenharCarrinho();
})();
