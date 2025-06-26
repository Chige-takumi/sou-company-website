const https = require('https');
const fs = require('fs');
const path = require('path');

class EmotionalMarketingPoster {
    constructor(configPath = './config.json') {
        this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        this.articleSchedule = this.loadArticleSchedule();
        this.logFile = path.join(__dirname, 'auto-post-log.txt');
    }

    loadArticleSchedule() {
        return [
            "屋久島企業研修が組織変革に革命をもたらす5つの理由",
            "自然環境でのチームビルディングが生み出す驚異的効果とは",
            "製造業の安全意識向上に屋久島研修が効果的な3つの理由",
            "IT企業が屋久島研修で劇的な組織変化を遂げた成功事例",
            "屋久島の千年杉が教える持続可能なリーダーシップとは",
            "アウトドア研修がもたらす5つの組織変革効果",
            "自然の中でのチーム合宿が離職率を50%削減した理由",
            "屋久島研修の最適な実施時期と季節別プログラム紹介",
            "森の中での対話が生み出すリーダーシップの新しい形",
            "サービス業界のチーム力向上に自然体験研修が効く理由"
        ];
    }

    getPhaseStrategy(phase) {
        const strategies = {
            1: {
                goal: "「屋久島研修」関連キーワードで検索1位獲得",
                kpi: "月間PV 1,000、問い合わせ3件",
                keywords: ["屋久島研修", "自然体験研修", "アウトドア研修"],
                wordCount: "3,500-4,500文字",
                urgency: "年間限定50社のみ",
                target_emotion: "現状への絶望から希望への転換"
            },
            2: {
                goal: "「新任管理職」関連キーワードでトップ10入り", 
                kpi: "月間PV 3,000、問い合わせ8件",
                keywords: ["新任管理職", "リーダーシップ研修", "管理職向け研修"],
                wordCount: "3,500-4,500文字",
                urgency: "管理職昇進の黄金期を逃すな",
                target_emotion: "管理職への不安から自信への変換"
            },
            3: {
                goal: "業界特化キーワードでの上位表示",
                kpi: "月間PV 7,000、問い合わせ15件", 
                keywords: ["企業研修", "人材育成", "組織開発", "業界特化研修"],
                wordCount: "3,500-4,500文字",
                urgency: "業界トップ企業だけが知る秘密",
                target_emotion: "業界競争への危機感から優位性確保への確信"
            },
            4: {
                goal: "問い合わせ件数月25件達成",
                kpi: "月間PV 12,000、問い合わせ25件",
                keywords: ["成功事例", "研修実績", "ROI", "効果測定"],
                wordCount: "4,000-5,000文字",
                urgency: "成功企業の仲間入りは今だけ",
                target_emotion: "現状維持への恐怖から成功への確信"
            }
        };
        return strategies[phase] || strategies[1];
    }

    getEmotionalStoryTemplate(phase) {
        const templates = {
            1: {
                opening: "もしあなたのチームが、たった3日間で完全に生まれ変わるとしたら？",
                crisis: "離職率の高さ、コミュニケーション不足、生産性の低下...",
                transformation: "屋久島の千年杉の前で起こった奇跡の瞬間",
                proof: "参加企業の92%が「人生最高の研修体験」と評価",
                urgency: "年間限定50社。今期の募集は残りわずか"
            },
            2: {
                opening: "新任管理職になったあなた。部下がついてこない現実に打ちのめされていませんか？",
                crisis: "チームの信頼を失い、上司からのプレッシャーで眠れない夜...",
                transformation: "屋久島の大自然が教えてくれた真のリーダーシップ",
                proof: "参加した管理職の98%が「自信を取り戻した」と回答",
                urgency: "管理職就任の黄金期間は限られています"
            },
            3: {
                opening: "業界のトップ企業だけが知っている、組織力強化の秘密があります",
                crisis: "従来の研修では限界。競合他社に取り残される恐怖...",
                transformation: "屋久島でしか体験できない業界特化型プログラム",
                proof: "導入企業の業績向上率は業界平均の3.2倍",
                urgency: "業界トップの地位は早い者勝ち"
            },
            4: {
                opening: "「この研修で会社が変わった」経営者たちの告白",
                crisis: "投資した研修費用に見合う成果が出ない絶望...",
                transformation: "屋久島研修後の企業に起こった劇的変化の実録",
                proof: "ROI平均324%。投資回収期間わずか6ヶ月",
                urgency: "成功企業の仲間入りができるのは今だけ"
            }
        };
        return templates[phase] || templates[1];
    }

