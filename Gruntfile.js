module.exports = function (grunt) {

    var ccainfoPath = 'dist/ccainfo.json';

    function getCCAInfo() {
        return grunt.file.readJSON(ccainfoPath);
    }

    function stringify(obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"' + obj + '"';
            return String(obj);
        }
        else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n];
                t = typeof(v);
                if (t == "string") v = '"' + v + '"';
                else if (t == "object" && v !== null) v = JSON.stringify(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    };


    grunt.initConfig({
        folder_list: {
            options: {
                folder: false
            },
            files: {
                src: ['app/resources/images/**'],
                dest: 'app/resources/imageList.json'
            }
        },
        clean: {
            dist: {
                src: 'dist'
            },
            release: {
                src: 'release'
            }
        },
        copy: {
            upload: {
                expand: true,
                cwd: 'app',
                src: ['**/*.*'],
                dest: 'dist/',
                filter: 'isFile'
            }
        },
        uglify: {
            upload: {
                expand: true,
                cwd: 'dist',
                src: ['js/framework/**/*.js'],
                dest: 'dist/'
            },
            build: {
                expand: true,
                cwd: 'dist',
                src: ['**/*.js'],
                dest: 'dist/'
            }
        },
        "modify_json": {
            "options": {
                add: true,
                fields: {
                    DevelopmentMode: "off"
                }
            }, your_target: {
                // Target-specific file lists and/or options go here.
                "files": [{
                    "src": "dist/ccainfo.json"
                }]
            }
        },
        concat_css: {
            all: {
                src: ["dist/resources/css/*.css"],
                dest: "dist/resources/css/style.css"
            }

        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist/resources/css/style.min.css': ['dist/resources/css/style.css']
                }
            }
        },
        compress: {
            build: {
                options: {

                    archive: function () {
                        var ccaInfo = getCCAInfo();
                        return 'C&M_CLOUD_CCA_' + ccaInfo.Version + ccaInfo.QRVersion + '.min.zip';
                    }
                },
                expand: true,
                cwd: 'dist/',
                src: ['**/*'],
                dest: ''
            },
            upload: {
                options: {

                    archive: function () {
                        var ccaInfo = getCCAInfo();
                        return 'C&M_CLOUD_CCA_' + ccaInfo.Version + ccaInfo.QRVersion + '.zip';
                    }
                },
                expand: true,
                cwd: 'dist/',
                src: ['**/*'],
                dest: ''
            }
        }
    });

    //require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-modify-json');
    grunt.loadNpmTasks('grunt-folder-list');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // 아무일도 하지 않는 기본 테스크
    grunt.registerTask('build', ['clean', 'folder_list', 'copy', 'uglify:build', 'concat_css', 'cssmin', 'modify_json', 'compress:build']);
    grunt.registerTask('skpUpload', ['clean', 'folder_list', 'copy', 'uglify:upload', 'concat_css', 'cssmin', 'modify_json', 'compress:upload']);
};