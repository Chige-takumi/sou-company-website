const https = require('https');
const fs = require('fs');
const path = require('path');

class AdvancedWordPressPoster {
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

    async generateArticleWithTemplate(title, phase = 1) {
        const templates = {
            1: this.getPhase1Template(),
            2: this.getPhase2Template(),
            3: this.getPhase3Template(),
            4: this.getPhase4Template()
        };

        const template = templates[phase] || templates[1];
        const prompt = template.replace('{{TITLE}}', title);

        const requestData = JSON.stringify({
            model: this.config.claude.model,
            max_tokens: 8000,
            temperature: this.config.claude.temperature || 0.7,
            top_p: this.config.claude.top_p || 0.9,
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
                                // JSONをそのまま解析を試みる
                                const article = JSON.parse(articleText);
                                resolve(article);
                            } catch (jsonError) {
                                // JSON解析に失敗した場合、プレーンテキストとして処理
                                resolve({
                                    title: title,
                                    content: articleText,
                                    excerpt: articleText.substring(0, 150) + '...',
                                    tags: this.generateTags(title)
                                });
                            }
                        } else {
                            console.log('Error response:', response);
                            reject(new Error(`Claude APIエラー: ${response.error?.message || 'Unknown error'}`));
                        }
                    } catch (error) {
                        console.log('Parse error. Raw response:', data.substring(0, 500));
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

    getPhase1Template() {
        return `
あなたは株式会社創（SOU）の専属SEOライター兼戦略パートナーとして、以下のサンプル記事と同レベルの高品質記事を作成してください：

タイトル: {{TITLE}}

## 記事作成要件：
- 文字数: 4,000-5,000文字（ボリューム重視の長文記事）
- トーン: 融和的権威（謙虚でありながら確固たる専門性を示す）
- 対象読者: 組織変革に課題を抱える中小企業経営者
- 主要キーワード: 屋久島企業研修、組織変革、チームビルディング
- 渡邉匠（研修講師・ファシリテーター・プロコーチ）の人格を反映
- 形式: WordPressでそのまま公開できるHTML形式

## 記事品質基準：
1. **科学的根拠**: 具体的な研究データ・統計を活用
2. **事例ストーリー**: 実在感のある企業事例（A社、B社等）
3. **数値の具体化**: ROI、改善率、コスト比較を明記
4. **構造化**: 見出し、箇条書き、太字で読みやすく
5. **CTA**: 明確な行動喚起（無料相談、資料ダウンロード）

## 記事構成（サンプル記事準拠）：
1. **記事概要**: 魅力的な概要文
2. **問題提起**: 統計データで課題を証明
3. **科学的根拠**: 大学研究等の信頼できるデータ
4. **独自性**: 屋久島ならではの価値提案
5. **効果**: 5つの具体的な理由・効果
6. **実施プロセス**: 3日間の詳細スケジュール
7. **事例**: 2社の before/after
8. **ROI分析**: 投資対効果の数値比較
9. **FAQ**: よくある質問3-4個
10. **まとめ＋CTA**: 行動促進

## 重要事項：
- 株式会社創の実績数値は推測しない
- 一般的な研修・組織変革データを活用
- 事例は「A社」「B社」等の匿名表記
- 科学的根拠は信頼できる機関のデータを使用
- 内部リンク機会を自然に設ける

必ず以下のJSON形式でのみ出力してください（余計な説明は一切不要）：
{
  "title": "記事タイトル（32文字以内）",
  "content": "記事の本文（WordPress用HTML形式・文字化け厳禁・4000文字以上必須）",
  "excerpt": "記事の要約（150文字以内）",
  "tags": ["タグ1", "タグ2", "タグ3", "タグ4", "タグ5"],
  "meta_description": "SEO用メタディスクリプション（155文字以内）"
}

重要事項：
- contentは必ず4000文字以上のボリューム重視
- HTMLタグを使用（<h2>, <p>, <strong>, <ul>, <li>等）
- 文字化けを避けるため特殊文字の使用禁止
- マークダウンではなくHTML形式
- 記号や絵文字は使用禁止
- 詳細な事例、具体的なデータ、豊富な説明で文字数を確保
        `;
    }

    getPhase2Template() {
        return `
あなたは株式会社創（SOU）の専属SEOライター兼戦略パートナーとして、新任管理職向けの記事を作成してください：

タイトル: {{TITLE}}

## 記事作成要件：
- 文字数: 2,000-2,500文字
- トーン: 融和的権威（実践的でサポート的）
- 対象読者: 新任管理職、人事担当者
- 主要キーワード: 新任管理職、リーダーシップ研修、管理職向け研修
- 実用的で具体的なアドバイスを重視

## 記事構成：
1. 新任管理職の課題・悩みに共感
2. 解決策の提示（具体的な手法）
3. 実践的なテクニック・ツール
4. 注意点・失敗パターン
5. 成長のためのマインドセット
6. まとめとアクション

必ず以下のJSON形式でのみ出力してください（余計な説明は一切不要）：
{
  "title": "記事タイトル（32文字以内）",
  "content": "記事の本文（WordPress用HTML形式・文字化け厳禁・4000文字以上必須）",
  "excerpt": "記事の要約（150文字以内）",
  "tags": ["タグ1", "タグ2", "タグ3", "タグ4", "タグ5"],
  "meta_description": "SEO用メタディスクリプション（155文字以内）"
}

重要事項：
- contentは必ず4000文字以上のボリューム重視
- HTMLタグを使用（<h2>, <p>, <strong>, <ul>, <li>等）
- 文字化けを避けるため特殊文字の使用禁止
- マークダウンではなくHTML形式
- 記号や絵文字は使用禁止
- 詳細な事例、具体的なデータ、豊富な説明で文字数を確保
        `;
    }

    getPhase3Template() {
        return `
あなたは株式会社創（SOU）の専属SEOライター兼戦略パートナーとして、企業研修の専門性を示す記事を作成してください：

タイトル: {{TITLE}}

## 記事作成要件：
- 文字数: 2,500-3,500文字
- トーン: 融和的権威（専門性と実用性のバランス）
- 対象読者: 人事担当者、経営者、研修担当者
- 主要キーワード: 企業研修、人材育成、組織開発
- 業界特化の内容を含める

## 記事構成：
1. 業界特有の課題の分析
2. 解決策の体系的説明
3. 手法・プロセスの詳細
4. 効果測定・ROI
5. 実施上の注意点
6. 成功事例（一般的な研修効果を活用）
7. まとめと次のステップ

必ず以下のJSON形式でのみ出力してください（余計な説明は一切不要）：
{
  "title": "記事タイトル（32文字以内）",
  "content": "記事の本文（WordPress用HTML形式・文字化け厳禁・4000文字以上必須）",
  "excerpt": "記事の要約（150文字以内）",
  "tags": ["タグ1", "タグ2", "タグ3", "タグ4", "タグ5"],
  "meta_description": "SEO用メタディスクリプション（155文字以内）"
}

重要事項：
- contentは必ず4000文字以上のボリューム重視
- HTMLタグを使用（<h2>, <p>, <strong>, <ul>, <li>等）
- 文字化けを避けるため特殊文字の使用禁止
- マークダウンではなくHTML形式
- 記号や絵文字は使用禁止
- 詳細な事例、具体的なデータ、豊富な説明で文字数を確保
        `;
    }

    getPhase4Template() {
        return `
あなたは株式会社創（SOU）の専属SEOライター兼戦略パートナーとして、成功事例・実績重視の記事を作成してください：

タイトル: {{TITLE}}

## 記事作成要件：
- 文字数: 2,500-3,500文字
- トーン: 融和的権威（実績に基づく信頼性）
- 対象読者: 研修導入を検討中の経営者・人事担当者
- 主要キーワード: 成功事例、研修実績、ROI、効果測定
- 具体的な成果・データを重視

## 記事構成：
1. 成功事例の背景・課題
2. 取り組み内容の詳細
3. 具体的な成果・変化
4. 成功要因の分析
5. 他社への応用可能性
6. ROI・効果測定の方法
7. まとめと行動促進

## 重要事項：
- 株式会社創の具体的な実績数値は推測しない
- 一般的な研修効果のデータを活用
- 「継続的なフォローアップ」等の表現を使用

必ず以下のJSON形式でのみ出力してください（余計な説明は一切不要）：
{
  "title": "記事タイトル（32文字以内）",
  "content": "記事の本文（WordPress用HTML形式・文字化け厳禁・4000文字以上必須）",
  "excerpt": "記事の要約（150文字以内）",
  "tags": ["タグ1", "タグ2", "タグ3", "タグ4", "タグ5"],
  "meta_description": "SEO用メタディスクリプション（155文字以内）"
}

重要事項：
- contentは必ず4000文字以上のボリューム重視
- HTMLタグを使用（<h2>, <p>, <strong>, <ul>, <li>等）
- 文字化けを避けるため特殊文字の使用禁止
- マークダウンではなくHTML形式
- 記号や絵文字は使用禁止
- 詳細な事例、具体的なデータ、豊富な説明で文字数を確保
        `;
    }

    generateTags(title) {
        const allTags = [
            "屋久島企業研修", "組織変革", "チームビルディング", "リーダーシップ研修",
            "自然体験研修", "アウトドア研修", "新任管理職", "人材育成", "組織開発",
            "企業研修", "研修効果", "マネジメント", "コミュニケーション", "イノベーション"
        ];
        
        const relevantTags = allTags.filter(tag => 
            title.includes(tag.replace(/研修|企業/, '')) || 
            tag.includes(title.split('の')[0])
        );
        
        return relevantTags.slice(0, 5);
    }

    async postToWordPress(article) {
        const auth = Buffer.from(`${this.config.wordpress.username}:${this.config.wordpress.password}`).toString('base64');
        
        const postData = JSON.stringify({
            title: article.title,
            content: article.content,
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

    async createScheduledArticle(articleIndex) {
        try {
            const title = this.articleSchedule[articleIndex];
            if (!title) {
                throw new Error(`記事インデックス ${articleIndex} は範囲外です`);
            }

            const phase = this.determinePhase(articleIndex);
            console.log(`記事生成を開始: ${articleIndex + 1}記事目「${title}」(Phase ${phase})`);

            const article = await this.generateArticleWithTemplate(title, phase);
            console.log(`記事生成完了: 「${article.title}」`);

            const wordpressResponse = await this.postToWordPress(article);
            console.log(`WordPress投稿完了: ID ${wordpressResponse.id}`);

            this.logResult(true, article.title, articleIndex + 1, phase);

            return {
                success: true,
                article,
                wordpressResponse,
                index: articleIndex,
                phase
            };
        } catch (error) {
            const title = this.articleSchedule[articleIndex] || 'Unknown';
            console.error('記事作成・投稿エラー:', error.message);
            this.logResult(false, error.message, articleIndex + 1, this.determinePhase(articleIndex));
            
            return {
                success: false,
                error: error.message,
                index: articleIndex,
                phase: this.determinePhase(articleIndex)
            };
        }
    }

    determinePhase(articleIndex) {
        if (articleIndex < 28) return 1;
        if (articleIndex < 56) return 2;
        if (articleIndex < 84) return 3;
        return 4;
    }

    logResult(success, message, articleNumber, phase) {
        const timestamp = new Date().toISOString();
        const status = success ? 'SUCCESS' : 'FAILED';
        const logEntry = `${timestamp} - ${status} - Phase${phase} - 記事${articleNumber}: ${message}\n`;
        
        fs.appendFileSync(this.logFile, logEntry);
    }

    async startAutoPosting(startIndex = 0) {
        console.log(`自動投稿を開始: ${startIndex + 1}記事目から`);
        
        const intervalMs = this.config.schedule.intervalHours * 60 * 60 * 1000;
        let currentIndex = startIndex;

        const postNext = async () => {
            if (currentIndex >= this.articleSchedule.length) {
                console.log('全記事の投稿が完了しました');
                return;
            }

            await this.createScheduledArticle(currentIndex);
            currentIndex++;

            if (currentIndex < this.articleSchedule.length) {
                setTimeout(postNext, intervalMs);
            }
        };

        await postNext();
    }

    async testConnection() {
        try {
            const testArticle = {
                title: "テスト投稿",
                content: "これはWordPress接続テストです。",
                excerpt: "WordPress接続テスト",
                tags: ["テスト"],
                meta_description: "WordPress接続テスト"
            };

            console.log('WordPress接続テストを開始...');
            const response = await this.postToWordPress(testArticle);
            console.log('WordPress接続テスト成功:', response.id);
            return true;
        } catch (error) {
            console.error('WordPress接続テスト失敗:', error.message);
            return false;
        }
    }
}

module.exports = AdvancedWordPressPoster;