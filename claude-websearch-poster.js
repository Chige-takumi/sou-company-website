const https = require('https');
const fs = require('fs');
const path = require('path');

class ClaudeWebSearchPoster {
    constructor(configPath = './config.json') {
        this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        this.articleSchedule = this.loadArticleSchedule();
        this.logFile = path.join(__dirname, 'auto-post-log.txt');
        this.webSearchTool = null; // WebSearchツールの参照
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

    // WebSearchツールを設定（外部から注入）
    setWebSearchTool(webSearchTool) {
        this.webSearchTool = webSearchTool;
    }

    async gatherWebSearchData(title) {
        if (!this.webSearchTool) {
            throw new Error('WebSearchツールが設定されていません');
        }

        console.log('Claude Web検索で信頼できるデータを収集中...');
        
        const searchQueries = [
            "森林浴 効果 研究 科学的根拠",
            "企業研修 効果測定 統計データ",
            "離職率 コスト 日本 統計",
            "チームビルディング 研修 効果 データ",
            "組織変革 成功事例 研究",
            "屋久島 自然環境 効果 研究"
        ];

        const searchResults = {};
        
        for (const query of searchQueries) {
            try {
                console.log(`検索中: ${query}`);
                const results = await this.webSearchTool.search(query);
                searchResults[query] = results;
                
                // 検索間隔を置く（API制限対策）
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`検索エラー (${query}):`, error.message);
                searchResults[query] = [];
            }
        }

        return searchResults;
    }

    formatWebSearchResults(searchResults) {
        let formattedData = '\n## 収集された信頼できるデータ:\n';
        
        for (const [query, results] of Object.entries(searchResults)) {
            formattedData += `\n### ${query}に関する検索結果:\n`;
            
            if (!results || results.length === 0) {
                formattedData += '（該当するデータが見つかりませんでした）\n';
                continue;
            }
            
            results.forEach((result, index) => {
                if (index < 3) { // 上位3件のみ使用
                    formattedData += `
**情報源${index + 1}:**
- タイトル: ${result.title || 'タイトル不明'}
- URL: ${result.url || 'URL不明'}
- 概要: ${result.snippet || result.description || '概要なし'}
`;
                }
            });
        }
        
        return formattedData;
    }

    async generateWebSearchBasedArticle(title, customPrompt, phase = 1) {
        // 1. Web検索でデータ収集
        const searchResults = await this.gatherWebSearchData(title);
        
        // 2. 検索結果をフォーマット
        const searchDataSection = this.formatWebSearchResults(searchResults);
        
        // 3. カスタムプロンプトにデータを統合
        const finalPrompt = `
${customPrompt}

記事タイトル: ${title}

${searchDataSection}

## 重要な制約:
- 上記の検索結果から得られた情報のみを使用してください
- すべてのデータ・統計には具体的な出典を明記してください
- 検索結果にないデータは推測や創作しないでください
- 不明な点は「詳細な調査が必要」と記載してください
- URLが提供されている場合は、出典として記載してください

## 出力形式:
必ず以下のJSON形式で出力してください：
{
  "title": "記事タイトル（32文字以内）",
  "content": "記事本文（HTML形式・4000文字以上・出典明記必須）",
  "excerpt": "記事要約（150文字以内）",
  "tags": ["タグ1", "タグ2", "タグ3", "タグ4", "タグ5"],
  "meta_description": "SEO用メタディスクリプション（155文字以内）",
  "sources_used": ["使用した出典のURL1", "使用した出典のURL2"]
}
        `;

        return await this.callClaudeAPI(finalPrompt);
    }

    async callClaudeAPI(prompt) {
        const requestData = JSON.stringify({
            model: this.config.claude.model,
            max_tokens: 8000,
            temperature: this.config.claude.temperature || 0.3,
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
                                const article = JSON.parse(articleText);
                                resolve(article);
                            } catch (jsonError) {
                                // JSON解析に失敗した場合の処理
                                resolve({
                                    title: title,
                                    content: articleText,
                                    excerpt: articleText.substring(0, 150) + '...',
                                    tags: ["屋久島企業研修", "組織変革"],
                                    meta_description: articleText.substring(0, 155),
                                    sources_used: []
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
        
        // 出典情報を記事末尾に追加
        let contentWithSources = article.content;
        if (article.sources_used && article.sources_used.length > 0) {
            contentWithSources += `\n\n<h3>参考文献・出典</h3>\n<ul>`;
            article.sources_used.forEach(source => {
                contentWithSources += `<li><a href="${source}" target="_blank" rel="noopener">${source}</a></li>`;
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

    async createWebSearchArticle(articleIndex, customPrompt) {
        try {
            const title = this.articleSchedule[articleIndex];
            if (!title) {
                throw new Error(`記事インデックス ${articleIndex} は範囲外です`);
            }

            const phase = this.determinePhase(articleIndex);
            console.log(`Web検索ベース記事生成開始: ${articleIndex + 1}記事目「${title}」(Phase ${phase})`);

            const article = await this.generateWebSearchBasedArticle(title, customPrompt, phase);
            console.log(`記事生成完了: 「${article.title}」`);
            console.log(`使用された出典数: ${article.sources_used?.length || 0}`);

            const wordpressResponse = await this.postToWordPress(article);
            console.log(`WordPress投稿完了: ID ${wordpressResponse.id}`);

            this.logResult(true, article.title, articleIndex + 1, phase, article.sources_used);

            return {
                success: true,
                article,
                wordpressResponse,
                index: articleIndex,
                phase,
                sources: article.sources_used
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

module.exports = ClaudeWebSearchPoster;