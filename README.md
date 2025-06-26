# WordPress自動投稿システム

株式会社創（SOU）の屋久島企業研修事業における完全自動化ブログ記事制作・投稿システムです。

Claude APIを使用して設計書に基づいた高品質なブログ記事を自動生成し、WordPress REST APIを通じて自動投稿します。

## 🎯 プロジェクト概要

- **期間**: 2025年6月21日〜10月10日（100記事公開）
- **目標**: 問い合わせ数を現状の3-5倍（月間30件以上）に増加
- **戦略**: 「屋久島研修」関連キーワードでの独占的地位確立
- **公開頻度**: 毎日1記事（完全自動化）

## 📋 Phase別戦略

### Phase 1: 独自性確立期（1-28記事目）
- **期間**: 6/21-7/18
- **重点キーワード**: 屋久島研修、自然体験研修、アウトドア研修

### Phase 2: ターゲット拡大期（29-56記事目）
- **期間**: 7/19-8/15
- **重点キーワード**: 新任管理職、リーダーシップ研修、管理職向け研修

### Phase 3: 専門性強化期（57-84記事目）
- **期間**: 8/16-9/12
- **重点キーワード**: 企業研修、人材育成、組織開発、業界特化研修

### Phase 4: 信頼性構築期（85-100記事目）
- **期間**: 9/13-10/10
- **重点キーワード**: 成功事例、研修実績、ROI、効果測定

## 📁 ファイル構成

```
wordpress-auto-poster/
├── main.js                        # メインエントリーポイント
├── advanced-wordpress-poster.js   # 高度なWordPress投稿システム
├── wordpress-auto-poster.js       # 基本的なWordPress投稿システム
├── config.json                    # 設定ファイル
├── package.json                   # Node.jsプロジェクト設定
├── README.md                      # このファイル
└── auto-post-log.txt              # 自動投稿ログ（実行後に生成）
```

## 🚀 セットアップ

### 1. 必要な環境
- Node.js 14.0.0以上
- WordPress サイト（REST API有効）
- Claude API キー

### 2. 設定ファイルの準備

`config.json`を編集して、以下の情報を設定してください：

```json
{
  "wordpress": {
    "url": "https://your-wordpress-site.com",
    "username": "your-username",
    "password": "your-app-password"
  },
  "claude": {
    "apiKey": "your-claude-api-key",
    "model": "claude-3-haiku-20240307"
  },
  "article": {
    "minLength": 2000,
    "maxLength": 3000,
    "category": 1,
    "status": "draft"
  },
  "schedule": {
    "intervalHours": 24,
    "startTime": "09:00",
    "timezone": "Asia/Tokyo"
  }
}
```

### 3. WordPress設定

#### アプリケーションパスワードの作成
1. WordPress管理画面 → ユーザー → プロフィール
2. 「アプリケーションパスワード」セクションで新しいパスワードを生成
3. 生成されたパスワードを`config.json`の`password`に設定

#### REST APIの確認
以下のURLでREST APIが有効か確認：
```
https://your-site.com/wp-json/wp/v2/posts
```

## 💻 使用方法

### 基本コマンド

```bash
# WordPress接続テスト
node main.js test

# 記事スケジュール表示
node main.js schedule

# 指定した記事を投稿（例：1記事目）
node main.js post 1

# 自動投稿開始（1記事目から）
node main.js auto

# 自動投稿開始（5記事目から）
node main.js auto 5

# ヘルプ表示
node main.js help
```

### NPMスクリプト

```bash
# 接続テスト
npm run test

# 記事スケジュール表示
npm run schedule

# システム開始
npm start
```

## 📊 記事生成の特徴

### Phase別テンプレート
- **Phase 1**: 屋久島の独自性を前面に出した記事
- **Phase 2**: 新任管理職向けの実用的な記事
- **Phase 3**: 企業研修の専門性を示す記事
- **Phase 4**: 成功事例・実績重視の記事

### SEO最適化
- フェーズ別キーワード戦略
- 競合分析に基づいた差別化
- 内部リンク戦略の実装
- メタデータの自動最適化

### 品質管理
- 融和的権威トーンの維持
- 事実の捏造防止
- 適切な文字数管理（2,000-3,500文字）
- 科学的根拠の活用

## 📈 ログ・監視

### 自動投稿ログ
`auto-post-log.txt`に以下の情報が記録されます：
- 投稿日時
- 成功/失敗ステータス
- Phase情報
- 記事番号・タイトル
- エラー詳細（失敗時）

### ログ例
```
2025-06-25T10:00:00.000Z - SUCCESS - Phase1 - 記事1: 屋久島企業研修が組織変革に革命をもたらす5つの理由
2025-06-26T10:00:00.000Z - SUCCESS - Phase1 - 記事2: 自然環境でのチームビルディングが生み出す驚異的効果とは
```

## 🔧 トラブルシューティング

### よくある問題

#### 1. WordPress接続エラー
```bash
# 接続テストを実行
node main.js test
```
- URLが正しいか確認
- アプリケーションパスワードが正しいか確認
- REST APIが有効か確認

#### 2. Claude API エラー
- APIキーが正しいか確認
- APIの使用制限に達していないか確認
- ネットワーク接続を確認

#### 3. 記事生成エラー
- プロンプトが長すぎる場合は分割
- モデルの制限を確認
- レスポンス形式を確認

## 📝 カスタマイズ

### 記事テンプレートの編集
`advanced-wordpress-poster.js`の以下のメソッドを編集：
- `getPhase1Template()`
- `getPhase2Template()`
- `getPhase3Template()`
- `getPhase4Template()`

### 記事スケジュールの変更
`loadArticleSchedule()`メソッドで記事タイトル一覧を管理

### 投稿間隔の調整
`config.json`の`schedule.intervalHours`を変更

## 🚨 注意事項

### セキュリティ
- `config.json`をバージョン管理に含めない
- APIキーを安全に管理
- アプリケーションパスワードの定期的な更新

### コンテンツ品質
- 生成された記事は必ず確認
- 事実確認の徹底
- ブランドトーンの維持

### 法的考慮事項
- 著作権侵害の回避
- 薬機法・景表法の遵守
- プライバシーポリシーの確認

## 📞 サポート

システムに関する質問やトラブルについては、プロジェクト担当者までご連絡ください。

---

**株式会社創（SOU）**  
『今ここ』から創める、未来を創る  
人と組織の可能性を引き出すパートナー