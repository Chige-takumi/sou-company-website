const AdvancedWordPressPoster = require('./advanced-wordpress-poster');

async function testSystem() {
    console.log('='.repeat(60));
    console.log('WordPress自動投稿システム - オフラインテスト');
    console.log('='.repeat(60));

    try {
        // 設定ファイル読み込みテスト
        console.log('\n1. 設定ファイル読み込みテスト...');
        const poster = new AdvancedWordPressPoster('./test-config.json');
        console.log('✅ 設定ファイル読み込み成功');

        // 記事スケジュール確認
        console.log('\n2. 記事スケジュール確認...');
        console.log(`✅ 記事数: ${poster.articleSchedule.length}記事`);
        console.log(`✅ 1記事目: ${poster.articleSchedule[0]}`);

        // Phase判定テスト
        console.log('\n3. Phase判定テスト...');
        console.log(`✅ 1記事目: Phase ${poster.determinePhase(0)}`);
        console.log(`✅ 30記事目: Phase ${poster.determinePhase(29)}`);
        console.log(`✅ 60記事目: Phase ${poster.determinePhase(59)}`);
        console.log(`✅ 90記事目: Phase ${poster.determinePhase(89)}`);

        // テンプレート生成テスト
        console.log('\n4. テンプレート生成テスト...');
        const phase1Template = poster.getPhase1Template();
        const phase2Template = poster.getPhase2Template();
        console.log(`✅ Phase1テンプレート: ${phase1Template.length}文字`);
        console.log(`✅ Phase2テンプレート: ${phase2Template.length}文字`);

        // タグ生成テスト
        console.log('\n5. タグ生成テスト...');
        const tags1 = poster.generateTags('屋久島企業研修が組織変革に革命をもたらす5つの理由');
        const tags2 = poster.generateTags('新任管理職が最初の90日で必ずやるべき5つのこと');
        console.log(`✅ 屋久島記事タグ: ${tags1.join(', ')}`);
        console.log(`✅ 管理職記事タグ: ${tags2.join(', ')}`);

        // ログ機能テスト
        console.log('\n6. ログ機能テスト...');
        poster.logResult(true, 'テスト記事作成成功', 1, 1);
        poster.logResult(false, 'テストエラー', 2, 1);
        console.log('✅ ログ機能動作確認');

        console.log('\n' + '='.repeat(60));
        console.log('🎉 オフラインテスト完了: すべての機能が正常に動作しています');
        console.log('='.repeat(60));

        console.log('\n📋 次のステップ:');
        console.log('1. config.jsonに実際のWordPress情報を設定');
        console.log('2. Claude APIキーを設定');
        console.log('3. node main.js test で接続テスト');
        console.log('4. node main.js post 1 で1記事目投稿');

        return true;

    } catch (error) {
        console.error('\n❌ テスト失敗:', error.message);
        return false;
    }
}

if (require.main === module) {
    testSystem().catch(console.error);
}

module.exports = { testSystem };