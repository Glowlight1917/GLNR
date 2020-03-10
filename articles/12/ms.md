% 共和国の自動化 その3. pandocを用いたhtmlへの変換
% Glowlight
% 2018.03.15

## はじめに

### 自動化の流れ

背景: 科学アカデミーの記事を楽に書きたい.

1. 科学アカデミーの記事をMarkdownで記述することにした. 使うツールだRemarkableを採用.
2. Markdown -> html の変換はpandocを使う.
3. **Markdownを一括でhtmlに変換するスクリプトを書く.**
4. 全部の記事についての情報を取得するスクリプトを書く.
5. 科学アカデミーのリンク集を自動生成
6. 科学アカデミーのディレクトリを同期する.
7. 更新情報を自動更新

この記事で扱う内容は3番めの事柄.

### 序文

前回の記事ではRemarkableで書いた原稿マークダウンファイルをhtmlに変換するときに, 共和国のスタイルに合わせるためにRemarkableのhtml出力部分を書き換えるという方針をとっていたが, 途中で**Pandoc**というファイル変換ソフトに遭遇したので方針を変更することにした.

PandocではBashでコマンド実行により自動で複数のマークダウンファイルをhtmlに変換することが出来る. そしてテンプレートを利用することでCSSの設定やタイトル・日付の設定ができるという自由度の高い出力ができる. このような利点があるのでファイル変換に関してはRemarkableのエクスポート機能ではなく, Pandocを使うことにした. でも原稿をマークダウンで書くときはRemarkableを使い続けるのは変わらない.

今回はPandocを使ってマークダウンファイルを一括でhtmlに変換するシェルスクリプトを紹介する.

## 変換スクリプト

**convert_md2html.sh**

~~~bash
#!/bin/bash

#マークダウンをhtmlに変換する

dir_path=${1%/}
css_path=$2

