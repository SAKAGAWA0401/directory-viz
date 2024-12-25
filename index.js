const fs = require('fs');
const path = require('path');

// ディレクトリ構造を取得する関数
function getDirectoryStructure(dir, excludedDirs) {
  const result = {};

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // 各エントリを分類
  const dirs = [];
  const skippedDirs = [];
  const files = [];

  for (const entry of entries) {
    if (excludedDirs.includes(entry.name)) {
      skippedDirs.push({ name: entry.name, value: '...omitted' });
    } else if (entry.isDirectory()) {
      dirs.push({
        name: entry.name,
        value: getDirectoryStructure(path.join(dir, entry.name), excludedDirs),
      });
    } else {
      files.push({ name: entry.name, value: null });
    }
  }

  // 指定された順序で結合
  return [...dirs, ...skippedDirs, ...files];
}

// ディレクトリ構造をオブジェクト形式に変換
function structureToObject(structure) {
  const result = {};
  for (const entry of structure) {
    result[entry.name] = entry.value || null;
    }
  return result;
}

// 出力形式：ツリーテキスト形式
function toTreeText(structure, indent = '') {
    let result = '';
  
    if (Array.isArray(structure)) {
      // 配列の場合
      for (const entry of structure) {
        if (entry.value === '...omitted') {
          result += `${indent}├── ${entry.name} (...omitted)\n`;
        } else if (entry.value === null) {
          result += `${indent}├── ${entry.name}\n`;
        } else {
          result += `${indent}├── ${entry.name}\n`;
          result += toTreeText(entry.value, indent + '│   '); // 再帰処理
        }
      }
    } else if (typeof structure === 'object') {
      // トップレベルの辞書型の場合
      for (const key in structure) {
        const value = structure[key];
        result += `${indent}${key}:\n`;
        result += toTreeText(value, indent + '  '); // 再帰処理
      }
    } else {
      console.error('構造に問題があります: ', structure);
    }
  
    return result;
  }

// 出力形式：YAML形式
function toYaml(structure, indent = '') {
    let result = '';
  
    if (Array.isArray(structure)) {
      // 配列の場合
      for (const entry of structure) {
        if (entry.value === '...omitted') {
          result += `${indent}- ${entry.name}: ...omitted\n`;
        } else if (entry.value === null) {
          result += `${indent}- ${entry.name}\n`;
        } else {
          result += `${indent}- ${entry.name}:\n`;
          result += toYaml(entry.value, indent + '  '); // 再帰処理
        }
      }
    } else if (typeof structure === 'object') {
      // トップレベルの辞書型の場合
      for (const key in structure) {
        const value = structure[key];
        if (Array.isArray(value)) {
          result += `${indent}${key}:\n`;
          result += toYaml(value, indent + '  '); // 再帰処理
        } else {
          result += `${indent}${key}: ${value}\n`;
        }
      }
    } else {
      console.error('構造に問題があります: ', structure);
    }
  
    return result;
  }

// 出力形式：JSON形式
function toJson(structure) {
  return JSON.stringify(structureToObject(structure), null, 2);
}

// メイン処理
function main() {
  // コマンドライン引数の取得
  const args = process.argv.slice(2);
  const targetDir = args[0]; // 第1引数: 対象ディレクトリ
  const format = args[1] || 'tree'; // 第2引数: 出力形式 (デフォルト: tree)
  const excludedDirs = args[2] ? args[2].split(',') : []; // 第3引数: 除外ディレクトリ (カンマ区切り)
  const dirName = path.basename(targetDir);

  if (!targetDir) {
    console.error('エラー: 対象ディレクトリを指定してください。');
    process.exit(1);
  }

  if (!fs.existsSync(targetDir)) {
    console.error(`エラー: 指定されたディレクトリが見つかりません: ${targetDir}`);
    process.exit(1);
  }

  // ディレクトリ構造を取得
  const structure = getDirectoryStructure(targetDir, excludedDirs);

  // トップディレクトリとして `basename` を追加
  const structuredWithTopDir = [{ name: dirName ,value: structure },];

  // 指定フォーマットで出力
  let output;
  switch (format) {
    case 'tree':
      output = toTreeText(structuredWithTopDir);
      break;
    case 'yaml':
      output = toYaml(structuredWithTopDir);
      break;
    case 'json':
      output = toJson(structuredWithTopDir);
      break;
    default:
      console.error(`エラー: 未対応のフォーマット形式です: ${format}`);
      process.exit(1);
  }

  // 結果をファイルに保存
  const outputFile = `output/${dirName}-directory-structure.${format === 'tree' ? 'txt' : format}`;
  fs.writeFileSync(outputFile, output, 'utf-8');
  console.log(`ディレクトリ構造を ${outputFile} に出力しました！`);
}

main();
