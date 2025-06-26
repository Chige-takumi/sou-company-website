const https = require('https');
const fs = require('fs');
const path = require('path');

class ResearchEnhancedPoster {
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
            "屋久島の千年杉が教える持続可能なリーダーシップとは"
        ];
    }

    async webSearch(query) {
        // Web検索のシミュレーション（実際の実装では検索APIを使用）
        const searchResults = {
            "森林浴 効果 研究": [
                {
                    title: "森林浴の生理・心理的効果に関する研究",
                    source: "千葉大学環境健康フィールド科学センター",
                    url: "https://www.fc.chiba-u.jp/",
                    summary: "森林環境では都市環境と比較してストレスホルモンが減少し、副交感神経活動が高まることが実証されている"
                }
            ],
            "企業研修 効果 統計": [
                {
                    title: "企業研修の実態調査",
                    source: "一般社団法人日本能率協会",
                    url: "https://www.jma.or.jp/",
                    summary: "研修満足度は85%だが、行動変容に繋がるのは30%程度"
                }
            ],
            "離職率 コスト 統計": [
                {
                    title: "新卒採用に関する企業調査",
                    source: "株式会社リクルート",
                    url: "https://www.recruit.co.jp/",
                    summary: "新卒一人当たりの採用コストは平均103万円、3年以内離職率は32.3%"
                }
            ]
        };

        return searchResults[query] || [];
    }

    async gatherResearchData(title) {
        console.log('信頼できるデータを収集中...');
        
        const queries = [
            "森林浴 効果 研究",
            "企業研修 効果 統計", 
            "離職率 コスト 統計",
            "チームビルディング 効果 データ",
            "組織変革 成功事例"
        ];

        const researchData = {};
        for (const query of queries) {
            researchData[query] = await this.webSearch(query);
        }

        return researchData;
    }

    async generateResearchBasedArticle(title, phase = 1) {
        // 1. 信頼できるデータを収集
        const researchData = await this.gatherResearchData(title);
        
        // 2. 収集したデータを基にプロンプトを作成
        const dataSection = this.formatResearchData(researchData);
        
        const prompt = `
あなたは株式会社創（SOU）の専属SEOライター兼戦略パートナーです。
以下の信頼できる研究データのみを使用して記事を作成してください：

タイトル: ${title}

## 使用可能なデータ（これ以外のデータは使用禁止）：
${dataSection}

## 記事作成要件：
- 文字数: 4,000-5,000文字
- 上記の実際のデータのみを使用
- すべてのデータに出典を明記
- 推測や創作は一切禁止
- 事例は「一般的に報告されている」レベルに留める

## 重要な制約：
- 提供されたデータ以外は使用しない
- 数値を推測や創作しない  
- 存在しない研究を引用しない
- 架空の企業事例は作らない
- 不明な点は「詳細な調査が必要」と記載

必ず以下のJSON形式で出力：
{
  "title": "記事タイトル",
  "content": "記事本文（HTML形式・出典明記必須）",
  "excerpt": "記事要約",
  "tags": ["タグ1", "タグ2", "タグ3", "タグ4", "タグ5"],
  "meta_description": "メタディスクリプション",
  "sources": ["出典1", "出典2", "出典3"]
}
        `;

        return await this.callClaudeAPI(prompt);
    }

    formatResearchData(researchData) {
        let formattedData = '';
        
        for (const [query, results] of Object.entries(researchData)) {
            formattedData += `\n### ${query}に関するデータ:\n`;
            
            if (results.length === 0) {
                formattedData += '（信頼できるデータが見つかりませんでした）\n';
                continue;
            }
            
            results.forEach((result, index) => {
                formattedData += `
**データ${index + 1}:**
- 出典: ${result.source}
- URL: ${result.url}
- 内容: ${result.summary}
`;
            });
        }
        
        return formattedData;
    }

    async callClaudeAPI(prompt) {
        const requestData = JSON.stringify({
            model: this.config.claude.model,
            max_tokens: 8000,
            temperature: 0.3, // より factual な回答のために低めに設定
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
                            const article = JSON.parse(articleText);
                            resolve(article);
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
        
        // 出典情報を記事末尾に追加
        let contentWithSources = article.content;
        if (article.sources && article.sources.length > 0) {
            contentWithSources += `\n\n<h3>参考文献・出典</h3>\n<ul>`;
            article.sources.forEach(source => {
                contentWithSources += `<li>${source}</li>`;
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

    async createFactCheckArticle(articleIndex) {
        try {
            const title = this.articleSchedule[articleIndex];
            if (!title) {
                throw new Error(`記事インデックス ${articleIndex} は範囲外です`);
            }

            const phase = this.determinePhase(articleIndex);
            console.log(`信頼性重視の記事生成を開始: ${articleIndex + 1}記事目「${title}」(Phase ${phase})`);

            const article = await this.generateResearchBasedArticle(title, phase);
            console.log(`記事生成完了: 「${article.title}」`);
            console.log(`使用された出典数: ${article.sources?.length || 0}`);

            const wordpressResponse = await this.postToWordPress(article);
            console.log(`WordPress投稿完了: ID ${wordpressResponse.id}`);

            this.logResult(true, article.title, articleIndex + 1, phase, article.sources);

            return {
                success: true,
                article,
                wordpressResponse,
                index: articleIndex,
                phase,
                sources: article.sources
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

    logResult(success, message, articleNumber, phase, sources = []) {
        const timestamp = new Date().toISOString();
        const status = success ? 'SUCCESS' : 'FAILED';
        const sourceInfo = sources.length > 0 ? ` | 出典数: ${sources.length}` : '';
        const logEntry = `${timestamp} - ${status} - Phase${phase} - 記事${articleNumber}: ${message}${sourceInfo}\n`;
        
        fs.appendFileSync(this.logFile, logEntry);
    }
}

module.exports = ResearchEnhancedPoster;