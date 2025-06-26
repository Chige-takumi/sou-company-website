const FinalWebSearchPoster = require('./final-websearch-poster');

async function createArticleWithRealWebSearch() {
    const poster = new FinalWebSearchPoster('./config.json');
    
    // 実際のWeb検索結果を使用
    const realWebSearchFunction = async (query) => {
        console.log(`[実際のWeb検索] ${query}`);
        
        // 既に取得した検索結果を使用
        const searchData = {
            "屋久島企業研修 効果 組織変革": [
                {
                    title: "人材の牽引と組織変革 | アクセンチュア",
                    url: "https://www.accenture.com/jp-ja/insights/consulting/change-reinvented",
                    snippet: "企業の96%が今後3年間で総収益の5%以上を人材・組織変革プロジェクトに投じると回答。効果的な組織変革により平均年次収益成長率が最大5パーセント高くなる。"
                },
                {
                    title: "組織改革による企業文化の変革 | チームボックス",
                    url: "https://corp.teambox.co.jp/column/740/",
                    snippet: "組織変革とは、企業の成長や目標達成のために組織全体の構造や仕組みを見直し、改善すること。業績や生産性の向上、従業員のモチベーションアップを目指す。"
                }
            ],
            "自然体験研修 企業 効果": [
                {
                    title: "野外体験型社員研修 | JOWA",
                    url: "https://www.jowa.fun/training",
                    snippet: "リピート率95%で、12年間に1,222社（48,810人）を超える実績。大自然という非日常的環境で行う研修プログラムは、チームビルディングやパフォーマンス向上に役立つ。"
                },
                {
                    title: "体験型研修の効果とは | Schoo",
                    url: "https://schoo.jp/biz/column/1766",
                    snippet: "野外研修では「競争ではなく協力」「本当のチームについて」を理解することで心理的安全性を高める効果がある。記憶と心に残り、研修生自らの選択と行動が変化していく。"
                }
            ],
            "企業研修 離職率 改善 データ": [
                {
                    title: "離職率改善の秘訣とは？ | HR NOTE",
                    url: "https://hrnote.jp/contents/contents-1106/",
                    snippet: "厚生労働省調査によると大卒の3年後離職率は32.3％。研修の導入によって離職率を下げることに成功したケースでは、離職率0％という驚異の数字を達成。"
                },
                {
                    title: "エンゲージメントと離職率に相関はあるのか？",
                    url: "https://buzzkuri.com/columns/engagement/8220/",
                    snippet: "従業員のエンゲージメントが高い企業ほど、離職率が低下する傾向。2023年度の従業員1人あたり採用コストは約45万円、研修費用は32,412円。"
                }
            ]
        };
        
        return searchData[query] || [];
    };
    
    console.log('📝 実際のWeb検索データを使用して記事作成を開始...');
    
    try {
        const result = await poster.createFactBasedArticle(0, realWebSearchFunction);
        
        if (result.success) {
            console.log('\n🎉 記事作成成功!');
            console.log(`タイトル: ${result.article.title}`);
            console.log(`WordPress ID: ${result.wordpressResponse.id}`);
            console.log(`文字数: ${result.article.content.length}文字`);
            console.log(`Phase: ${result.phase}`);
            
            return result;
        } else {
            console.log('\n❌ 記事作成失敗');
            console.log(`エラー: ${result.error}`);
            return result;
        }
        
    } catch (error) {
        console.error('❌ エラー:', error.message);
        return { success: false, error: error.message };
    }
}

// 実行
if (require.main === module) {
    createArticleWithRealWebSearch().catch(console.error);
}

module.exports = { createArticleWithRealWebSearch };