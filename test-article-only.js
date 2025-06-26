const EmotionalMarketingPoster = require('./emotional-marketing-poster');

// 記事生成のみのテスト（WordPress投稿なし）
async function webSearchForArticleTest(query) {
    console.log(`[記事生成テスト] ${query}`);
    
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

async function testArticleGeneration() {
    console.log('='.repeat(70));
    console.log('📝 記事生成テスト（WordPress投稿なし）');
    console.log('修正されたプロンプトの検証');
    console.log('='.repeat(70));
    
    try {
        const poster = new EmotionalMarketingPoster('./config.json');
        
        const articleIndex = 2; // 3記事目
        const title = poster.articleSchedule[articleIndex];
        const phase = poster.determinePhase(articleIndex);
        
        console.log(`\n📊 テスト記事: ${title}`);
        console.log(`Phase: ${phase}`);
        
        // Web検索データ収集
        const searchResults = await poster.gatherWebSearchData(title, webSearchForArticleTest);
        const researchData = poster.formatSearchResults(searchResults);
        
        console.log('\n🔍 収集データ確認:');
        console.log(researchData.substring(0, 200) + '...');
        
        // プロンプト構築
        const strategy = poster.getPhaseStrategy(phase);
        const storyTemplate = poster.getEmotionalStoryTemplate(phase);
        const successStory = poster.getSuccessStoryTemplate(phase);
        const emotionalCTA = poster.generateEmotionalCTA(phase, strategy);
        
        const prompt = poster.buildEmotionalPrompt(
            title, phase, strategy, storyTemplate, successStory, emotionalCTA, researchData
        );
        
        console.log('\n🎯 修正されたプロンプト確認:');
        console.log('✅ 架空人物名創作禁止');
        console.log('✅ 具体的数値推測禁止');
        console.log('✅ 事実創作禁止');
        
        // Claude API呼び出し（記事生成のみ）
        console.log('\n🤖 Claude API呼び出し...');
        const article = await poster.callClaudeAPI(prompt, title, phase);
        
        console.log('\n🎉 記事生成完了!');
        console.log(`📝 タイトル: ${article.title}`);
        console.log(`📋 文字数: ${article.content?.length || 0}文字`);
        
        // 問題要素のチェック
        const content = article.content || '';
        
        // 人物名チェック
        const personNames = content.match(/田中|佐藤|山田|鈴木.*?社長|.*?氏/g) || [];
        
        // 具体的数値チェック
        const specificNumbers = content.match(/離職率\d+%|生産性\d+%向上|満足度\d+%/g) || [];
        
        // 架空企業名チェック
        const companyNames = content.match(/A社|B社|C社|D社/g) || [];
        
        // 記事完全性チェック
        const hasIncompleteContent = content.includes('[以下、') || 
                                   content.includes('...が続きます') ||
                                   content.includes('文字が続きます') ||
                                   content.length < 500;
        
        console.log('\n🔍 詳細品質チェック:');
        console.log(`👤 人物名: ${personNames.length > 0 ? `❌ ${personNames.join(', ')}` : '✅ なし'}`);
        console.log(`📊 具体数値: ${specificNumbers.length > 0 ? `❌ ${specificNumbers.join(', ')}` : '✅ なし'}`);
        console.log(`🏢 架空企業: ${companyNames.length > 0 ? `❌ ${companyNames.join(', ')}` : '✅ なし'}`);
        console.log(`📄 記事完全性: ${hasIncompleteContent ? '❌ 不完全' : '✅ 完全'}`);
        
        // CTAチェック
        const hasPhone = content.includes('0997-42-0321');
        const hasURL = content.includes('sou-yakushima.com');
        console.log(`📞 連絡先統合: ${hasPhone ? '✅' : '❌'}`);
        console.log(`🌐 URL統合: ${hasURL ? '✅' : '❌'}`);
        
        // 記事内容の表示
        console.log('\n📖 生成された記事内容:');
        console.log('-'.repeat(50));
        console.log(content.substring(0, 800));
        if (content.length > 800) {
            console.log('\n...[記事は続いています]...');
        }
        console.log('-'.repeat(50));
        
        return {
            success: true,
            article,
            checks: {
                personNames: personNames.length === 0,
                specificNumbers: specificNumbers.length === 0,
                companyNames: companyNames.length === 0,
                complete: !hasIncompleteContent,
                hasPhone,
                hasURL
            }
        };
        
    } catch (error) {
        console.error('\n💥 エラー:', error.message);
        return { success: false, error: error.message };
    }
}

// テスト実行
if (require.main === module) {
    testArticleGeneration().catch(console.error);
}

module.exports = { testArticleGeneration };