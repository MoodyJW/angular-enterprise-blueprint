# Changelog

## [2.2.1](https://github.com/MoodyJW/angular-enterprise-blueprint/compare/v2.2.0...v2.2.1) (2026-01-31)


### Bug Fixes

* **forms:** errors display smaller text in red ([e297e4d](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/e297e4d6d1270cf75a820f3dcbc892968a06c8cb))

## [2.2.0](https://github.com/MoodyJW/angular-enterprise-blueprint/compare/v2.1.0...v2.2.0) (2026-01-31)


### Features

* **dashboard:** add coverage report link and deployment config ([2b84cc3](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/2b84cc3b9940e7d6001a9ad25708bf4f15f5b2c8))
* **dashboard:** add directives to documentation card ([ca4c859](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/ca4c859117812a667516f27a067138728d524e4d))
* **dashboard:** add last deployed date ([9b39215](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/9b39215c5b36f2d47dd31147ee74937e22624d38))
* **dashboard:** add lazy chunks tracking to bundle size card ([c4c160b](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/c4c160ba7d2d16c492b8368b3d5a39ab1b89e6bf))
* **dashboard:** add view repository button to git card ([ded5308](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/ded530881cfb8e97ab00fd5942475505970a4e38))
* **dashboard:** generalize directives to utils metric ([4e1b2f9](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/4e1b2f9e9ca76363e353511c7c0c804dedc46dd7))
* **dashboard:** improve layout, interactivity and metrics status ([ad6c5fd](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/ad6c5fdc531f650d0b20b8f6209c8c34fce1a55a))
* **dashboard:** include interfaces in utils metric ([a2e9e76](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/a2e9e769f0aee186d6940a9d0ec7a9aa849550dd))
* **dashboard:** integrate bundle analyzer report ([6a73f8c](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/6a73f8c3984eeecb57a5a82a5d39651995384cb4))
* **dashboard:** integrate code duplication tracking ([fdf93e9](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/fdf93e9e85f9cb3d9d10f810210c0bd80350f148))
* **dashboard:** link code quality card to eslint config ([ef8ad96](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/ef8ad96257289b56a9e9a2195ad6006b79cb08db))
* **dashboard:** link dependencies card to dependabot ([3926794](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/39267947762b43ecda05dbe058f5396078664406))
* **dashboard:** link documentation card to storybook and fix path resolution ([2542af1](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/2542af18d2e6712a98fcbd01b43508e226a7a803))
* **dashboard:** link performance card to lighthouse report ([8f8ced0](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/8f8ced07074332922992fa4f40d37e8826e1a243))


### Bug Fixes

* add Lighthouse CI step to deployment workflow ([b8e05fb](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/b8e05fbf55f62d91ff3a69493544ec71c6c8a7da))
* **dashboard:** change branches to merged prs ([b04ccb8](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/b04ccb88303e61dd1f50cc5d70bea409f30a147a))
* **dashboard:** repo metrics display correct commit and branch count ([d925d12](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/d925d124bd110ab2f1c5de7646b0bd2139225f91))
* **deploy:** add rebase before push ([1d68042](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/1d680420e99f2286ee413285d9d4f99b6e556a20))
* **deploy:** remove rebase, add no-verify ([91894ef](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/91894efa68c64d1c1cfb44950c7d4aa411a7a4cd))
* **i18n:** add missing spanish translations for dashboard metrics ([6ed0ead](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/6ed0ead200e5f9c59a2d7645de4a6da6d249d84e))
* **lighthouse:** remove update-metrics, consolidate into deploy ([7e0c42b](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/7e0c42b5a730aca43025a8410439d7cefc91a8f3))
* **lighthouse:** use PAT for workflow to push to main ([4c77001](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/4c770011ae3618f0e27202ea9fae3d9c13682e5d))
* **profile:** resume viewer broken in prod ([24713d9](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/24713d91120bd3f8fe61ce3935391f366d75ae34))
* regenerate metrics after Lighthouse CI in deployment ([7259b52](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/7259b5213583fbefa354bde6beab731582bd432f))
* remove upload.target override to sync Lighthouse scores ([9313a75](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/9313a755ed0594cead2a22b0452a8229f0d20814))
* resolve lodash-es vulnerabilities via overrides ([d2d5b86](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/d2d5b8618cbc708bcee48f97b360ccdfc409d2be))


### Performance Improvements

* **profile:** code lines corrected, speed improved ([56dac3b](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/56dac3b8a7f61b2b4af7893ebe550941cf6454dc))

