const https = require('https');
const fs = require('fs');
const path = require('path');

class WordPressAutoPoster {
    constructor(config) {
        this.config = {
            wordpress: {
                url: config.wordpress?.url || '',
                username: config.wordpress?.username || '',
                password: config.wordpress?.password || ''
            },
            claude: {
                apiKey: config.claude?.apiKey || '',
                model: config.claude?.model || 'claude-3-haiku-20240307'
            },
            article: {
                topics: config.article?.topics || ['テクノロジー', 'ビジネス', 'ライフスタイル'],
                minLength: config.article?.minLength || 800,
                maxLength: config.article?.maxLength || 1500,
                category: config.article?.category || 1,
                status: config.article?.status || 'draft'
            }
        };
    }

    async generateArticle(topic) {
        const prompt = `以下のトピックについて、日本語でブログ記事を書いてください：

トピック: ${topic}

要件:
- 文字数は${this.config.article.minLength}文字以上${this.config.article.maxLength}文字以下
- SEOを意識したタイトルと内容
- 読者にとって有益な情報を含める
- 自然で読みやすい文章
- HTMLタグは使用しないでください

以下のJSON形式で返してください：
{
  "title": "記事のタイトル",
  "content": "記事の本文",
  "excerpt": "記事の要約（150文字以内）",
  "tags": ["タグ1", "タグ2", "タグ3"]
}`;

        const requestData = JSON.stringify({
            model: this.config.claude.model,
            max_tokens: 4000,
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
                            const jsonMatch = articleText.match(/\{[\s\S]*\}/);
                            if (jsonMatch) {
                                const article = JSON.parse(jsonMatch[0]);
                                resolve(article);
                            } else {
                                reject(new Error('記事のJSON形式が見つかりません'));
                            }
                        } else {
                            reject(new Error('Claude APIから有効な応答が得られませんでした'));
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
        
        const postData = JSON.stringify({
            title: article.title,
            content: article.content,
            excerpt: article.excerpt,
            status: this.config.article.status,
            categories: [this.config.article.category],
            tags: article.tags || []
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

    getRandomTopic() {
        const topics = this.config.article.topics;
        return topics[Math.floor(Math.random() * topics.length)];
    }

    async createAndPublishArticle(topic = null) {
        try {
            const selectedTopic = topic || this.getRandomTopic();
            console.log(`記事生成を開始: トピック「${selectedTopic}」`);

            const article = await this.generateArticle(selectedTopic);
            console.log(`記事生成完了: 「${article.title}」`);

            const wordpressResponse = await this.postToWordPress(article);
            console.log(`WordPress投稿完了: ID ${wordpressResponse.id}`);

            return {
                success: true,
                article,
                wordpressResponse,
                topic: selectedTopic
            };
        } catch (error) {
            console.error('記事作成・投稿エラー:', error.message);
            return {
                success: false,
                error: error.message,
                topic: topic || 'unknown'
            };
        }
    }

    async scheduleAutoPosts(intervalHours = 24) {
        console.log(`自動投稿を開始: ${intervalHours}時間間隔`);
        
        const runPost = async () => {
            const result = await this.createAndPublishArticle();
            const timestamp = new Date().toISOString();
            
            if (result.success) {
                console.log(`[${timestamp}] 自動投稿成功: 「${result.article.title}」`);
            } else {
                console.error(`[${timestamp}] 自動投稿失敗: ${result.error}`);
            }

            fs.appendFileSync(
                path.join(__dirname, 'auto-post-log.txt'),
                `${timestamp} - ${result.success ? 'SUCCESS' : 'FAILED'}: ${result.success ? result.article.title : result.error}\n`
            );
        };

        await runPost();
        setInterval(runPost, intervalHours * 60 * 60 * 1000);
    }
}

module.exports = WordPressAutoPoster;