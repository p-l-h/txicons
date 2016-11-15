

import webfont from 'webfont';
import fs from 'fs';
import md5 from 'md5';
import qiniu from 'qiniu';
import rc from 'rc';


let qiniuConfig = rc('qiniu');

if (!qiniuConfig.ACCESS_KEY || !qiniuConfig.SECRET_KEY || !qiniuConfig.BUCKET) {
    throw '请配置.qiniurc中的ACCESS_KEY、SECRET_KEY、BUCKET';
}

qiniu.conf.ACCESS_KEY = qiniuConfig.ACCESS_KEY
qiniu.conf.SECRET_KEY = qiniuConfig.SECRET_KEY;

const bucket = qiniuConfig.BUCKET;


const uptoken  = (fileName) => {
    let putPolicy = new qiniu.rs.PutPolicy(bucket+":"+fileName);
    return putPolicy.token();
};



const uploadToQiniu = (fileName, file, success) => {
    let token = uptoken(fileName);
    let extra = qiniu.io.PutExtra();

    qiniu.io.putFile(token, fileName, file, extra, function(err, ret) {
        if(!err) {
            // 上传成功， 处理返回值
            success && success();     
        } else {
            // 上传失败， 处理返回代码
            console.log(err);
        }
  });
    
};


const MD5_MAP = {};

function writeContent (fileName, content, success) {
    fs.writeFile(fileName, content, (err) => {
        if (err) {
            throw err;
        }

        console.log(fileName + ' write completed');
        success && success();
    });
}


function writeMd5File (options) {

    let content = options.content;
    let extName = options.extName;

    let version = md5(content).slice(0, 10);
    let destFileName = options.fileName + '_' + version + '.' + extName;
    let destFile= options.dest + destFileName;

    MD5_MAP[options.fileName + '.' +  extName] = destFileName;
    writeContent(destFile, content, () => {
        uploadToQiniu(destFileName, destFile, options.success)
    });
}


export default function (iconsConfig) {
    webfont({
        configFile: '.webfontrc',
        files: iconsConfig.src || 'src/icons/*.svg',
    }).then(
        (result) => {
        let config = result.config;
        let fontName = config.fontName;
        let fontFile = './dist/fonts/' + fontName;
        let css = result.css;
        let count = 0;


        config.formats.forEach(
            (item) => {
                writeMd5File({
                    dest: './dist/fonts/',
                    fileName: fontName,
                    extName: item,
                    content: result[item],
                    success: () => {
                        count++;

                        if (count === config.formats.length) {

                            for (let key in MD5_MAP) {
                                css = css.replace(
                                        new RegExp(key.replace('.', '\.'), 'g'), 
                                        MD5_MAP[key]
                                    );
                            }

                            writeContent(iconsConfig.dest || './dist/style.scss', css);
                        }
                    }
                });
            }
        );
        
        }
    );
}
