# Catalyst Center Learning Mock V2 - Phase 1 設計

## 1. V2 全体方針

- V2 は V1 とは独立した新規プロジェクトとして扱い、Catalyst Center の標準的な Product Flow 理解を最優先にする。
- 主導線は **Discovery → Inventory → Topology → Device 360 → Assurance** とし、Phase 1 ではこのうち前半 5 画面（Assurance は入口確認まで）に集中する。
- Dashboard は Assurance 起点ではなく、Product Flow 全体のハブとして定義する。
- UI は学習専用演出（クイズ、漫画チュートリアル）を排除し、運用現場に近い高密度業務 UI を維持する。
- データはローカルモック完結とし、将来の共通 UI/テーマ再利用を見据えてドメインと表示を疎結合に設計する。
- 画面ごとの単独理解より、
  - Discovery 結果が Inventory へ
  - Inventory の整備状態が Topology 表示へ
  - Device 単位の到達可能性が Device 360 表示可否へ
  という因果を一貫して追える構造を重視する。

## 2. Phase 1 の対象範囲

### 対象（主役）

- Dashboard (Product Flow Hub)
- Discovery
- Inventory
- Topology
- Device 360

### 対象外（Phase 1 では脇役）

- Assurance（主要 KPI の入口リンクのみ）
- Troubleshooting
- Command Runner
- Compliance
- Software

### 完了条件（Phase 1）

- Discovery 実行結果の状態差分（成功/部分成功/失敗）が Inventory・Topology・Device 360 に反映される。
- Device Detail 概念を Device 360 入口として再定義し、導線上で自然に到達できる。
- Seed シナリオ切替で「発見前後の状態変化」が視覚的・構造的に確認できる。

## 3. 画面一覧

### 3.1 Dashboard (Product Flow Hub)

- 役割: Product Flow 全体の現在地と次アクションを示すハブ。
- 主情報:
  - Discovery 状態サマリ（未実行/進行中/成功/部分成功/失敗）
  - Inventory 取り込み状況（discovered / managed / unassigned）
  - Topology 生成状態（未生成/部分生成/整合性警告あり）
  - Device 360 到達性（表示可/不可の台数）
- 主操作:
  - Discovery 開始
  - 最新 Discovery Job 詳細へ遷移
  - Inventory の未割当デバイス一覧へ遷移
  - Topology の警告ノードへ遷移

### 3.2 Discovery

- 役割: 製品導線の入口機能。
- 主情報:
  - Discovery プロファイル（IP レンジ、credential set、preferred management IP）
  - 実行履歴（job 単位）
  - 結果分類（success / partial / failed）
- 主操作:
  - Discovery Job 作成・実行
  - Job ごとの失敗理由確認（credential mismatch 等）
  - 対象ノードを Inventory/Topology で追跡

### 3.3 Inventory

- 役割: Discovery 後の確認・整備画面。
- 主情報:
  - discovered / managed / unassigned / unreachable
  - site assignment 状態
  - role / platform / management IP の整合性
- 主操作:
  - site assignment
  - role 補正
  - Device 360 への遷移

### 3.4 Topology

- 役割: Discovery/Inventory 結果の可視化。
- 主情報:
  - ノード/リンク生成状況
  - 不自然表示（role 誤認識、未割当、未管理）
  - サイト単位の健全性比較（healthy vs degraded）
- 主操作:
  - ノード選択で Device 360 へ遷移
  - 警告ノードから Inventory フィルタへ遷移

### 3.5 Device 360

- 役割: Device Detail の再定義先。個別デバイスの全体像を確認。
- 主情報:
  - 基本情報（role/site/management IP/source）
  - 到達性・収集状態（WLC の management IP 依存を含む）
  - 直近イベント/history（Discovery 再実行、site assignment 変更、role 補正）
- 主操作:
  - 関連イベントから Discovery Job / Inventory レコードへ戻る
  - トポロジ上の位置へジャンプ

## 4. 画面遷移

- Dashboard
  - → Discovery（初回導線、再実行導線）
  - → Inventory（未割当/要修正デバイス）
  - → Topology（整合性警告）
  - → Device 360（注目デバイス）
- Discovery
  - → Inventory（job で discovered になったデバイス一覧）
  - → Topology（job 結果反映後の可視化）
- Inventory
  - → Device 360（行クリック）
  - → Topology（対象デバイスの接続確認）
- Topology
  - → Device 360（ノードクリック）
  - → Inventory（警告ノード一覧）
