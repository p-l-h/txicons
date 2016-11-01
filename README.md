# txicons

Common icon fonts for Tianxiao.

## Getting Started

Install with npm

```shell
    npm install txicons 
```

then import `node_modules/txicons/dist/style.scss` in your scss file

``` scss
    @import 'node_modules/txicons/dist/style';
```

## Customize

Use `git submodule` or just donwload and unzip the zip to your project.

1.Move svgs you want to use to the `src` folder

2.Config the .qiniurc file with [QiNiu](http://www.qiniu.com/)'s `access key`、`secret key` and `bucket` like this:

```json
{
    "ACCESS_KEY": "",
    "SECRET_KEY": "",
    "BUCKET": "txicons"
}
```

3.run `npm install` to install the dependencies

4.run `npm run build` to get your style and fonts


## License

txicons is licensed under the [MIT license](http://opensource.org/licenses/MIT).