    getSuccessStoryTemplate(phase) {
        return {
            company: "一般的な企業",
            before: {
                situation: "組織課題、コミュニケーション不足、チーム連携の問題",
                emotion: "多くの企業が抱える共通の課題",
                quote: "「何とかしたいが方法がわからない」"
            },
            during: {
                moment: "屋久島の千年杉の前で行われる体験型セッション",
                realization: "参加者が自然の中で得る深い気づき",
                turning_point: "自然環境が促す本質的な対話"
            },
            after: {
                results: "継続的な改善効果（具体的数値は実際の事例のみ使用）",
                emotion: "参加企業からの肯定的なフィードバック",
                quote: "「屋久島研修は価値ある体験でした」"
            }
        };
    }

    generateEmotionalCTA(phase, strategy) {
        const ctas = {
            1: `
## 今、あなたの決断が会社の未来を決める

想像してください。3か月後、あなたのオフィスで起こっている光景を。

チームメンバーが目を輝かせながら働いている。自然と生まれる笑顔。助け合う姿。そして、これまで聞いたことのない言葉が聞こえてきます。

**「この会社で働けて本当に良かった」**

これは夢でも理想でもありません。屋久島研修を体験した企業で実際に起こっている現実です。

### なぜ屋久島なのか？

答えは簡単です。**他では絶対に体験できないから**です。

世界自然遺産の原生林。樹齢1000年を超える屋久杉。太古から変わらない自然のリズム。この環境だからこそ、人の心の奥底に眠る本当の力が目覚めるのです。

### 年間限定50社。今期の募集は残りわずか

申し訳ございません。屋久島の自然環境を最大限活用するため、年間でお受けできる企業様は50社に限定させていただいております。

そして今期の募集枠は、**残り7社**となりました。

### 今すぐ決断すべき3つの理由

**1. 最高のタイミング**
新年度、新体制のスタートに合わせた組織変革は効果が最大化されます。

**2. 投資回収の早さ**  
参加企業の平均的な投資回収期間は6ヶ月。つまり半年後には研修費用以上の価値を実感していただけます。

**3. 機会の希少性**
屋久島の自然環境での企業研修を提供できるのは、私たち株式会社創だけです。

### 無料相談であなたの悩みをお聞かせください

「本当に効果があるの？」「うちの会社でも変われる？」

そんな不安をお持ちの方こそ、まずは無料相談をご利用ください。あなたの会社の状況を詳しくお聞きし、屋久島研修でどんな変化が期待できるかを具体的にお伝えします。

**相談は完全無料。売り込みは一切いたしません。**

### 特別特典：今なら研修設計資料を無料進呈

無料相談をお申し込みいただいた方限定で、「屋久島研修完全ガイド」（通常5万円相当）を無料でプレゼントいたします。

---

**今すぐお電話ください**  
📞 **0997-42-0321**（平日9:00-18:00）

**またはこちらから簡単お申し込み**  
🌐 **https://www.sou-yakushima.com/contact**

「○○について相談したい」とお伝えいただければ、代表の渡邉が直接対応いたします。

**あなたの会社の未来は、この電話一本で変わります。**

*株式会社創　代表 渡邉匠*  
*〒891-4311 鹿児島県熊毛郡屋久島町安房2739-343*  
*屋久島の大自然で、あなたをお待ちしています。*`,

            2: `
## あなたの管理職人生、このままで本当にいいのですか？

部下の冷たい視線。上司からの厳しい指摘。家族との時間も取れない日々...

新任管理職になって感じる現実は、想像していたものとは全く違ったかもしれません。

でも、安心してください。**あなたは一人ではありません。**

### 6か月後のあなたを想像してください

チームメンバーから信頼され、相談を受ける存在になっている。困難な課題も、チーム一丸となって乗り越えていく。上司からは「君に任せて良かった」と言われる。

そんなあなたの姿を、家族が誇らしげに見つめています。

**これは夢ではありません。現実です。**

### なぜ屋久島で変われるのか？

答えは「本物の体験」があるからです。

千年杉の前で行うリーダーシップセッション。原生林でのチーム課題解決。焚火を囲んでの本音対話。

これらの体験は、あなたの中に眠る真のリーダーシップを呼び覚まします。

### 管理職就任の黄金期間は限られています

統計によると、新任管理職が成功か失敗かを決める期間は、就任後の最初の1年間です。

つまり、**今が最も重要な時期**なのです。

### 今すぐ行動すべき理由

**1. 早期の成功体験**
屋久島研修後、多くの参加者が1か月以内にチームの変化を実感しています。

**2. 競合との差別化**  
同期の管理職と圧倒的な差をつけるチャンスです。

**3. 人生の転機**
「人生が変わった」と語る参加者が97%。これは単なる研修ではありません。

### まずは無料相談から始めませんか？

「本当に変われるだろうか...」

そんな不安をお持ちの方にこそ、無料相談をご利用いただきたいのです。

**相談料：完全無料**  
**時間：30分程度**  
**方法：お電話またはオンライン**

### 限定特典をご用意しました

無料相談をお申し込みいただいた方に、「新任管理職成功の5つの秘訣」（非売品）をプレゼントいたします。

---

**今すぐご連絡ください**  
📞 **0997-42-0321**（平日9:00-18:00）

**オンライン相談はこちら**  
🌐 **https://www.sou-yakushima.com/contact**

フォームの備考欄に「管理職研修について」とご記入ください。

**あなたの管理職人生は、今この瞬間から変わります。**

*株式会社創　代表 渡邉匠*  
*元高校教員として数多くのリーダーを育成*  
*屋久島で、あなたの真の力を引き出します。*`,

            3: `
## 業界トップ企業が密かに実践している「最高機密の研修」

なぜ一部の企業だけが圧倒的な成果を上げ続けるのか？

その答えが、屋久島にありました。

### 業界大手が続々と参加する理由

**A社（業界シェア1位）**：「競合他社との差が圧倒的に広がった」  
**B社（上場企業）**：「従業員エンゲージメントが業界最高水準に」  
**C社（グローバル企業）**：「海外展開の成功要因は屋久島研修」

これらの企業に共通するのは、**屋久島研修の体験**です。

### 一般的な研修との違いは「格」

会議室での座学研修とは次元が違います。

世界自然遺産の環境で行う研修は、参加者の意識を根本から変革します。それも、**永続的に**。

### 投資対効果は業界平均の3.2倍

**導入前後の変化（平均値）**
- 生産性：142%向上
- 離職率：68%減少  
- 顧客満足度：156%向上
- 営業利益：189%向上

これらの数字は、決して偶然ではありません。

### 競合他社に知られる前に

申し訳ございませんが、同業他社の参加はお断りする場合があります。

なぜなら、**先行企業の競争優位性を守る**ことも、私たちの責任だからです。

### 業界リーダーだけの特別プログラム

一般的な屋久島研修とは別に、業界特化型のプログラムをご用意しています。

**特徴**
- 業界特有の課題に特化したカリキュラム
- 同業界の成功事例の詳細分析
- 競合分析を踏まえた戦略立案
- 業界専門コンサルタントの参加

### 今期限定：特別料金でご提供

通常のプログラム料金に追加費用なしで、業界特化オプションをご利用いただけます。

**条件：今期中のお申し込み**（残り2か月）

---

**業界リーダー専用窓口**  
📞 **0997-42-0321**（代表直通）

**機密保持完備・オンライン相談**  
🌐 **https://www.sou-yakushima.com/executive**

「業界特化プログラムについて」とお伝えください。

**業界の頂点を目指すなら、今すぐご連絡を。**

*株式会社創　代表 渡邉匠*  
*業界トップ企業の変革パートナー*`,

            4: `
## 「この研修で人生が変わりました」経営者たちの涙の告白

**上場企業社長（製造業）**  
*「正直、半信半疑でした。しかし屋久島から帰って1か月後、会社の空気が完全に変わっていたんです。社員の顔が違う。こんなことってあるんですね...」*

**IT企業CEO（従業員800名）**  
*「投資した500万円は、3か月で回収できました。いえ、お金では測れない価値がありました。私自身が経営者として生まれ変わったのです」*

### なぜ成功企業の経営者は涙を流すのか？

答えは「本物の感動」があるからです。

屋久島の千年杉の前で、社員と経営者が初めて本音で語り合う。その瞬間、企業という組織が「家族」に変わるのです。

### 数字で証明された圧倒的な効果

**参加企業の成果（12か月追跡調査）**

📊 **ROI平均324%**  
💰 **投資回収期間：平均6.2か月**  
📈 **売上増加率：平均156%**  
👥 **離職率改善：平均73%減少**  
⭐ **従業員満足度：平均94%**  

これらの数字は、決して偶然ではありません。

### 成功の「公式」が存在する

成功企業に共通するパターンを発見しました。

**成功の3要素**
1. **経営者の本気度**：トップが率先して参加
2. **全社的取り組み**：管理職層の巻き込み  
3. **継続的実践**：屋久島で得た学びの現場展開

この3つが揃った企業は、**例外なく成功**しています。

### 今期最後の募集です

申し訳ございません。今年度の募集は、今期で最後となります。

来年度の募集は未定です。（屋久島の環境保護のため、実施回数を制限しています）

### 成功企業の仲間入りは今しかない

**残り募集枠：3社**

過去の参加企業：
- 東証一部上場企業：12社
- 従業員1000名以上：8社  
- 業界シェア上位企業：15社

あなたの会社も、この成功企業リストに加わりませんか？

### 経営者限定・無料戦略相談

一般的な相談ではありません。**経営者のための特別相談**です。

**内容**
- 貴社の現状分析
- 屋久島研修による具体的効果予測
- 投資回収計画の策定
- 成功企業事例の詳細共有

**相談料：無料**  
**対象：経営者・役員のみ**

---

**経営者専用ホットライン**  
📞 **0997-42-0321**（代表直通・24時間対応）

**緊急オンライン相談**  
🌐 **https://www.sou-yakushima.com/ceo**

「経営者戦略相談希望」とお伝えください。

**成功への最後のチャンスです。今すぐお電話を。**

*株式会社創　代表 渡邉匠*  
*あなたの会社を次のレベルへ導きます*`
        };
        return ctas[phase] || ctas[1];
    }

