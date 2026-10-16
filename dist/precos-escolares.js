/* Tabela de preços de uniformes escolares — 2026
 * Fonte: tabelas oficiais da Silkmania, 19/01/2026. Valores em reais.
 *
 * Como ler cada produto:
 *   infantil / adulto  -> valores diferentes por faixa de tamanho
 *   unico              -> mesmo valor para qualquer tamanho
 *   excecoes           -> tamanhos com valor próprio, que vencem os de cima
 *
 * Grade de tamanho da escola, quando foge do padrão:
 *   tamanhos     -> lista única, sem faixa infantil/adulto (SENAI, IFMG)
 *   gradeAdulto  -> substitui só a lista adulta (Jayme Martins, que tem EG)
 *
 * Para reajustar: altere apenas os números abaixo. Nada mais depende deles.
 */
window.TAMANHOS = {
  infantil: ['2', '4', '6', '8', '10', '12', '14'],
  adulto: ['P', 'M', 'G', 'GG'],
};

window.ESCOLAS = [
  {
    id: 'vovozinha',
    nome: 'Escola Vovozinha',
    produtos: [
      { nome: 'Camisa Manga Curta', infantil: 52.90, adulto: 55.90 },
      { nome: 'Regata', infantil: 49.90, adulto: 53.90 },
      { nome: 'Camisa Manga Longa', infantil: 57.90, adulto: 62.90 },
      { nome: 'Bermuda', infantil: 63.90, adulto: 65.90 },
      { nome: 'Bermuda Feminina', infantil: 59.90, adulto: 63.90 },
      { nome: 'Calça', infantil: 84.90, adulto: 89.90 },
      { nome: 'Calça Bailarina', infantil: 72.90, adulto: 76.90 },
      { nome: 'Jaqueta', infantil: 116.90, adulto: 126.90 },
    ],
  },
  {
    id: 'isap',
    nome: 'ISAP',
    produtos: [
      { nome: 'Camisa', infantil: 59.90, adulto: 67.90 },
      { nome: 'Regata', infantil: 55.90, adulto: 62.90 },
      { nome: 'Camisa Manga Longa', infantil: 65.90, adulto: 72.90 },
      { nome: 'Bermuda Masculina', infantil: 59.90, adulto: 65.90 },
      { nome: 'Bermuda Feminina', infantil: 59.90, adulto: 69.90 },
      { nome: 'Short Saia', infantil: 63.90, adulto: 69.90 },
      { nome: 'Calça Masculina', infantil: 81.90, adulto: 86.90 },
      { nome: 'Calça Feminina', infantil: 69.90, adulto: 75.90 },
      { nome: 'Jaqueta', infantil: 125.90, adulto: 139.90 },
    ],
  },
  {
    id: 'jayme-martins',
    nome: 'Escola Jayme Martins',
    gradeAdulto: ['P', 'M', 'G', 'GG', 'EG'],
    produtos: [
      { nome: 'Camisa Manga Curta', infantil: 74.90, adulto: 82.90 },
      { nome: 'Regata', infantil: 49.90, adulto: 58.90 },
      { nome: 'Camisa Manga Longa', infantil: 79.90, adulto: 89.90 },
      { nome: 'Bermuda', infantil: 65.90, adulto: 72.90 },
      { nome: 'Bermuda Feminina', infantil: 75.90, adulto: 79.90 },
      { nome: 'Short Saia', infantil: 75.90, adulto: 79.90 },
      { nome: 'Calça', infantil: 75.90, adulto: 79.90 },
      { nome: 'Calça Bailarina', infantil: 59.90, adulto: 69.90 },
      { nome: 'Jaqueta', infantil: 119.90, adulto: 134.90 },
      { nome: 'Camisa Poliamida', infantil: 85.90, adulto: 89.90, excecoes: { GG: 96.90, EG: 96.90 } },
    ],
  },
  {
    id: 'arco-iris',
    nome: 'Escola Arco Íris',
    produtos: [
      { nome: 'Camisa Manga Curta', unico: 61.90 },
      { nome: 'Regata', unico: 56.90 },
      { nome: 'Camisa Manga Longa', unico: 67.90 },
      { nome: 'Bermuda', unico: 71.90 },
      { nome: 'Short Saia', unico: 75.90 },
      { nome: 'Calça', unico: 86.90 },
      { nome: 'Jaqueta', unico: 116.90 },
    ],
  },
  {
    id: 'comeco-de-vida',
    nome: 'Escola Começo de Vida',
    produtos: [
      { nome: 'Camisa Manga Curta', unico: 61.90 },
      { nome: 'Regata', unico: 56.90 },
      { nome: 'Camisa Manga Longa', unico: 67.90 },
      { nome: 'Bermuda', unico: 71.90 },
      { nome: 'Short Saia', unico: 75.90 },
      { nome: 'Calça', unico: 86.90 },
      { nome: 'Jaqueta', unico: 116.90 },
    ],
  },
  {
    id: 'crianca-feliz',
    nome: 'Escola Criança Feliz',
    produtos: [
      { nome: 'Camisa Manga Curta', unico: 61.90 },
      { nome: 'Regata', unico: 56.90 },
      { nome: 'Camisa Manga Longa', unico: 67.90 },
      { nome: 'Bermuda', unico: 71.90 },
      { nome: 'Short Saia', unico: 75.90 },
      { nome: 'Calça', unico: 86.90 },
      { nome: 'Jaqueta', unico: 116.90 },
    ],
  },
  {
    id: 'municipais',
    nome: 'Escolas Municipais',
    produtos: [
      { nome: 'Camisa Municipal', infantil: 55.90, adulto: 59.90 },
    ],
  },
  {
    id: 'raul-soares',
    nome: 'Escola Raul Soares',
    produtos: [
      { nome: 'Camisa', infantil: 55.90, adulto: 59.90 },
    ],
  },
  {
    id: 'senai',
    nome: 'SENAI',
    tamanhos: ['BLGG', 'P', 'M', 'G', 'GG', 'EG'],
    produtos: [
      { nome: 'Camisa SENAI', unico: 65.00 },
    ],
  },
  {
    id: 'ifmg',
    nome: 'IFMG Itabirito',
    tamanhos: ['BLGG', 'P', 'M', 'G', 'GG', 'EG'],
    produtos: [
      { nome: 'Camisa IFMG — Branca', unico: 65.00 },
      { nome: 'Camisa IFMG — Preta', unico: 65.00 },
    ],
  },
];
