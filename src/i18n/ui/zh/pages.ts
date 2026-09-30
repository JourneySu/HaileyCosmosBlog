// src/i18n/ui/zh/pages.ts - dictionnaire chinois, tranche "pages" : la copie propre a chaque page du site.
//
// Une page est un assemblage de sections, jamais un endroit ou l'on ecrit des
// phrases : les titres de hero, les descriptions meta et les libelles de
// formulaire vivent ici, et les composants n'affichent que ce qu'on leur passe.
//
// Le blog de demonstration s'appelle Reef Notes : le carnet d'un studio web
// independant. Le registre est celui d'un artisan qui montre son etabli, pas
// celui d'une page commerciale. Concret, chiffre quand c'est possible, jamais une
// promesse qu'un billet ne tient pas juste en dessous.

export const zhPages = {
  // --- Accueil -------------------------------------------------------------
  home: {
    metaTitle: "Hailey Cosmos，迴圈外的海莉",
    metaDescription:
      "一個離開日復一日的迴圈後，重新尋找生命意義的地方。閱讀、思考、書寫，記錄我一步步療癒自己、找回生活重量的過程。",
    eyebrow: "Hailey Cosmos",
    heroTitle: "Outside the Loop 迴圈外的海莉",
    heroAccent: "Loop",
    heroLede: "寫給自己，寫給被困在生活迴圈裡的靈魂們。閱讀、思考、書寫，記錄我一步步療癒自己、找回生活重量的過程。",
    heroPrimary: "開始閱讀",
    heroSecondary: "關於本站",
    heroRecent: "最新筆記",
    // Les libelles du compteur du hero, dans l'ordre exact ou la page fournit
    // les nombres : notes publiees, sujets.
    heroLedger: ["已發布筆記", "主題"],
    featuredEyebrow: "本月精選",
    latestTitle: "最新筆記",
    latestAccent: "最新",
    latestLede: "最新的文章，由新到舊排列。更早的都收在文章庫。",
    latestCta: "瀏覽所有文章",
    topicsTitle: "持續書寫的幾個主題",
    topicsAccent: "主題",
    topicsLede: "每篇文章只歸屬一個主題，讓你能專注讀完一條脈絡，不必穿越其他內容。",
    authorsTitle: "這裡是誰在寫",
    authorsAccent: "誰在寫",
    authorsLede: "這裡的每個人依然在接案。每個署名都連到那個人發表過的所有文章，包括最早的一篇。",
    authorsCta: "認識作者",
    aboutTitle: "筆記背後的小小的我",
    aboutAccent: "我",
    aboutLede: "生活中有太多想法，試著一個個寫下來，也許哪天就會遇見有共鳴的人。",
    aboutCta: "更多的我",
    topicsCta: "查看所有主題",
  },

  // --- A propos ------------------------------------------------------------
  about: {
    metaTitle: "關於這裡",
    metaDescription: "一個在迴圈之外，練習慢慢療癒自己、寫下生活與思考的地方。",
    eyebrow: "關於",
    title: "一個練習慢慢療癒自己的人",
    accent: "慢慢療癒",
    lede: "我是海莉，我曾活在日復一日的迴圈裡，說不出哪裡不對勁，卻感覺不到一絲意義。這裡記下我一路尋找答案、慢慢把自己接回來的過程，現在也仍在路上，如果你也在同樣的路上，希望我們能在這裡相遇。",
    storyTitle: "這個空間是怎麼開始的",
    storyAccent: "開始的",
    storyParagraphs: [
      "曾經有一段時間，我每天汲汲營營地上班、努力追著別人定義的人生，卻越活越迷惘。我說不出哪裡不對勁，只是漸漸感覺不到意義，好像每一天都只是前一天的複製貼上。於是我決定按下暫停鍵，離開了工作，重新去問自己：我到底想過什麼樣的人生。",
      "接下來的半年，我幾乎是帶著找答案的心情在讀書。心靈成長、時間管理、哲學、腦神經科學，各種領域都讀了一點，不是為了變成專家，而是想拼湊出屬於自己的地圖。慢慢地，我找回了一些生命的重量，也漸漸知道，原來自己是可以選擇怎麼過這一生的。",
      "後來我發現，如果只是把讀到的東西放在腦子裡，那些終究不是真正屬於我的。要真正內化，我需要把它們寫下來。而寫下來之後，也才有機會遇見同樣在尋找答案的你，這個空間，就是這樣開始的。",
    ],
    valuesTitle: "在這裡，我想記得的幾件事",
    valuesAccent: "記得",
    valuesLede: "沒有標準答案，只有持續練習。",
    values: [
      {
        title: "誠實比完美更重要",
        text: "我不是專家，這裡沒有標準答案，只有我真實的摸索過程。如果剛好讓你有共鳴，那就是最好的意外。",
      },
      {
        title: "慢慢來，比較快",
        text: "這裡不追求更新頻率，也不追逐流量。每一篇都是我真正消化過、願意留下來的東西。",
      },
      {
        title: "寫給自己，也寫給你",
        text: "身處同一宇宙的我們，若我的文字能與你的足跡重疊，便是最美好的事。",
      },
    ],
  },

  // --- Contact -------------------------------------------------------------
  // Le formulaire est complet et non monte : le theme ne choisit pas de
  // prestataire d'envoi a la place de son utilisateur. La copie, elle, est prete.
  contact: {
    metaTitle: "聯絡我們",
    metaDescription: "案子的詢問、文章的更正，或是對我們發表過的內容有疑問。同一個信箱，真人閱讀，兩個工作天內回覆。",
    eyebrow: "聯絡",
    title: "寫信給我們，我們都會讀",
    accent: "都會讀",
    lede: "案子、更正、關於某次建置的問題：都會進到同一個信箱，由真人回覆。沒有工單號碼，也沒有自動回覆信。",
    formTitle: "傳送訊息",
    nameLabel: "你的名字",
    namePlaceholder: "王小明",
    emailLabel: "電子郵件",
    emailPlaceholder: "you@example.com",
    subjectLabel: "主旨",
    subjectPlaceholder: "一句話就夠了",
    messageLabel: "訊息內容",
    messagePlaceholder: "你正在做什麼？卡住的地方是什麼？",
    submit: "送出訊息",
    formNote: "這個表單裡沒有偷藏電子報訂閱。你的信箱只會用來回覆，不做其他用途。",
    success: "訊息已送出。你會在兩個工作天內收到回覆。",
    error: "傳送失敗。請直接寄信給我們，我們會在那邊收到。",
    directTitle: "或是跳過表單",
    directLede: "直接寄一封普通的電子郵件效果一樣好，而且一串信件串比表單更容易追蹤。",
    directCta: "寄信給工作室",
    nextTitle: "接下來會發生什麼",
    nextSteps: [
      "兩個工作天內，我們其中一人會先簡短回覆。",
      "如果是案子，在報價之前我們會先問三個問題。",
      "如果是更正，文章會在同一週修正並附上致謝。",
    ],
  },

  // --- Sujets --------------------------------------------------------------
  topics: {
    metaTitle: "主題",
    metaDescription: "Hailey Cosmos 涵蓋的所有主題：閱讀、思考、書寫，以及在生活裡慢慢尋找意義的各種面向。",
    eyebrow: "主題",
    title: "我們持續書寫的五個主題",
    accent: "主題",
    lede: "每篇文章只歸屬一個主題。挑一條主線讀完整段，如果想照順序理解脈絡，從最舊的開始讀。",
    /** {count} vient du nombre d'articles publies dans le sujet. */
    countLabel: "{count} 篇文章",
    countOne: "1 篇文章",
    readTopic: "閱讀這個主題",
    allTopics: "所有主題",
    emptyTitle: "這裡還沒有內容",
    emptyLede: "這個主題已經開放，但第一篇文章還是草稿。RSS 訂閱會在文章上線時通知你。",
  },

  // --- Auteurs -------------------------------------------------------------
  authors: {
    metaTitle: "作者",
    metaDescription: "撰寫 Reef Notes 的人：他們平常在做什麼、在哪裡可以找到他們，以及他們在這裡發表過的所有文章。",
    eyebrow: "作者",
    title: "這裡是誰在寫",
    accent: "誰在寫",
    lede: "三個人共用這本筆記本。每篇文章都有署名，每個署名都連到那個人寫過的所有文章。",
    roleLabel: "職稱",
    linksLabel: "其他地方",
    postsBy: "{name} 的文章",
    readAll: "閱讀 {name} 的所有文章",
    countLabel: "{count} 篇文章",
    countOne: "1 篇文章",
    emptyTitle: "這個署名底下還沒有文章",
    emptyLede: "作者頁面空空如也，代表某處還有一篇草稿沒發布。這是常有的事。",
  },

  // --- Recherche -----------------------------------------------------------
  // La recherche tourne dans le navigateur sur un index construit au build :
  // zero requete, zero service tiers, et le theme reste 100% statique.
  search: {
    metaTitle: "搜尋",
    metaDescription: "依標題、摘要、主題或標籤搜尋 Hailey Cosmos 的所有文章。搜尋在瀏覽器裡進行：不會傳送到伺服器，也不會被記錄。",
    eyebrow: "搜尋",
    title: "重新找到它",
    accent: "找到",
    lede: "搜尋範圍涵蓋標題、摘要、主題與標籤。在瀏覽器裡執行，內容不會離開這個頁面，載入後離線也能繼續使用。",
    placeholder: "搜尋文章、主題與標籤",
    label: "搜尋部落格",
    shortcut: "按下 / 開始搜尋",
    clear: "清除搜尋",
    /** Affiche avant la premiere frappe. {count} est la taille de l'index. */
    prompt: "開始輸入以搜尋 {count} 篇文章。",
    resultsLabel: "搜尋結果",
    countLabel: "{count} 筆結果",
    countOne: "1 筆結果",
    inTopic: "於 {topic}",
    noResultsTitle: "找不到符合「{query}」的結果",
    noResultsLede: "試試更短的關鍵字，或是換個方式，直接依主題瀏覽。",
    noResultsCta: "瀏覽主題",
  },

  // --- 404 -----------------------------------------------------------------
  notFound: {
    metaTitle: "找不到頁面",
    metaDescription: "這個網址沒有任何內容。文章庫和搜尋功能都還能正常使用。",
    code: "404",
    title: "這個網址什麼都沒有",
    accent: "什麼都沒有",
    lede: "連結可能寫錯了，或是文章搬走了而我們忘記留下轉址。無論哪一種都不是你的問題。下面有兩條回去的路。",
    homeCta: "回到首頁",
    postsCta: "瀏覽所有文章",
    searchCta: "搜尋部落格",
  },
} as const;
