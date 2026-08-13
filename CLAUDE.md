# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

各パッケージ固有の詳細ルールは、それぞれのディレクトリの `CLAUDE.md` を参照してください。

## プロジェクト概要

猫管理アプリケーション。pnpm モノレポ構成：
- **apps/api** - Hono による API サーバー（詳細: [apps/api/CLAUDE.md](apps/api/CLAUDE.md)）
- **apps/mobile** - Expo/React Native モバイルアプリ（詳細: [apps/mobile/CLAUDE.md](apps/mobile/CLAUDE.md)）
- **packages/db** - Drizzle ORM による共有データベース層（詳細: [packages/db/CLAUDE.md](packages/db/CLAUDE.md)）

## 主要コマンド

```bash
# 開発（全アプリを並列実行）
pnpm dev
```

各パッケージ個別のコマンド（dev/lint/build/DB マイグレーション等）は、各パッケージの CLAUDE.md を参照してください。

## アーキテクチャ概要

- **apps/api**: Hono + `@hono/node-server`（ポート 8080）。ルートは機能別に分割し、Valibot でバリデーション
- **apps/mobile**: Expo Router によるファイルベースルーティング。認証状態はグローバルな Context で管理
- **packages/db**: LibSQL (Turso) + Drizzle ORM。`@repo/db` としてワークスペース間で型とスキーマを共有

## 主要パターン（全体共通）

- React Compiler を API とモバイル両方で有効化（パフォーマンス向上）
- Expo New Architecture 有効
- 全パッケージで TypeScript strict モード
- `@repo/db` を通じて型とスキーマを共有

## サブエージェント

`.claude/.agents/` に専門エージェントを配置：
- `api-dev.md` - API バックエンド（Hono / Valibot / 認証）担当
- `drizzle-dev.md` - データベース層（Drizzle ORM / スキーマ / マイグレーション）担当
