const ResearchEnhancedPoster = require('./research-enhanced-poster');

async function main() {
    console.log('='.repeat(60));
    console.log('株式会社創 信頼性重視WordPress自動投稿システム');
    console.log('='.repeat(60));

    try {
        const poster = new ResearchEnhancedPoster('./config.json');

        const args = process.argv.slice(2);
        const command = args[0];

        switch (command) {
            case 'research-post':
                const articleIndex = parseInt(args[1]) - 1;
                if (isNaN(articleIndex) || articleIndex < 0) {
                    console.log('使用方法: node main-research.js research-post [記事番号]');
                    console.log('例: node main-research.js research-post 1');
                    return;
                }
                
                console.log(`${articleIndex + 1}記事目を信頼性重視で投稿します...`);
                console.log('⚠️  実際のデータを収集して記事を生成します');
                const result = await poster.createFactCheckArticle(articleIndex);
                
                if (result.success) {
                    console.log('✅ 信頼性重視記事投稿成功');
                    console.log(`記事タイトル: ${result.article.title}`);
                    console.log(`Phase: ${result.phase}`);
                    console.log(`WordPress ID: ${result.wordpressResponse.id}`);
                    console.log(`使用出典数: ${result.sources?.length || 0}`);
                    if (result.sources?.length > 0) {
                        console.log('出典一覧:');
                        result.sources.forEach((source, index) => {
                            console.log(`  ${index + 1}. ${source}`);
                        });
                    }
                } else {
                    console.log('❌ 記事投稿失敗');
                    console.log(`エラー: ${result.error}`);
                }
                break;

            case 'test-research':
                console.log('データ収集テストを実行します...');
                const testData = await poster.gatherResearchData('屋久島企業研修のテスト');
                console.log('収集されたデータ:');
                console.log(JSON.stringify(testData, null, 2));
                break;

            case 'help':
            default:
                console.log('信頼性重視システムのコマンド:');
                console.log('  research-post [番号]  - 信頼できるデータで記事投稿');
                console.log('  test-research         - データ収集テスト');
                console.log('  help                  - このヘルプを表示');
                console.log('');
                console.log('例:');
                console.log('  node main-research.js research-post 1');
                console.log('  node main-research.js test-research');
                console.log('');
                console.log('⚠️  このシステムは実際のデータのみを使用し、');
                console.log('    推測や創作を一切行いません。');
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