## [2.1.0](https://github.com/MoodyJW/angular-enterprise-blueprint/compare/v2.0.0...v2.1.0) (2026-01-25)


### Features

* **nav:** consolidate resources into single dropdown menu ([62a3acf](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/62a3acf9603a9c411cf94ddec04388c02e19f50a))
* **shared:** create donut chart, implement on dashboard lighthosue ([896aa00](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/896aa009c4b3ef677b7ab3219036a9558bbe1399))


### Bug Fixes

* **blog-list:** chevron icon not displaying ([19aedf1](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/19aedf170a44bd338efbefb58cb68497957a33ee))
* **dashboard:** doc card not appearing ([3a2f887](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/3a2f887a572505ea0465e395cce008e47d1fe202))
* **profile/contact:** header spacing ([a32fefb](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/a32fefbd7f04ef5cdf01b966318e31ba32f24ec1))
* regenerate package-lock.json with missing nested dependencies ([b15d611](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/b15d611607354071f42de60317be7680229a6d35))
* **storybook:** use valid toolbar icons for theme switcher ([2de550a](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/2de550a151d6dd6e4d9a68e1083d5cbd7a321f32))
* update dependencies to resolve vulnerabilities ([cfeef1b](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/cfeef1b3898bb33811d8917c0dd8531f3b60ee96))


### Performance Improvements

* **dashboard:** reduce LCP by eager loading home component ([285ad65](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/285ad65e548fc9ac6a9b17af91de9bcbd77452fa))

## [2.0.0](https://github.com/MoodyJW/angular-enterprise-blueprint/compare/v1.3.0...v2.0.0) (2026-01-23)


### ⚠ BREAKING CHANGES

* **home:** Optimize initial render performance

### Features

* **dashboard:** add bundle size card, remove dupe props from metrics ([dcbd566](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/dcbd5668fe5bd197ca7222a249160277907429a5))
* **dashboard:** change layout to proper grid, add new cards ([b1f0542](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/b1f05427cfef4fe5e54c2282f1bed9a77b867c11))
* **dashboard:** expand test stats, fix contributor count ([e573bbb](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/e573bbb5c8838119ab0b1020f3b14907b7666448))
* **dashboard:** new cards with improved metrics ([469d167](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/469d167e04c5009cda2f7ea5491d8d8f9d3c2a6c))


### Bug Fixes

* **metrics:** update metrics use new script ([ad465bd](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/ad465bdbb3a1d51eebd0f999ebb669d30342d943))


### Performance Improvements

* **angular:** optimize angular config ([9faca7a](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/9faca7a0f494c9c06c37e831b19c32d5c3f335f8))
* enable critical CSS inlining for improved FCP/LCP ([b3e9cc4](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/b3e9cc4a852106a75c454c4051877261c6495015))
* **home:** defer non-critical data loading for faster LCP ([714730d](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/714730d11c26bf08bc82163f235151dad2867be7))
* **lighthouse:** add app shell for immediate LCP ([6948753](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/69487536e482468f612aab246f1e5a7e754b4c21))
* **lighthouse:** remove inline loader ([fded2af](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/fded2af4007be3e92e295ac3fa002112a936ea36))
* **lighthouse:** replace app shell with loading indicator ([ef79cff](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/ef79cff34f54461163f39fa2d2885afd6d298050))
* optimize index.html for faster FCP/LCP ([1d66004](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/1d660043bd30fd34a65913432a44e5508e91d1d5))
* **preload:** increase preload delay ([8c4f9f4](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/8c4f9f4f350920a37395a707d42d3d962d0ee1f9))
* **transloco:** inline loader ([edd6386](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/edd6386f100e6aa4ef2ae5488f42b46e09f1273b))

## [1.3.0](https://github.com/MoodyJW/angular-enterprise-blueprint/compare/v1.2.0...v1.3.0) (2026-01-17)


### Features

* **blog:** add skeleton to blog details ([c237e64](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/c237e645eac10f7cb6d5faa3aa391e9264f04936))
* **blog:** blog list and details ([15d525d](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/15d525d619cb9ca16a72f244ef7db803cb137d9f))
* **blog:** next and prev article buttons ([ded2944](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/ded2944e37374c8ab8d9c44f99c9c835d18f7c84))
* **card:** add disabled state ([f012b54](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/f012b543b6583c86d66f35f23573700b080ca58c))
* **home:** add personal branding ([2357a84](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/2357a844b5bc6285b8fc8b865b3cb7fcce047f6d))
* **login:** change logout to user icon with menu ([d13ba79](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/d13ba79f4ef75811c5b63ad94ba0e016b53d5edc))
* **profile:** move resume btns to card, add contact btn ([75ff953](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/75ff953f16c87a0874659c2a5ebdcad932e7df76))


