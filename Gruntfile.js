module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // 任务名称，需根据插件的说明来写
        concat: {
            // 子任务名称，这名称随你起
            dev: {
                // 可选的配置参数
                options: {
                    banner: '/*!\n * <%= pkg.name %> - JS for Debug\n * @licence <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n */\n'
                },
                // 源文件路径
                src: [
                    'web/app/**/*.js',
                    'web/resource/**/*.js',
                    'web/assets/diy/**/*.js'
                ],
                // 运行任务后生成的目标文件
                dest: 'web/main.js'
            }
        },
        uglify: {
            prod: {
                options: {
                    banner: '/*!\n * <%= pkg.name %> - compressed JS\n * @licence <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n  */\n'
                },
                files: {
                    'web/main.min.js': ['<%= concat.dev.dest %>']
                }

            }
        }
    });

// 载入要使用的插件
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
// 注册任务
    grunt.registerTask('default', ['concat', 'uglify']);
};