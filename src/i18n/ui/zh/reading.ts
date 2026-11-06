// src/i18n/ui/zh/reading.ts - dictionnaire chinois, tranche "reading" : tout ce qui entoure la lecture d'un article.
//
// C'est la tranche la plus importante du theme. Reef ne vend ni un tunnel de
// conversion ni un tableau de bord : il vend huit minutes de lecture propre.
// Les libelles qui bordent le texte (dates, temps de lecture, sommaire,
// article suivant) sont lus a chaque visite, donc ils meritent d'etre ecrits.
//
// Trois sections : `post` (la page d'article), `archive` (les listes et leurs
// etats vides), `newsletter` (le bloc d'inscription, reutilise ailleurs).

export const zhReading = {
  // --- Page d'article ------------------------------------------------------
  post: {
    /** {n} vient du temps de lecture calcule sur le corps du billet. */
    minRead: "閱讀約需 {n} 分鐘",
    minReadOne: "閱讀約需 1 分鐘",
    published: "發布於",
    updated: "更新於",
    /** Affiche a cote de la seconde date : montrer les deux est plus honnete
     *  que de remplacer silencieusement la premiere. */
    updatedNote: "發布後經過修訂。",
    writtenBy: "作者",
    toc: "本頁內容",
    tocLabel: "目錄",
    topicLabel: "主題",
    tagsLabel: "標籤",
    copyLink: "複製連結",
    linkCopied: "已複製連結",
    previousPost: "上一篇",
    nextPost: "下一篇",
    /** Nom accessible du bloc precedent/suivant, en pied d'article : sans lui,
     *  un lecteur d'ecran annonce une navigation de plus sans dire laquelle. */
    navLabel: "文章導覽",
    keepReading: "繼續閱讀",
    keepReadingAccent: "閱讀",
    keepReadingLede: "同一本筆記本裡的另外三篇，依主題挑選，不是演算法推薦的。",
    keepReadingCta: "所有文章",
    aboutAuthor: "關於作者",
    backToPosts: "回到所有文章",
    /** Credit optionnel sous l'image de couverture. */
    coverCredit: "封面來源：{credit}",
    draft: "草稿",
    draftNote: "這篇文章尚未發布。它只會在本機建置以供預覽，不會出現在列表、RSS 訂閱、網站地圖與搜尋結果中。",
    /** Libelle du curseur contextuel au survol d'une carte de billet. */
  },

  // --- Archives et listes --------------------------------------------------
  archive: {
    metaTitle: "所有文章",
    metaDescription: "Hailey Cosmos 發表過的所有文章，由新到舊：閱讀筆記、生活思考，以及一步步找回生命意義的紀錄。",
    eyebrow: "文章庫",
    title: "我們寫過的所有東西",
    accent: "所有東西",
    lede: "完整的文章庫，由新到舊排列。當你還不確定要找什麼的時候，滑三十秒比打字搜尋更快。",
    /** Suffixe de titre des pages 2 et suivantes. */
    pageSuffix: "第 {n} 頁",
    /** Libelle accessible de la grille : elle n'a pas de titre visible propre. */
    listLabel: "文章列表",
    paginationLabel: "文章分頁",
    topicTitle: "歸類於「{topic}」的文章",
    authorTitle: "{name} 的文章",
    tagTitle: "標籤為「{tag}」的文章",
    countLabel: "{count} 篇文章",
    countOne: "1 篇文章",
    emptyTitle: "這裡還沒有內容",
    emptyLede: "這一頁沒有符合的文章。文章庫大約每隔幾週會更新。",
    emptyCta: "回到所有文章",
  },

  // --- Newsletter ----------------------------------------------------------
  // Le bloc vit dans le pied de page et sur l'accueil. L'envoi passe par
  // /api/subscribe (worker/index.js) vers Buttondown ; les messages de resultat
  // sont affiches par src/components/Sections/Global/_newsletter.ts.
  newsletter: {
    title: "一個月一封信",
    accent: "一個月",
    lede: "簡短整理我們發表過的內容，還有我們搞砸的地方。沒有追蹤像素，沒有連續信件轟炸，一鍵就能永久退訂。",
    emailLabel: "你的電子郵件",
    placeholder: "you@example.com",
    submit: "訂閱",
    note: "一個月一封信。隨時可以取消訂閱。",
    /** Texte du bouton pendant l'envoi. */
    sending: "送出中…",
    success: "快完成了。請點擊我們剛剛寄出的確認信。",
    /** Adresse deja connue de Buttondown : un message amical, pas une erreur. */
    already: "這個信箱已經在訂閱名單上了，謝謝你！如果還沒收到確認信，請檢查垃圾信件匣。",
    /** Adresse mal formee (code "invalid"). */
    error: "這個信箱格式看起來不太對，請檢查後再試一次。",
    limited: "送出次數有點多，請過一分鐘再試一次。",
    /** Suivi d'un lien vers la page d'inscription Buttondown (failedLink). */
    failed: "訂閱沒有成功。你可以稍後再試，或",
    failedLink: "到這裡訂閱",
    offline: "目前無法送出，請確認網路連線後再試。",
  },
} as const;