### Bug Fixes

* **card:** accessibility issues ([24fb60c](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/24fb60c67757721eb22adce492ec79d6eadb4264))
* **profile-stats:** skeleton loading no longer overflows ([dc604aa](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/dc604aa109ae664556433ec6b9d2083e953d6298))
* **profile:** view resume opens properly ([927f42e](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/927f42e6518808e1e9f7555f4cc94b69107b9626))
* **user-manu:** storybook display ([c1011cc](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/c1011cc47a932b4cc2a30811626677c1206d5e1e))


### Performance Improvements

* **lighthouse:** improve score ([811cdd4](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/811cdd4830871fb3837bf353aa71774274f22f4b))

## [1.2.0](https://github.com/MoodyJW/angular-enterprise-blueprint/compare/v1.1.0...v1.2.0) (2026-01-10)


### Features

* **theme-picker:** add tooltip ([4d7f673](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/4d7f673dbf2f54a0376398a0723064d20ae8b779))

## [1.1.0](https://github.com/MoodyJW/angular-enterprise-blueprint/compare/v1.0.2...v1.1.0) (2026-01-08)


### Features

* add theme picker to storybook toolbar, create page not found ([e77cbdd](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/e77cbddcd93d0aca13a38cb3cc857775fd3b1654))


### Bug Fixes

* **accessibility:** improve accessibility across shared components ([d087d97](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/d087d97197a8495791b4a444fe830d47acaca2ea))
* **card:** color contrast issues ([b9c295a](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/b9c295a81a7f17075ea0e8cce2db2c559de23cb6))
* **modal:** remove invalid focus-order ([3066429](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/30664293ce540927e0bac7f969d8d5ee81172bed))
* remove outdated storybook toolbar package ([b6e76d0](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/b6e76d09e4b604547a14ee13b67bdb9b487718e4))

## [1.0.2](https://github.com/MoodyJW/angular-enterprise-blueprint/compare/v1.0.1...v1.0.2) (2026-01-01)


### Bug Fixes

* **adr-viewer:** search filtering ([20baa4e](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/20baa4eaecd005b342eb8965be7ea95a803dcecc))

## [1.0.1](https://github.com/MoodyJW/angular-enterprise-blueprint/compare/v1.0.0...v1.0.1) (2025-12-30)


### Bug Fixes

* **accessibility:** header hierarchy ([6d00f66](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/6d00f6619af19b523e8f1fee93242d04af5723c2))

## 1.0.0 (2025-12-30)


### Features