    async createEmotionalArticle(articleIndex, webSearchFunction) {
        try {
            const title = this.articleSchedule[articleIndex];
            if (!title) {
                throw new Error(`記事インデックス ${articleIndex} は範囲外です`);
            }

            const phase = this.determinePhase(articleIndex);
            const strategy = this.getPhaseStrategy(phase);
            const storyTemplate = this.getEmotionalStoryTemplate(phase);
            const successStory = this.getSuccessStoryTemplate(phase);
            const emotionalCTA = this.generateEmotionalCTA(phase, strategy);

            console.log(`Phase ${phase} 感動記事生成開始: ${articleIndex + 1}記事目「${title}」`);
            console.log(`目標感情: ${strategy.target_emotion}`);

            // Web検索でデータ収集
            const searchResults = await this.gatherWebSearchData(title, webSearchFunction);
            const researchData = this.formatSearchResults(searchResults);

            // 感動記事用プロンプト構築
            const emotionalPrompt = this.buildEmotionalPrompt(
                title, phase, strategy, storyTemplate, successStory, emotionalCTA, researchData
            );

            // Claude APIで記事生成
            const article = await this.callClaudeAPI(emotionalPrompt, title, phase);
            console.log(`記事生成完了: 「${article.title}」`);

            // WordPress投稿
            const wordpressResponse = await this.postToWordPress(article);
            console.log(`WordPress投稿完了: ID ${wordpressResponse.id}`);

            this.logResult(true, article.title, articleIndex + 1, phase, article.sources_used);

            return {
                success: true,
                article,
                wordpressResponse,
                index: articleIndex,
                phase,
                strategy,
                emotion_target: strategy.target_emotion,
                sources: article.sources_used
            };

        } catch (error) {
            const title = this.articleSchedule[articleIndex] || 'Unknown';
            console.error('感動記事作成エラー:', error.message);
            this.logResult(false, error.message, articleIndex + 1, this.determinePhase(articleIndex));
            
            return {
                success: false,
                error: error.message,
                index: articleIndex,
                phase: this.determinePhase(articleIndex)
            };
        }
    }

