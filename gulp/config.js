// "./" 指的是项目主目录
var src = './_app';
var dest = './dest';
module.exports = {
    html: {
        src: [src + "/**/*.{html,json}",
            '!' + src + "/node_modules/**/*"
        ],
        dest: dest + "/"
    },
    js: {
        es6ToEs5: {
            src:  [
                src + "/js/**/*.js",
                '!' + src + '/js/lib/**/*'
            ],
            dest: dest+"/js"
        },
        nodeModulesUglify: {
            src: src + "/node_modules/**/*.js",
            dest: dest + '/node_modules'
        }
    },
    css: {
        sass:{
            src: [
                src + "/css/**/*.scss",
                '!' + src + "/css/lib/**/*"
            ],
            dest: dest+"/css"
        }
    },
    assets: {
        src: src + "/assets/**/*",
        dest: dest + "/assets"
    },
    copy: {
        cp1: {
            src: src + '/**/*.{json,css,eot,svg,ttf,woff,woff2}',
            dest: dest
        },
        cp2: {
            src: src + '/middle/**/*.*',
            dest: dest + '/middle'
        },
        cp3: {
            src: src + '/js/lib/**/*',
            dest: dest + '/js/lib'
        }

    }
};