const AdvancedWordPressPoster = require('./advanced-wordpress-poster');

async function main() {
    console.log('='.repeat(50));
    console.log('株式会社創 WordPress自動投稿システム');
    console.log('='.repeat(50));

    try {
        const poster = new AdvancedWordPressPoster('./config.json');

        const args = process.argv.slice(2);
        const command = args[0];

        switch (command) {
            case 'test':
                console.log('WordPress接続テストを実行します...');
                const testResult = await poster.testConnection();
                if (testResult) {
                    console.log('✅ WordPress接続テスト成功');
                } else {
                    console.log('❌ WordPress接続テスト失敗');
                }
                break;

            case 'post':
                const articleIndex = parseInt(args[1]) - 1;
                if (isNaN(articleIndex) || articleIndex < 0) {
                    console.log('使用方法: node main.js post [記事番号]');
                    console.log('例: node main.js post 1');
                    return;
                }
                
                console.log(`${articleIndex + 1}記事目を投稿します...`);
                const result = await poster.createScheduledArticle(articleIndex);
                
                if (result.success) {
                    console.log('✅ 記事投稿成功');
                    console.log(`記事タイトル: ${result.article.title}`);
                    console.log(`Phase: ${result.phase}`);
                    console.log(`WordPress ID: ${result.wordpressResponse.id}`);
                } else {
                    console.log('❌ 記事投稿失敗');
                    console.log(`エラー: ${result.error}`);
                }
                break;

            case 'auto':
                const startIndex = parseInt(args[1]) - 1 || 0;
                console.log(`自動投稿を開始します（${startIndex + 1}記事目から）...`);
                console.log('Ctrl+Cで停止できます');
                await poster.startAutoPosting(startIndex);
                break;

            case 'schedule':
                console.log('記事スケジュール一覧:');
                console.log('-'.repeat(50));
                poster.articleSchedule.forEach((title, index) => {
                    const phase = poster.determinePhase(index);
                    console.log(`${(index + 1).toString().padStart(3)}: [Phase${phase}] ${title}`);
                });
                break;

            case 'help':
            default:
                console.log('使用可能なコマンド:');
                console.log('  test              - WordPress接続テスト');
                console.log('  post [番号]       - 指定した記事を投稿');
                console.log('  auto [開始番号]   - 自動投稿開始（デフォルト: 1記事目から）');
                console.log('  schedule          - 記事スケジュール表示');
                console.log('  help              - このヘルプを表示');
                console.log('');
                console.log('例:');
                console.log('  node main.js test');
                console.log('  node main.js post 1');
                console.log('  node main.js auto 5');
                console.log('  node main.js schedule');
                break;
        }

    } catch (error) {
        console.error('エラーが発生しました:', error.message);
        console.log('config.jsonファイルが正しく設定されているか確認してください');
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { main };