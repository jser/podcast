// MIT © 2017 azu
import * as fs from "fs";
import { convertToSpeech } from "./JSerItemToSpeech";
import * as path from "path";

const items = [
    {
        category: "Headline",
        title: "StealJS 1.0 Release",
        url: "https://www.bitovi.com/blog/stealjs-1.0-release",
        tags: ["JavaScript", "Tools", "library", "ReleaseNote"],
        content: "開発時は動的なモジュールローダで、本番時はsteal-toolsでのproduction buildでbundleできるStealJS 1.0リリース",
        relatedLinks: [{ title: "Easy ES6 with StealJS - YouTube", url: "https://www.youtube.com/watch?v=VKydmxRm6w8" }]
    },
    {
        category: "Article",
        title: "Optimizing Page Speeds With Lazyloading | Jscrambler Blog",
        url: "https://blog.jscrambler.com/optimizing-page-speeds-with-lazyloading/",
        tags: ["AngularJS"],
        content: "AngularのルーティングとコンポーネントのLazyLoadについて",
        relatedLinks: []
    },
    {
        category: "Article",
        title: "Lazy Loading - React",
        url: "https://webpack.js.org/guides/lazy-load-react/",
        tags: ["webpack", "React"],
        content: "webpack2を使ったReactコンポーネントのLazyLoad方法についてのドキュメント",
        relatedLinks: []
    },
    {
        category: "Article",
        title: "FlowtypeでFluxアーキテクチャに型付けをするという発表をした - Please Drive Faster",
        url: "http://joe-re.hatenablog.com/entry/2016/12/29/204917",
        tags: ["flowtype", "Flux"],
        content: "FlowTypeを使ってFluxアーキテクチャのパターンに型を付ける話",
        relatedLinks: [
            {
                title: "flowtypeによりFluxにおいて型安全を手に入れる - Qiita",
                url: "http://qiita.com/joe-re/items/d6fd262a8c6017f41e22"
            }
        ]
    },
    {
        category: "Article",
        title: "Node.js Interview Questions and Answers (2017 Edition) | @RisingStack",
        url: "http://blog.risingstack.com/node-js-interview-questions-and-answers-2017/",
        tags: ["node.js", "security"],
        content: "Node.jsにおいて良くある質問とその答えについてをQ&A形式で書かれたもの。\nコーディングスタイル、よくある書き間違い、セキュリティ、タイミング攻撃などについて",
        relatedLinks: []
    },
    {
        category: "Article",
        title: "React Interview Questions",
        url: "https://tylermcginnis.com/react-interview-questions/",
        tags: ["React", "JavaScript"],
        content:
            "Reactについての疑問をQ&A形式で書かれた記事。\nClassで書くコンポーネントと関数として書くコンポーネントの違い、`refs`とは何か、`key`属性はなぜ大事なのか、コンポーネントパターンなど",
        relatedLinks: []
    },
    {
        category: "Article",
        title: "Writing HTML with accessibility in mind – Medium",
        url: "https://medium.com/@matuzo/writing-html-with-accessibility-in-mind-a62026493412",
        tags: ["HTML", "accessibility"],
        content: "HTMLとアクセシビリティ(スクリーンリーダー)について\n`lang`属性、`alt`属性、`<buton>`要素、landmarksについて",
        relatedLinks: []
    },
    {
        category: "Article",
        title: "PostCSS まとめ - Qiita",
        url: "http://qiita.com/morishitter/items/4a04eb144abf49f41d7d",
        tags: ["PostCSS"],
        content: "PostCSSの概要と特徴、作られたモチベーションについて",
        relatedLinks: []
    },
    {
        category: "Article",
        title: "Front-End Performance Checklist 2017 (PDF, Apple Pages) – Smashing Magazine",
        url: "https://www.smashingmagazine.com/2016/12/front-end-performance-checklist-2017-pdf-pages/",
        tags: ["performance", "browser"],
        content: "ウェブフロントエンドのパフォーマンスチェックリスト。\nファイルサイズ、配信方法、レンダリング、モニタリング、テスト方法などについて",
        relatedLinks: []
    },
    {
        category: "Article",
        title: "The Reflect API of ES6 – Zsolt Nagy",
        url: "http://www.zsoltnagy.eu/the-reflect-api-of-es6/",
        tags: ["JavaScript", "ECMAScript"],
        content: "Reflect APIについての紹介記事",
        relatedLinks: []
    },
    {
        category: "Article",
        title: "MozAnime in 2016 | Nothing new",
        url: "https://birtles.wordpress.com/2016/12/27/mozanime-in-2016/",
        tags: ["firefox", "animation"],
        content: "2016年におけるFirefoxのWeb Animations対応やデバッグ機能の更新点について",
        relatedLinks: []
    },
    {
        category: "SlideVideo",
        title: "Optimise your web development workflow 2016",
        url: "https://umaar.github.io/devtools-optimise-your-web-development-workflow-2016/",
        tags: ["Chrome", "CSS", "debug", "slide", "accessibility"],
        content: "Chromeの開発者ツールについてのスライド。\n主にCSS、アクセシビリティ、パフォーマンスについて豊富なGIFアニメーションと共に紹介している。",
        relatedLinks: []
    },
    {
        category: "SoftwareLibrary",
        title: "Fuse-Box bundler / API Reference",
        url: "http://fuse-box.org/",
        tags: ["JavaScript", "Tools"],
        content:
            "webpack/Browserifyのようなbundler、JSPM/SystemJSのようなloaderを機能を持つツール。\n変換結果の依存関係とキャッシュをすることで高速な変換ができる。\nプラグインで対応する変換を拡張できる",
        relatedLinks: [
            {
                title: "FuseBox — bundle your project within a fraction of a second",
                url:
                    "https://medium.com/@ivanorlov/fusebox-bundle-your-project-within-a-fraction-of-a-second-f2360ba95727"
            }
        ]
    },
    {
        category: "SoftwareLibrary",
        title: "Gothdo/range: A JavaScript implementation of the Python&#x27;s range() function.",
        url: "https://github.com/Gothdo/range",
        tags: ["JavaScript", "library"],
        content: "Pythonの`range()`のJavaScript実装ライブラリ",
        relatedLinks: []
    },
    {
        category: "SoftwareLibrary",
        title: "andywer/leakage: 🐛 Memory leak testing for node.",
        url: "https://github.com/andywer/leakage",
        tags: ["JavaScript", "node.js", "test", "libn"],
        content: "Node.jsでメモリリークのテストを書くことができるライブラリ。",
        relatedLinks: []
    },
    {
        category: "SoftwareLibrary",
        title: "nolanlawson/marky: High-resolution JavaScript timer based on performance.mark() and measure()",
        url: "https://github.com/nolanlawson/marky",
        tags: ["JavaScript", "performance", "libn"],
        content: "User Timing API(`performance.mark`と`performance.measure`)ベースの処理時間計測ライブラリ",
        relatedLinks: []
    },
    {
        category: "SoftwareLibrary",
        title: "maniart/diffyjs: A dependency-free motion detection library for the browser",
        url: "https://github.com/maniart/diffyjs",
        tags: ["JavaScript", "画像"],
        content: "`MediaDevices.getUserMedia()`を使って取得した画像から、フレームごとの動きのdiffを取得できるライブラリ。\nmotion detectionライブラリ",
        relatedLinks: []
    }
];

const output = path.join(__dirname, "../output");
items.forEach((item, index) => {
    const text = convertToSpeech(item);
    fs.writeFileSync(path.join(output, `${index}.ssml`), text, "utf-8");
});
