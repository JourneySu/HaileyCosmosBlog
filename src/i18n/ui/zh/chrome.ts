// src/i18n/ui/zh/chrome.ts - dictionnaire chinois, tranche "chrome" : navigation, pied de page, libelles partages.
//
// Le dictionnaire est decoupe par domaine plutot que garde en un seul fichier :
// une personne peut relire la copie des pages pendant qu'une autre revoit les
// libelles de la barre, sans se marcher dessus. index.ts recompose le tout.
//
// Cette tranche ne contient QUE ce qui entoure le contenu et se repete sur
// toutes les pages. Une phrase propre a une seule page appartient a la tranche
// "pages" ; tout ce qui habille la lecture d'un article appartient a "reading".

export const zhChrome = {
  // --- Barre de navigation -------------------------------------------------
  // Quatre rubriques, pas de mega-menu : un blog qui ouvre un panneau au survol
  // demande au lecteur de choisir avant de lui avoir donne une raison de choisir.
  nav: {
    posts: "文章",
    topics: "主題",
    about: "關於",
    contact: "聯絡",
    search: "搜尋",
    /** Libelle accessible du lien qui ramene le titre du blog a l'accueil. */
    brandHome: "Hailey，回到首頁",
    /** Les deux <nav> de la page portent un nom : sans lui, un lecteur d'ecran
     *  annonce "navigation" deux fois et ne dit pas laquelle des deux. */
    mainLabel: "主要導覽",
    mobileLabel: "行動裝置導覽",
    openMenu: "開啟選單",
    closeMenu: "關閉選單",
    switchLanguage: "切換語言",
    toggleTheme: "切換深色/淺色模式",
  },

  // --- Pied de page --------------------------------------------------------
  // Deux colonnes seulement : Lire, Le studio. Un pied de page de blog qui
  // aligne six colonnes copie un SaaS et sert d'egout a liens morts.
  footer: {
    tagline:
      "Hailey Notes 是一個個人的生活筆記本。記錄閱讀、生活靈感，以及關於生命意義的一些隨想。",
    colRead: "閱讀",
    colStudio: "本站",
    sitemap: "網站地圖",
    backToTop: "回到頂端",
    /** Libelle accessible du lien qui ne porte qu'une icone. */
    emailStudio: "寄信給工作室",
    followOn: "在 {network} 上追蹤 {name}",
  },

  // --- Libelles partages ---------------------------------------------------
  // Ce qui apparait a au moins deux endroits sans appartenir a aucun. Un libelle
  // utilise une seule fois n'a rien a faire ici : il vit dans sa page.
  common: {
    readMore: "閱讀更多",
    readPost: "閱讀文章",
    backHome: "回到首頁",
    backToPosts: "回到所有文章",
    skipToContent: "跳至主要內容",
    home: "首頁",
    breadcrumbLabel: "麵包屑導覽",
    previous: "上一頁",
    next: "下一頁",
    page: "第",
    /** Les jetons {current} et {total} sont remplis par fmt() (src/i18n/index.ts). */
    pageOf: "第 {current} 頁，共 {total} 頁",
    all: "全部",
    loading: "載入中",
    close: "關閉",
    copy: "複製",
    copied: "已複製",
    optional: "選填",
    required: "必填",
    genericError: "發生錯誤，請稍後再試一次。",
    newTab: "另開新分頁",
  },
} as const;
