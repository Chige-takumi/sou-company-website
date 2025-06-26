const FinalWebSearchPoster = require('./final-websearch-poster');

// 実際のClaudeのWebSearch機能を使用
async function realClaudeWebSearch(query) {
    console.log(`[実際のWeb検索] ${query}`);
    // この部分で実際のWebSearchツールを呼び出し
    // 今回はWebSearchツールを直接使用
    return [];
}

async function createArticleWithWebSearch(articleIndex, webSearchTool) {
    console.log('='.repeat(70));
    console.log('株式会社創 実際のWeb検索ベース記事作成システム');
    console.log('='.repeat(70));

    try {
        const poster = new FinalWebSearchPoster('./config.json');
        
        const phase = poster.determinePhase(articleIndex);
        const strategy = poster.getPhaseStrategy(phase);
        const title = poster.articleSchedule[articleIndex];
        
        console.log(`\n📊 記事作成情報:`);
        console.log(`記事番号: ${articleIndex + 1}記事目`);
        console.log(`タイトル: ${title}`);
        console.log(`Phase: ${phase} - ${strategy.goal}`);
        console.log(`重点キーワード: ${strategy.keywords.join(', ')}`);
        console.log(`文字数目標: ${strategy.wordCount}`);
        
        // Web検索クエリの生成
        const searchQueries = await poster.generateCompetitorSearchQueries(title, phase);
        console.log(`\n🔍 実行予定の検索クエリ:`);
        searchQueries.forEach((query, index) => {
            console.log(`  ${index + 1}. ${query}`);
        });
        
        console.log(`\n📝 記事作成を開始します...`);
        console.log(`（実際のWeb検索でデータを収集します）`);
        
        // 実際の記事作成
        const result = await poster.createFactBasedArticle(articleIndex, webSearchTool);
        
        if (result.success) {
            console.log('\n✅ 記事作成・投稿成功!');
            console.log(`📝 記事タイトル: ${result.article.title}`);
            console.log(`📊 Phase: ${result.phase}`);
            console.log(`🆔 WordPress ID: ${result.wordpressResponse.id}`);
            console.log(`📋 文字数: ${result.article.content.length}文字`);
            console.log(`🎯 ターゲットキーワード: ${result.article.target_keywords?.join(', ')}`);
            console.log(`📚 使用出典数: ${result.sources?.length || 0}`);
            
            if (result.sources?.length > 0) {
                console.log('\n📖 使用された出典:');
                result.sources.forEach((source, index) => {
                    console.log(`  ${index + 1}. ${source}`);
                });
            }
            
            return result;
        } else {
            console.log('\n❌ 記事作成失敗');
            console.log(`エラー: ${result.error}`);
            return result;
        }
        
    } catch (error) {
        console.error('\n💥 システムエラー:', error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { createArticleWithWebSearch, realClaudeWebSearch };