#引数が2つでなければエラー
if [ $# -ne 2 ];
then
	echo "./convert_md2html.sh dir_path css_path" >&2
	exit 1
fi

#マークダウンファイル全体を走査
for name in `find ${dir_path} -name "*.md" | sort`
do
	#ファイルが存在するか確認
	if [ ! -e ${name} ];
	then
		continue
	fi

	#原稿マークダウンファイルが存在するディレクトリを取得
	article_dir_path=`dirname ${name}`

	#pandocコマンドでmarkdownをhtmlに変換
	pandoc --mathjax ${name} --template=template \
			-c ${css_path} -o ${article_dir_path}/art.html

	echo ${name}
done

exit 0
~~~

**コマンド例**

~~~bash
./convert_md2html.sh ~/Documents/study ../article_style.css
~~~

## 解説

やっていることはスクリプト内にコメントで書いたから省くが, 実際にどのように動作するのかを書いていく.

~~~bash
dir_path=${1%/}
css_path=$2
~~~

これの一行目の**${1%/}**は引数の末尾についているスラッシュを取り除くときに使う表記である. この手法は[このサイト](http://linux.just4fun.biz/?%E9%80%86%E5%BC%95%E3%81%8D%E3%82%B7%E3%82%A7%E3%83%AB%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88/%E5%BC%95%E6%95%B0%E3%81%A7%E6%B8%A1%E3%81%95%E3%82%8C%E3%81%9F%E6%9C%80%E6%9C%9F%E3%81%AE%E3%82%B9%E3%83%A9%E3%83%83%E3%82%B7%E3%83%A5%E3%82%92%E5%89%8A%E9%99%A4%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95)がとても参考になった.

ディレクトリの扱うシェルスクリプトを作っている時は, ディレクトリ名の末尾にスラッシュが付いていると変な動作をすることがあり, ようするにバグの原因となる. だから末尾のスラッシュを楽に取り除くということは結構重要なことである.

---

for文のfindコマンドを実行すると次のようになる.

~~~bash
[aa:~/web/homepage]$ find ~/Documents/study -name "*.md"
/home/aa/Documents/study/earth2/ms.md
/home/aa/Documents/study/logdata/ms.md
/home/aa/Documents/study/col_circle/ms.md
/home/aa/Documents/study/renban/ms.md
/home/aa/Documents/study/autokizi/ms.md
/home/aa/Documents/study/block2/ms.md
/home/aa/Documents/study/earth/ms.md
/home/aa/Documents/study/web_auto02/ms.md
/home/aa/Documents/study/block1/ms.md
/home/aa/Documents/study/web_auto03/ms.md
/home/aa/Documents/study/terrain_gimp01/ms.md
/home/aa/Documents/study/line/ms.md

~~~

指定のディレクトリ以下に存在する全てのマークダウンファイルを走査して, それをフルパスで一覧として表示する. これが一つ一つ順番にname変数に格納される.

そして次に**dirname**コマンドでマークダウンファイルが属しているディレクトリのフルパスの情報に変換されれる. この情報は出力先のhtmlファイルの名前に利用される.

~~~bash
[aa:~/web/homepage]$ dirname "aaa/bbb/oooo.md"
aaa/bbb

~~~

とまあ, こんな感じに末尾のスラッシュ無しにディレクトリ名が取得できる.

---

次はこのスクリプトの核となる部分. マークダウンを変換する部分だ.

~~~bash
	#pandocコマンドでmarkdownをhtmlに変換
	pandoc --mathjax ${name} --template=template \
			-c ${css_path} -o ${article_dir_path}/art.html
~~~

ここを解説する前に, 具体的にpandocがどんな処理をするのかを確認してみよう. ここで変換対象となるマークダウンファイルを用意しよう

**aaa.md**

~~~markdown
# マークダウン変換テスト

これはテストです.

## 数式の変換

$$ x^n + y^n = z^n $$
~~~

まずは一番単純な基本となるコマンド形式

- **pandoc *入力ファイル* -o *出力ファイル* **

この場合はタグ変換しただけのhtmlファイルが出力される.
 
**出力例**
 
~~~html
<h1 id="マークダウン変換テスト">マークダウン変換テスト</h1>
<p>これはテストです.</p>
<h2 id="数式の変換">数式の変換</h2>
<p><br /><span class="math display"><em>x</em><sup><em>n</em></sup> + <em>y</em><sup><em>n</em></sup> = <em>z</em><sup><em>n</em></sup></span><br /></p>

~~~

- **pandoc *入力ファイル* -so *出力ファイル* **

この場合はちゃんとしたhtmlファイルが出力される.

**出力例**

~~~html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta http-equiv="Content-Style-Type" content="text/css" />
  <meta name="generator" content="pandoc" />
  <title></title>
  <style type="text/css">code{white-space: pre;}</style>
</head>
<body>
<h1 id="マークダウン変換テスト">マークダウン変換テスト</h1>
<p>これはテストです.</p>
<h2 id="数式の変換">数式の変換</h2>
<p><br /><span class="math display"><em>x</em><sup><em>n</em></sup> + <em>y</em><sup><em>n</em></sup> = <em>z</em><sup><em>n</em></sup></span><br /></p>
</body>
</html>

~~~

これでもまだ数式の表示はしょぼいままだ. このときはmathjaxオプションを指定すればTex形式の数式が表示できる.

- **pandoc --mathjax *入力ファイル* -so *出力ファイル* **

数式がTex形式で表示される.

**出力例**

~~~html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta http-equiv="Content-Style-Type" content="text/css" />
  <meta name="generator" content="pandoc" />
  <title></title>
  <style type="text/css">code{white-space: pre;}</style>
  <script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript"></script>
</head>
<body>
<h1 id="マークダウン変換テスト">マークダウン変換テスト</h1>
<p>これはテストです.</p>
<h2 id="数式の変換">数式の変換</h2>
<p><span class="math display">\[ x^n + y^n = z^n \]</span></p>
</body>
</html>
~~~

もちろんスタイルシートを適応することもできる.

- **pandoc --mathjax *入力ファイル* -c *スタイルシートファイル* -so *出力ファイル* **

出力にスタイルシートを適応する.

**出力例**

~~~html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta http-equiv="Content-Style-Type" content="text/css" />
  <meta name="generator" content="pandoc" />
  <title></title>
  <style type="text/css">code{white-space: pre;}</style>
  <link rel="stylesheet" href="../index/style.css" type="text/css" />
  <script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript"></script>
</head>
<body>
<h1 id="マークダウン変換テスト">マークダウン変換テスト</h1>
<p>これはテストです.</p>
<h2 id="数式の変換">数式の変換</h2>
<p><span class="math display">\[ x^n + y^n = z^n \]</span></p>
</body>
</html>
~~~

もうこの辺でめんどくさくなってきたのでテンプレート関係は以下の参考サイトを観覧して欲しい.

- [Pandoc ユーザーズガイド 日本語版](https://sky-y.github.io/site-pandoc-jp/users-guide/#templates) 
- [Pandocを使ってMarkdownを整形されたHTMLに変換する](https://qiita.com/m_ohsumi/items/cea1243e106ababd15e7) 
- [PandocでMarkdown からHTML5へ。テンプレート指定で思った通りの書式にするラクをする(?](https://qiita.com/TEVASAKI/items/c97815f5fb6542bbeb2c) 