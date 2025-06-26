const https = require('https');
const fs = require('fs');
const path = require('path');

class FinalWebSearchPoster {
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
                wordCount: "2,000-2,500文字",
                template: "A"
            },
            2: {
                goal: "「新任管理職」関連キーワードでトップ10入り", 
                kpi: "月間PV 3,000、問い合わせ8件",
                keywords: ["新任管理職", "リーダーシップ研修", "管理職向け研修"],
                wordCount: "2,000-2,500文字",
                template: "B"
            },
            3: {
                goal: "業界特化キーワードでの上位表示",
                kpi: "月間PV 7,000、問い合わせ15件", 
                keywords: ["企業研修", "人材育成", "組織開発", "業界特化研修"],
                wordCount: "2,500-3,500文字",
                template: "C"
            },
            4: {
                goal: "問い合わせ件数月25件達成",
                kpi: "月間PV 12,000、問い合わせ25件",
                keywords: ["成功事例", "研修実績", "ROI", "効果測定"],
                wordCount: "2,500-3,500文字", 
                template: "D"
            }
        };
        return strategies[phase] || strategies[1];
    }

    getArticleTemplate(templateType) {
        const templates = {
            A: `## A. 屋久島研修特化型テンプレート

H1: [屋久島研修の独自価値を示すタイトル]（32文字以内）
H2: 導入・現状認識（企業が抱える課題への共感）
H2: 課題の深掘り（なぜその課題が生まれるのか）
H2: 屋久島研修というソリューション（独自のアプローチ）
H3: 屋久島の自然環境が持つ特別な効果
H3: 具体的なプログラム内容
H3: 他の研修との違い
H2: 実際の導入事例・体験談（リアルな変化）
H2: 導入時の工夫・ポイント（成功要因）
H2: まとめ・結論
H2: CTA（自然な流れでの問い合わせ誘導）`,

            B: `## B. 新任管理職支援型テンプレート

H1: [管理職の具体的課題解決を示すタイトル]
H2: 新任管理職が直面する現実（読者の状況への共感）
H2: 問題の本質・背景（なぜその問題が起きるのか）
H2: 解決へのアプローチ（具体的な改善方法）
H3: 方法1：基本的な取り組み
H3: 方法2：応用的な手法
H3: 方法3：継続のコツ
H2: 屋久島研修での実践例（自然環境での学び）
H2: 実装時の注意点・成功のポイント
H2: まとめ・結論
H2: CTA（課題解決への支援提案）`,

            C: `## C. 業界特化・専門型テンプレート

H1: [業界特有課題の解決を示すタイトル]
H2: 業界の現状と課題（業界特有の問題認識）
H2: 従来のアプローチの限界（既存手法の課題）
H2: 新しいアプローチの提案（屋久島研修の応用）
H3: 業界特化の工夫・カスタマイズ
H3: 実装プロセス
H3: 期待される効果
H2: 導入成功事例（同業他社での成果）
H2: 導入時の考慮点・注意事項
H2: まとめ・結論
H2: CTA（業界特化の相談提案）`,

            D: `## D. 成功事例・実績型テンプレート

H1: [具体的成果を示すタイトル]
H2: 企業背景・抱えていた課題
H2: 解決への取り組み（屋久島研修の選択理由）
H2: 実施プロセス・内容
H3: 事前準備
H3: 研修当日の流れ
H3: 事後フォロー
H2: 得られた成果・変化（具体的な効果）
H2: 成功要因の分析（なぜうまくいったのか）
H2: 学び・今後への展開
H2: CTA（同様の成果を求める企業への提案）`
        };
        return templates[templateType] || templates.A;
    }

    getPhaseCTA(phase) {
        const ctas = {
            1: `本記事では、[記事テーマ]をテーマに、組織力向上の考え方や取り組みをご紹介してきました。

株式会社創では、屋久島の世界自然遺産環境を活用した企業研修プログラムをご提供しています。屋久島の大自然の中で行う研修は、従来の座学では得られない深い気づきと本質的な変化を実現します。

組織のコミュニケーションを活性化させたい、社内エンゲージメントを高め生産性を向上させたい、といった課題をお持ちの方は、弊社までお気軽にお問い合わせください。

お問い合わせ：https://www.sou-yakushima.com/contact`,

            2: `本記事では、[記事テーマ]をテーマに、組織力向上の考え方や取り組みをご紹介してきました。

株式会社創では、屋久島の世界自然遺産環境を活用した企業研修プログラムをご提供しています。屋久島の大自然の中で行う研修は、従来の座学では得られない深い気づきと本質的な変化を実現します。

組織のコミュニケーションを活性化させたい、社内エンゲージメントを高め生産性を向上させたい、といった課題をお持ちの方は、弊社までお気軽にお問い合わせください。

お問い合わせ：https://www.sou-yakushima.com/contact`,

            3: `本記事では、[記事テーマ]について、実践的なアプローチと成功のポイントをお伝えしました。

株式会社創では、[記事内容]でお悩みの企業様に向けて、屋久島の自然環境を活用した独自の研修プログラムをご提供しています。従来の研修とは一線を画す、自然の中での体験学習によって、持続的な組織変革を実現いたします。

貴社の課題に合わせたカスタマイズプログラムの設計から実施、効果測定まで、トータルでサポートいたします。まずは貴社の現状についてお聞かせください。

お問い合わせ：https://www.sou-yakushima.com/contact`,

            4: `本記事でご紹介した[事例内容]のような成果は、適切な研修設計と実施環境があってこそ実現できるものです。

株式会社創では、屋久島の豊かな自然環境を活用し、貴社の具体的な課題に応じたオーダーメイドの研修プログラムを設計・実施いたします。事前のヒアリングから研修実施、継続的なフォローまで、確実な成果創出をお約束します。

同様の成果をお求めの企業様、組織の根本的な変革をお考えの経営者・人事担当者様は、ぜひ一度ご相談ください。貴社の状況に最適なソリューションをご提案いたします。

お問い合わせ：https://www.sou-yakushima.com/contact`
        };
        return ctas[phase] || ctas[1];
    }

    async generateCompetitorSearchQueries(title, phase) {
        const strategy = this.getPhaseStrategy(phase);
        const baseQueries = strategy.keywords.map(keyword => `"${keyword}" 企業研修 効果`);
        
        return [
            ...baseQueries,
            `${title} 関連記事`,
            "企業研修 事例 データ",
            "組織変革 成功事例 統計",
            "研修効果 測定 方法",
            "離職率 改善 研修",
            "チームビルディング 効果 研究"
        ];
    }

    async createFactBasedArticle(articleIndex, webSearchFunction) {
        try {
            const title = this.articleSchedule[articleIndex];
            if (!title) {
                throw new Error(`記事インデックス ${articleIndex} は範囲外です`);
            }

            const phase = this.determinePhase(articleIndex);
            const strategy = this.getPhaseStrategy(phase);
            const template = this.getArticleTemplate(strategy.template);
            const cta = this.getPhaseCTA(phase);

            console.log(`Phase ${phase} 記事生成開始: ${articleIndex + 1}記事目「${title}」`);
            console.log(`目標: ${strategy.goal}`);

            // Web検索で競合分析とデータ収集
            const searchQueries = await this.generateCompetitorSearchQueries(title, phase);
            const searchResults = {};

            for (const query of searchQueries) {
                try {
                    console.log(`検索実行: ${query}`);
                    const results = await webSearchFunction(query);
                    searchResults[query] = results;
                    await new Promise(resolve => setTimeout(resolve, 1000)); // レート制限対策
                } catch (error) {
                    console.warn(`検索失敗 (${query}): ${error.message}`);
                    searchResults[query] = [];
                }
            }

            // 検索結果をフォーマット
            const researchData = this.formatSearchResults(searchResults);

            // 完全なプロンプトを構築
            const fullPrompt = this.buildFullPrompt(title, phase, strategy, template, cta, researchData);

            // Claude APIで記事生成
            const article = await this.callClaudeAPI(fullPrompt, title, phase);
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
                sources: article.sources_used
            };

        } catch (error) {
            const title = this.articleSchedule[articleIndex] || 'Unknown';
            console.error('記事作成エラー:', error.message);
            this.logResult(false, error.message, articleIndex + 1, this.determinePhase(articleIndex));
            
            return {
                success: false,
                error: error.message,
                index: articleIndex,
                phase: this.determinePhase(articleIndex)
            };
        }
    }

    formatSearchResults(searchResults) {
        let formatted = "\n## 事実確認済みデータ・競合分析結果:\n";
        
        for (const [query, results] of Object.entries(searchResults)) {
            formatted += `\n### ${query} の検索結果:\n`;
            
            if (!results || results.length === 0) {
                formatted += "（関連データが見つかりませんでした）\n";
                continue;
            }

            results.slice(0, 3).forEach((result, index) => {
                formatted += `
**情報源 ${index + 1}:**
- タイトル: ${result.title || 'タイトル不明'}
- URL: ${result.url || 'URL不明'}  
- 概要: ${result.snippet || result.description || '概要なし'}
`;
            });
        }
        return formatted;
    }

    buildFullPrompt(title, phase, strategy, template, cta, researchData) {
        return `
あなたは株式会社創（SOU）の専属SEOライター兼戦略パートナーです。
以下の設計書に完全準拠して、高品質なブログ記事を作成してください。

## 記事情報
- タイトル: ${title}
- Phase: ${phase} (${strategy.goal})
- 対象読者: 成長企業の次世代リーダー候補（28-40歳）、課長・マネージャー・人事担当者
- 文字数: ${strategy.wordCount}

## Phase ${phase} 戦略
- 目標: ${strategy.goal}
- KPI: ${strategy.kpi}
- 重点キーワード: ${strategy.keywords.join(', ')}

## 記事構成テンプレート
${template}

## ブランドトーン【厳守】
融和的権威（Harmonious Authority）:
- 渡邉匠の人格を反映：謙虚でありながら確固たる専門性
- 自然の知恵とビジネス実践の融合
- 経営者への敬意と実用的支援のバランス
- 丁寧語（です・ます調）100%使用
- 自然比喩の適切な使用

${researchData}

## SEO最適化要件【必須】
- タイトル: 32文字以内、主要キーワード前半配置
- 見出し構造: H1→H2（250-300語毎）→H3（詳細分割）
- キーワード密度: 主要キーワード1-2%、自然な配置
- 内部リンク: 関連記事への自然なリンク設置

## 禁止事項【厳守】
- 事実の捏造: 事例、数値、統計の創作は厳禁
- 株式会社創の実績数値の推測: 具体的な効果は推測しない
- 具体的期間の断定: 「継続的な」等の表現を使用
- 競合記事のコピー: 完全オリジナルコンテンツのみ
- ブランドトーン逸脱: 融和的権威から外れた表現禁止

## CTA（記事末尾に必須）
${cta}

## 出力形式【厳守】
必ず以下のJSON形式でのみ出力してください：
{
  "title": "記事タイトル（32文字以内・キーワード前半配置）",
  "content": "記事本文（HTML形式・${strategy.wordCount}・出典明記必須）",
  "excerpt": "記事要約（150文字以内）",
  "tags": ["${strategy.keywords[0]}", "${strategy.keywords[1]}", "屋久島企業研修", "組織変革", "株式会社創"],
  "meta_description": "SEO用メタディスクリプション（155文字以内・キーワード含有）",
  "sources_used": ["実際に参考にした情報源のURL"],
  "phase": ${phase},
  "target_keywords": ${JSON.stringify(strategy.keywords)}
}

重要: 
- 検索結果から得られた事実のみを使用
- 推測や創作は一切禁止
- 出典の明記を徹底
- ブランドトーンと記事構成テンプレートを厳守
        `;
    }

    async callClaudeAPI(prompt, title = "記事", phase = 1) {
        const requestData = JSON.stringify({
            model: this.config.claude.model,
            max_tokens: 8000,
            temperature: 0.3, // 事実重視のため低く設定
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
                            console.log('Claude APIレスポンス（最初の500文字）:', articleText.substring(0, 500));
                            
                            try {
                                // JSON部分を抽出
                                const jsonMatch = articleText.match(/\{[\s\S]*\}/);
                                if (jsonMatch) {
                                    const article = JSON.parse(jsonMatch[0]);
                                    resolve(article);
                                } else {
                                    // JSONが見つからない場合はプレーンテキストとして処理
                                    resolve({
                                        title: title || "生成された記事",
                                        content: articleText,
                                        excerpt: articleText.substring(0, 150) + '...',
                                        tags: ["屋久島企業研修", "組織変革"],
                                        meta_description: articleText.substring(0, 155),
                                        sources_used: [],
                                        phase: phase,
                                        target_keywords: ["屋久島研修"]
                                    });
                                }
                            } catch (jsonError) {
                                console.error('JSON解析エラー:', jsonError.message);
                                resolve({
                                    title: title || "生成された記事",
                                    content: articleText,
                                    excerpt: articleText.substring(0, 150) + '...',
                                    tags: ["屋久島企業研修", "組織変革"],
                                    meta_description: articleText.substring(0, 155),
                                    sources_used: [],
                                    phase: phase,
                                    target_keywords: ["屋久島研修"]
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
        
        let contentWithSources = article.content;
        if (article.sources_used && article.sources_used.length > 0) {
            contentWithSources += `\n\n<h3>参考文献・出典</h3>\n<ul>`;
            article.sources_used.forEach(source => {
                contentWithSources += `<li><a href="${source}" target="_blank" rel="noopener noreferrer">${source}</a></li>`;
            });
            contentWithSources += `</ul>`;
        }
        
        const postData = JSON.stringify({
            title: article.title,
            content: contentWithSources,
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
        const logEntry = `${timestamp} - ${status} - Phase${phase} - 記事${articleNumber}: ${message}${sourceInfo}\n`;
        
        fs.appendFileSync(this.logFile, logEntry);
    }
}

module.exports = FinalWebSearchPoster;