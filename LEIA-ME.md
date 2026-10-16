# Site Silkmania — versão reconstruída (out/2026)

Site estático, sem build. Tudo o que vai ao ar está em `dist/`.

## Publicar na Vercel
1. Envie esta pasta (com `vercel.json` na raiz) para o repositório ou arraste na Vercel.
2. A Vercel publica a pasta `dist/` (definido em `vercel.json`).
3. Ao usar domínio próprio, troque `silkmania.vercel.app` nas linhas marcadas com `[HOST]` no `index.html`.

## Arquivos
- `dist/index.html` — página única
- `dist/styles.css` — estilos (cores e fontes da marca no topo, em `:root`)
- `dist/script.js` — menu mobile, cabeçalho e animações
- `dist/precos-escolares.js` — **tabela de preços 2026**: para reajustar, altere só os números aqui
- `dist/orcamento-escolar.js` — calculadora de uniforme escolar que envia o pedido pelo WhatsApp
- `dist/assets/` — imagens (todas verificadas, sem arquivos corrompidos)

## O que mudou em relação à versão anterior
- HTML corrigido (tag quebrada no hero, link do Maps inválido, erro de digitação "encontte").
- CSS reescrito em um arquivo único e coerente, sem camadas de remendos sobrepostos.
- Corrigido bug do orçamento escolar que abria o WhatsApp e também redirecionava a aba do site.
- Galeria da loja usa as fotos reais da empresa.
- Removido o efeito de desfoque fixo no rodapé (8 camadas de blur pesavam no celular).
- 9 imagens corrompidas (cortadas, com a parte de baixo preta) deixaram de ser usadas.