* add button tests ([cb719e3](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/cb719e3d8121af5fe24e7623b0aaf124fd13ccee))
* add more tests ([ca3bbe7](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/ca3bbe7645f07aec01498db7dd6a207936a48393))
* adr viewer ([452c632](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/452c632ce2c088a6f1b7ee0931449aa799d2d478))
* **adr:** add final adr docs ([87aaed4](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/87aaed4092695e54f37b4d318e3e3578f8211703))
* batch 2 ([7248268](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/7248268d1a5e2187b4bac888222859b201b9b2d2))
* batch 3 ([cd1db01](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/cd1db01c203c4b0f58f6e53fb6607bc2b44e2fb9))
* batch 4 ([4229aa7](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/4229aa7fcb51dd18727d93f64a9f5dac49de0499))
* batch 5 ([0f20ffb](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/0f20ffb29be3b2340e320eea0416679a268d4711))
* batch 6 ([fe5a4bf](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/fe5a4bfd42fc5a6ebc79c6603b5687edf2456f85))
* batch 7 ([b556759](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/b556759f647ca9fa84895ced9c688d3fff332305))
* change lighthouse scores to real data ([3f1a842](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/3f1a842e4a6dfb37a5e3cb8e2a6ceca16c9f9e60))
* complete all of phase 4 with placeholders ([ca9d088](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/ca9d08866d3842cae1fe6d3ae59b947bab8ac589))
* **contact:** add ContactStore with server error handling and stricter email validation ([b2ab4ba](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/b2ab4ba14f44f056b19cb0bbc982b76981bcbe14))
* **contact:** create contact page with formspree, update docs and add more to plan ([a889174](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/a8891742d54d42ba0ebcd6bb9c4fcb4a5f6889e0))
* create basic analytics service ([2a3d4fa](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/2a3d4fae8c9f9966d0ef4a619db9cdd574d66988))
* create global error handler ([3972959](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/3972959de4e6bb37940862ae07f626b4612d958d))
* create logger service ([cb4ee41](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/cb4ee412431c15416899326625ea72b11b8e478e))
* create mock auth ([32f54b2](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/32f54b24008424f02a15e1465b67e4b1367f81f6))
* create seo service ([9993696](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/9993696cfd3f15b2b50a3e2a044a22d01ae22f37))
* create theme service and themes ([6608991](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/6608991fa6a186be45a75f9b57a0c2ad3a068e79))
* dashboard with metrics, workflow to update for live data ([9f86f66](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/9f86f663ab932f59d2426af428bb47b22858e3c8))
* login feat with auth, snackbar, errors ([3ad2e18](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/3ad2e1830840d1416edd13cb17c8bea70f312b4a))
* module list and details ([cec1938](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/cec19383f059f1fdcc81b73024f2fb42b02ad63e))
* **modules:** add final modules ([8f04d89](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/8f04d8932a52b891a2f81c4830e4b328c687fce2))
* port shared batch 1 ([01cb98f](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/01cb98f48efd2fb586c7323829c2b2b5b3370e6b))
* prod showing readme, blog for phase 2 ([129a317](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/129a3170dee15a258c98dff9ea7b9c3fdfe5da33))
* **profile:** created profile/about section with github stats ([c6d567f](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/c6d567ff05d1f5449e325ec9cb4e791aa0e41e3a))
* reduce init bundle size ([634341a](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/634341ad383f74abf13a79c9bd68dd0e758c508c))
* **security:** implement medium priority security enhancements (CSP, CSRF, Logger) ([a27e942](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/a27e942d1967c41a6020303cea7dbcf5375392f9))
* **shared:** create tooltip ([99ff1c0](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/99ff1c03766747fb449e9de98d3875911bc3513a))
* theme picker, blog for phase 3 ([c859225](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/c859225fbe444d96cfa99582e0c68f40ae211150))
* transloco and language switcher ([24d8983](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/24d8983e199d38156dd494a361f6c73ad9bd878d))
* use analytics providers & routers ([b226bbd](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/b226bbd30133cc83fab942b19df5b469a3f64be6))


### Bug Fixes

* **auth:** various security improvements ([87fee52](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/87fee529fc20464d51486929c3be3650058300c2))
* **automation:** update metrics workflow stats update ([2043367](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/2043367670cb5dd59d18cf7febe904918ae1ed49))
* **ci:** generate environment files from example before build ([2560d61](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/2560d61e9fda5106ac7148afbae686e65ba9c020))
* **ci:** restrict update-metrics PR to only include metrics.json ([b595e9d](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/b595e9dcb38e5d78e7b4471a8c8695f4f33740b2))
* cleanup ds vars ([e499d70](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/e499d709f142e7d73c23a9a73cc9ac815f9ef370))
* **csrf:** only add CSRF token to same-origin requests to prevent CORS issues ([042d1d1](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/042d1d1a099a924c5964a2480eabc4f7fa382a34))
* deploy failing, superfluous trailing args in auth test ([edaab74](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/edaab7491c52c3534b3f2827d9344b1ff89d2183))
* deploy workflow failing ([e4d5fcc](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/e4d5fcc3be0ddb2c143aa803e11e1545998bd94f))
* **env:** restore environment.prod.ts overwriten by template ([fb6149d](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/fb6149d79024a7e633a3f4c33736cf3b2a40473b))
* failing test, reduce bundle ([6fafc40](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/6fafc4025b713db32634343895257a7e219a6a94))
* **i18n/assets:** use relative asset paths to support GitHub Pages subpath deployment ([059d036](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/059d036f9cea28f11dda080244ce0d923e82fee3))
* prod showing readme instead of index ([dd85a54](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/dd85a543c78af0bb965c780d91d46c29b5ee842c))
* **profile-stats:** gh stats not displaying in prod ([82ad9d3](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/82ad9d341f0c0407175c2ef81d4518f400c1a660))
* remove redundant standalone, clean up ([a65bc03](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/a65bc035d7d7b19ef7a303638bbaa63474625e3b))
* **security:** add honeypot to contact form, security docs ([77b1dc8](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/77b1dc83859f48c302ea95c59120b0a4dd03808a))


### Performance Improvements

* **lighthouse:** improve lh scores ([d4861ca](https://github.com/MoodyJW/angular-enterprise-blueprint/commit/d4861ca38ad09859ddc728c0c3fd00b22e718e17))

## Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.
