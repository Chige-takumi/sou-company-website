const EmotionalMarketingPoster = require('./emotional-marketing-poster');

// 修正されたシステムのテスト用Web検索
async function webSearchForTest(query) {
    console.log(`[修正システムWeb検索] ${query}`);
    
    const searchData = {
        "企業研修 成功事例 データ": [
            {
                title: "企業研修効果に関する調査報告書 | 厚生労働省",
                url: "https://www.mhlw.go.jp/research/training-effects",
                snippet: "適切な企業研修の実施により、従業員のスキル向上と組織の生産性向上が期待できることが調査で明らかになっている。"
            }
        ],
        "組織変革 効果 統計": [
            {
                title: "組織変革の成功要因分析 | 日本能率協会",
                url: "https://www.jma.or.jp/organization-change",
                snippet: "組織変革を成功させる企業には共通の特徴があり、継続的な学習と体験型アプローチが重要な要素として挙げられる。"
            }
        ],
        "屋久島 自然環境 効果": [
            {
                title: "森林環境が人に与える影響 | 森林総合研究所",
                url: "https://www.ffpri.affrc.go.jp/forest-effects",
                snippet: "森林環境では、都市部と比較してストレス軽減効果やリラクゼーション効果が高いことが研究により示されている。"
            }
        ]
    };
    
    return searchData[query] || [];
}

async function testFixedSystem() {
    console.log('='.repeat(70));
    console.log('🔧 修正されたシステムのテスト');
    console.log('事実捏造禁止・人物名創作禁止システム');
    console.log('='.repeat(70));
    
    try {
        const poster = new EmotionalMarketingPoster('./config.json');
        
        console.log('\n✅ 修正内容確認:');
        console.log('- 架空の人物名創作禁止');
        console.log('- 具体的数値の推測・捏造禁止');
        console.log('- 事実の創作禁止');
        console.log('- 文字数制限調整（2,000-2,500文字）');
        console.log('- API応答パラメータ調整');
        
        console.log('\n📊 テスト記事設定:');
        console.log('記事: 3記事目「製造業の安全意識向上に屋久島研修が効果的な3つの理由」');
        console.log('Phase: 1');
        
        const articleIndex = 2; // 3記事目
        const result = await poster.createEmotionalArticle(articleIndex, webSearchForTest);
        
        if (result.success) {
            console.log('\n🎉 修正システムテスト成功!');
            console.log(`📝 タイトル: ${result.article.title}`);
            console.log(`🆔 WordPress ID: ${result.wordpressResponse.id}`);
            console.log(`📋 文字数: ${result.article.content.length}文字`);
            
            // 問題要素のチェック
            const content = result.article.content;
            const hasPersonName = /田中|佐藤|山田|社長|氏/.test(content);
            const hasSpecificNumbers = /\d+%/.test(content);
            const hasCompanyNames = /A社|B社|C社/.test(content);
            const hasIncompleteContent = content.includes('[以下、') || content.includes('...が続きます');
            
            console.log('\n🔍 品質チェック結果:');
            console.log(`👤 人物名創作: ${hasPersonName ? '❌ 発見' : '✅ なし'}`);
            console.log(`📊 具体的数値: ${hasSpecificNumbers ? '❌ 発見' : '✅ なし'}`);
            console.log(`🏢 架空企業名: ${hasCompanyNames ? '❌ 発見' : '✅ なし'}`);
            console.log(`📄 記事完全性: ${hasIncompleteContent ? '❌ 不完全' : '✅ 完全'}`);
            
            if (!hasPersonName && !hasSpecificNumbers && !hasCompanyNames && !hasIncompleteContent) {
                console.log('\n🎊 すべてのチェックをクリア！修正成功');
            } else {
                console.log('\n⚠️  まだ問題が残っています');
            }
            
            // 記事の最初の部分を表示
            console.log('\n📖 記事冒頭（最初の300文字）:');
            console.log(content.substring(0, 300) + '...');
            
            return result;
            
        } else {
            console.log('\n❌ テスト失敗');
            console.log(`エラー: ${result.error}`);
            return result;
        }
        
    } catch (error) {
        console.error('\n💥 システムエラー:', error.message);
        return { success: false, error: error.message };
    }
}

// テスト実行
if (require.main === module) {
    testFixedSystem().catch(console.error);
}

module.exports = { testFixedSystem };