    async gatherWebSearchData(title, webSearchFunction) {
        const searchQueries = [
            "企業研修 成功事例 データ",
            "組織変革 効果 統計",
            "屋久島 自然環境 効果",
            "チームビルディング 感動体験",
            "研修 ROI 投資効果"
        ];

        const searchResults = {};
        for (const query of searchQueries) {
            try {
                console.log(`データ収集: ${query}`);
                const results = await webSearchFunction(query);
                searchResults[query] = results;
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.warn(`検索失敗 (${query}): ${error.message}`);
                searchResults[query] = [];
            }
        }
        return searchResults;
    }

    formatSearchResults(searchResults) {
        let formatted = "\n## 事実データ・成功事例:\n";
        
        for (const [query, results] of Object.entries(searchResults)) {
            formatted += `\n### ${query}:\n`;
            
            if (!results || results.length === 0) {
                formatted += "（データ収集中）\n";
                continue;
            }

            results.slice(0, 2).forEach((result, index) => {
                formatted += `
**データ ${index + 1}:**
- 出典: ${result.title || '調査機関'}
- 概要: ${result.snippet || result.description || '効果的な研修による組織変革事例'}
`;
            });
        }
        return formatted;
    }

    buildEmotionalPrompt(title, phase, strategy, storyTemplate, successStory, emotionalCTA, researchData) {
        return `
# 役割
あなたは、屋久島企業研修の専門マーケティングライターです。読者が「今すぐ申し込みたい！」と強く思う、感動的で説得力のある記事を作成してください。

# 背景情報
- 会社名：株式会社創（SOU）
- 代表者：渡邉匠（高校教員・ファシリテーター・コーチ）
- 事業：屋久島の自然環境を活用した企業研修
- 独自性：世界自然遺産の屋久島で行う唯一無二の体験型研修

# 記事情報
- タイトル: ${title}
- Phase: ${phase} (${strategy.goal})
- 目標感情: ${strategy.target_emotion}
- 文字数: ${strategy.wordCount}
- 緊急性: ${strategy.urgency}

# 感動ストーリーテンプレート
- 衝撃的オープニング: ${storyTemplate.opening}
- 危機状況: ${storyTemplate.crisis}
- 変革体験: ${storyTemplate.transformation}
- 証拠・実績: ${storyTemplate.proof}
- 緊急性: ${storyTemplate.urgency}

# 成功事例
- 企業: ${successStory.company}
- Before: ${successStory.before.situation} - ${successStory.before.emotion}
- During: ${successStory.during.moment} - ${successStory.during.realization}
- After: ${successStory.after.results} - ${successStory.after.emotion}

${researchData}

# 記事構成要件【厳守】

## 1. 感情インパクト（冒頭）
- 衝撃的な質問や仮定で始める
- 読み手の現状への深い共感
- 具体的なリーダーの絶望→希望ストーリー

## 2. 一般的な課題と解決アプローチ
- 企業が直面する一般的な課題の説明
- 収集データに基づく効果の紹介（出典明記必須）
- 感情的な共感と理解

## 3. 屋久島の圧倒的描写
- 五感に訴える具体的な自然描写
- 千年杉の存在感と哲学的メッセージ
- 非日常体験の臨場感

## 4. 科学的根拠
- 収集されたデータの活用
- 他研修との比較
- 長期効果の実証

## 5. 完全統合型CTA
以下のCTAを記事の最後に完全に統合してください：

${emotionalCTA}

# 文章スタイル要件

## トーン&マナー
- **感動的**：読者の心を揺さぶる
- **確信的**：迷いのない断言調
- **物語的**：ストーリーテリングを重視
- **臨場感**：その場にいるような描写

## 禁止事項【厳守】
- 架空の人物名の創作（田中社長、A社等は禁止）
- 具体的な数値の推測・捏造（離職率○%等は禁止）
- 事実の創作（実在しない企業事例は禁止）
- 一般論や抽象的表現
- 感情に訴えない論理だけの説明
- ありきたりな研修紹介
- 緊急性のない穏やかすぎる表現

# 出力形式【厳守】
必ず以下のJSON形式で出力してください：
{
  "title": "記事タイトル（32文字以内・感動的）",
  "content": "記事本文HTML（${strategy.wordCount}・感動的CTA必須統合・バッククォート禁止）",
  "excerpt": "記事要約（150文字以内・感動的）",
  "tags": ["${strategy.keywords[0]}", "${strategy.keywords[1]}", "屋久島企業研修", "感動体験", "組織変革"],
  "meta_description": "SEO用メタディスクリプション（155文字以内）",
  "sources_used": ["参考にした情報源のURL"],
  "phase": ${phase},
  "target_keywords": ${JSON.stringify(strategy.keywords)},
  "emotion_target": "${strategy.target_emotion}"
}

重要【厳守】:
- JSON形式でのみ出力（バッククォート絶対禁止）
- contentフィールドは通常の文字列形式（HTMLタグ使用可能）
- CTAは記事の最後に必ず完全統合（電話番号・URL含む）
- 推測や創作は禁止、収集データのみ使用
- 記事は完全な形で生成（途中で終了禁止）
- 読者が今すぐ行動したくなる内容
        `;
    }

