# currency-converter-app
Simple Currency Convertor App for Traveling

海外簽賬計算機，一個專為香港人海外簽賬而設的計算機

* 編寫過程請參考[史密夫宅宅記](https://smithbloghk.wordpress.com/2015/06/01/齊來寫app-實戰用ionic寫匯率計算機-前言/)
* [Download on the AppStore](https://itunes.apple.com/hk/app/oocard/id998184074?mt=8)
* [Get it on Google play](https://play.google.com/store/apps/details?id=smithbloghk.currencyconverter)

## Quick Start

To build this app, you need to install ionic

```bash
$ npm install -g ionic
```

Then, you need to install the dependencies 

```bash
$ ionic setup sass
$ bower install
$ ionic state restore
```

Download the flag icons from http://lipis.github.io/flag-icon-css/
and place under www/lib

Install cordova-uglify (Optional)
```bash
$ npm install jshint
$ npm install async
$ npm install cordova-uglify
```

iOS build & test run

```bash
$ ionic platform add ios
$ ionic emulate ios
```

Update icon and splash screen
```bash
$ ionic resources
```