- Device 360
  - → Discovery（関連 job へ戻る）
  - → Inventory（属性補正へ戻る）
  - → Topology（配置文脈へ戻る）

## 5. データモデル案

### 5.1 エンティティ

- `discoveryProfiles`
  - id, name, ipRanges, credentialSetIds, preferredMgmtIpPolicy, schedule
- `discoveryJobs`
  - id, profileId, startedAt, endedAt, status, summaryCounts, failureReason
- `devices`
  - id, hostname, serial, platform, roleDetected, roleNormalized, state, managedState
  - managementIps (array), selectedManagementIp, preferredMgmtIpSource
  - siteId, discoveryState, lastDiscoveryJobId, reachability
- `sites`
  - id, name, parentId, healthState, kpis
- `topologyNodes`
  - id, deviceId, nodeType, renderState (normal/warn/hidden)
- `topologyLinks`
  - id, srcNodeId, dstNodeId, linkState
- `device360Snapshots`
  - id, deviceId, collectedAt, visible, visibilityReason, assuranceBridgeState
- `deviceHistoryEvents`
  - id, deviceId, eventType, eventAt, sourceModule, before, after

### 5.2 状態遷移の要点

- Discovery Job 完了で `devices.discoveryState` を更新。
- Inventory 操作（site assignment / role 補正）で `devices` を更新し、`deviceHistoryEvents` を追記。
- Topology は `devices` と `sites` の最新状態から再計算され、`topologyNodes.renderState` に警告を反映。
- Device 360 表示可否は `selectedManagementIp` と到達性判定で `device360Snapshots.visible` を更新。

### 5.3 将来拡張ポイント

- 共通 UI/テーマ再利用のため、画面は `viewModel` 層経由でドメイン参照。
- Phase 2 以降の Assurance 連携は `assuranceBridgeState` を利用して追加可能。

## 6. seed シナリオ案

1. **Discovery success**
   - 期待: 全対象が discovered→managed へ遷移し、Topology が自然表示。
2. **Discovery partial success**
   - 期待: 一部 unreachable/unassigned が残り、Inventory と Topology に警告。
3. **credential mismatch による Discovery failed**
   - 期待: Job failed、対象 device は未更新、失敗理由が明示される。
4. **preferred management IP の違いで結果が変わるケース**
   - 期待: selectedManagementIp の差で managed 可否や 360 可視性が変化。
5. **discovered だが unassigned の device**
   - 期待: Inventory で未割当として残り、Topology では警告ノード化。
6. **site assignment 後に Topology に反映されるケース**
   - 期待: assignment 実施後にノード配置と site health 集計が更新。
7. **role 誤認識により Topology 表示が不自然になるケース**
   - 期待: role 補正前は不自然リンク、補正後に正常化。
8. **WLC の management IP 依存で 360 表示可否が変わるケース**
   - 期待: IP 切替で Device 360 の visible/hidden が反転。
9. **healthy site と degraded site の比較**
   - 期待: Dashboard/Topology で同時比較可能。
10. **Device 360 で history が意味を持つケース**
   - 期待: Discovery→assignment→role補正の履歴時系列で現状態の理由が追える。

## 7. ディレクトリ構成案

```text
/src
  /app
    /routes
      dashboard
      discovery
      inventory
      topology
      device-360
  /domain
    /discovery
    /inventory
    /topology
    /device360
    /site
  /data
    /seed
      scenarios
      fixtures
    /repositories
  /mappers
    /view-model
  /components
    /layout
    /tables
    /panels
    /topology
  /theme
    /tokens
    /modes
  /state
    /flow
    /filters
/docs
  v2-phase1-design.md
```

- ポイント:
  - `domain` と `view-model` を分離し、将来の共通 UI/テーマ流用を容易化。
  - `seed/scenarios` を独立させ、状態変化デモを再現しやすくする。

## 8. 実装優先順位

1. **ドメイン定義と seed シナリオ基盤**
   - まず状態遷移を再現できるデータ土台を固める。
2. **Dashboard (Product Flow Hub)**
   - 全体導線の現在地を先に提示し、各画面への接続点を作る。
3. **Discovery 画面**
   - Job 実行と結果分類を実装し、下流データ更新を確定。
4. **Inventory 画面**
   - Discovery 結果の確認と整備（site/role）を実装。
5. **Topology 画面**
   - Inventory 整備結果が可視化へ反映されることを実装。
6. **Device 360 画面**
   - 個別詳細と history で因果追跡を完成。
7. **横断調整**
   - ライト/ダーク最終調整、導線一貫性、seed 切替 UX を整備。