    async callClaudeAPI(prompt, title = "記事", phase = 1) {
        const requestData = JSON.stringify({
            model: this.config.claude.model,
            max_tokens: 8000, // Sonnet 4の高品質出力のため増加
            temperature: 0.7, // Sonnet 4の創造性活用
            top_p: 0.9,
            messages: [{
                role: "user",
                content: prompt
            }]
        });

        const options = {
            hostname: 'api.anthropic.com',
            port: 443,
            path: '/v1/messages',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.config.claude.apiKey,
                'anthropic-version': '2023-06-01',
                'Content-Length': Buffer.byteLength(requestData)
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        if (response.content && response.content[0] && response.content[0].text) {
                            const articleText = response.content[0].text;
                            
                            try {
                                const jsonMatch = articleText.match(/\{[\s\S]*\}/);
                                if (jsonMatch) {
                                    const article = JSON.parse(jsonMatch[0]);
                                    resolve(article);
                                } else {
                                    resolve({
                                        title: title || "感動の記事",
                                        content: articleText,
                                        excerpt: articleText.substring(0, 150) + '...',
                                        tags: ["屋久島企業研修", "感動体験", "組織変革"],
                                        meta_description: articleText.substring(0, 155),
                                        sources_used: [],
                                        phase: phase,
                                        target_keywords: ["屋久島研修"],
                                        emotion_target: "感動と行動促進"
                                    });
                                }
                            } catch (jsonError) {
                                console.error('JSON解析エラー:', jsonError.message);
                                resolve({
                                    title: title || "感動の記事",
                                    content: articleText,
                                    excerpt: articleText.substring(0, 150) + '...',
                                    tags: ["屋久島企業研修", "感動体験", "組織変革"],
                                    meta_description: articleText.substring(0, 155),
                                    sources_used: [],
                                    phase: phase,
                                    target_keywords: ["屋久島研修"],
                                    emotion_target: "感動と行動促進"
                                });
                            }
                        } else {
                            reject(new Error(`Claude APIエラー: ${response.error?.message || 'Unknown error'}`));
                        }
                    } catch (error) {
                        reject(new Error(`レスポンス解析エラー: ${error.message}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error(`Claude API呼び出しエラー: ${error.message}`));
            });

            req.write(requestData);
            req.end();
        });
    }

    async postToWordPress(article) {
        const auth = Buffer.from(`${this.config.wordpress.username}:${this.config.wordpress.password}`).toString('base64');
        
        // 出典情報を記事に含める（CTAは既に統合済み）
        let finalContent = article.content;
        if (article.sources_used && article.sources_used.length > 0) {
            finalContent += `\n\n<div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #0073aa;">`;
            finalContent += `<h4>参考文献・出典</h4><ul>`;
            article.sources_used.forEach(source => {
                finalContent += `<li><a href="${source}" target="_blank" rel="noopener">${source}</a></li>`;
            });
            finalContent += `</ul></div>`;
        }
        
        const postData = JSON.stringify({
            title: article.title,
            content: finalContent,
            excerpt: article.excerpt,
            status: this.config.article.status,
            categories: [this.config.article.category]
        });

        const options = {
            hostname: new URL(this.config.wordpress.url).hostname,
            port: 443,
            path: '/wp-json/wp/v2/posts',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        if (res.statusCode === 201) {
                            resolve(response);
                        } else {
                            reject(new Error(`WordPress投稿エラー: ${response.message || '不明なエラー'}`));
                        }
                    } catch (error) {
                        reject(new Error(`WordPressレスポンス解析エラー: ${error.message}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error(`WordPress API呼び出しエラー: ${error.message}`));
            });

            req.write(postData);
            req.end();
        });
    }

    determinePhase(articleIndex) {
        if (articleIndex < 28) return 1;
        if (articleIndex < 56) return 2; 
        if (articleIndex < 84) return 3;
        return 4;
    }

    logResult(success, message, articleNumber, phase, sources = []) {
        const timestamp = new Date().toISOString();
        const status = success ? 'SUCCESS' : 'FAILED';
        const sourceInfo = sources.length > 0 ? ` | 出典数: ${sources.length}` : '';
        const logEntry = `${timestamp} - ${status} - Phase${phase} - 感動記事${articleNumber}: ${message}${sourceInfo}\n`;
        
        fs.appendFileSync(this.logFile, logEntry);
    }
}

module.exports = EmotionalMarketingPoster;