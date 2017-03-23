var services = angular.module('services', []);
var fs=require('fs');
var path = require('path');
//公共服务,处理网络请求异常或者程序异常等等情况
services.factory('interactPackage', function () {
    return {
        // 初始化一个时间点
        initPoint: function (episode) {
            var fullPointResPath = $.path.oneInteractiveResPath(episode);

            $.path._createPathFolderRecursion(fullPointResPath, function () {
                var oneInteractivePackagePath = $.path.oneInteractivePackagePath(episode);
                var filePath = path.join(oneInteractivePackagePath, './interaction.json');
                fs.exists(filePath, function(exists) {
                    if(!exists){
                        fs.writeFileSync(filePath, JSON.stringify({
                            sid: episode.sid,
                            episode: episode.episode,
                            version: '1.0',
                            parts: []
                        }));
                    }
                    console.log('exists: ', exists);
                });
            });
        }

    }
});

services.factory('audio', function () {
    var bgAu = null;
    var nowBgUrl = '';
    return {
        playBg: function (url, loop = false, cb) {
            if(nowBgUrl == url) return;
            nowBgUrl = url;
            bgAu = bgAu || document.createElement("audio");
            bgAu.preload = "auto";
            bgAu.src = url;
            bgAu.loop = loop;
            $(bgAu).on('ended', function () {
                cb && cb();
            });
            bgAu.play();
        },
        play: function (url, cb) {
            var  audio = document.createElement("audio");
            audio.preload = "auto";
            audio.src = url;
            $(audio).on('ended', function () {
                cb && cb();
            });
            audio.play();
        }
    }
});

services.factory('cube', function () {
    var xcaseManager = require('xcase_sdk');
    return {
        cubes: [],

        manager: xcaseManager,
        // USB初始化
        initialize: function () {
            return new Promise(function (resolve, reject) {
                xcaseManager.initialize(function (result, num){
                    resolve(result, num);
                }, function () {
                    reject();
                });
            })
        },
        // 发起连接
        requestCubes: function (needNum) {
            var that = this;
            return new Promise(function (resolve, reject) {
                xcaseManager.requestCubes(needNum, function(cubes, errCode){
                    that.cubes = cubes || [];
                    resolve(cubes)
                })
            })
        },
        sendCubesMedias: function (medias, cubes) {
            cubes = cubes || this.cubes;
            return new Promise(function (resolve, reject) {
                xcaseManager.sendCubesMedias(cubes, medias, false, function (){
                    // 发图成功回调
                    resolve()
                }, function () {
                    // 发图失败回调
                    reject();
                })
            })
        }
    }
});




// service.factory('cube', ['$state', 'errCatch', function ($state, errCatch) {
//
//     var xcaseManager = require('xcase_sdk');
//
//     var instance = {
//         default: {
//             OneGroupCount: 4,
//             MulGroupCount: 12,
//             Red: 0xFF0000,
//             Blue: 0x0000FF,
//             Yellow: 0xeebb00,
//             FrameWidth: 10
//         },
//         manager: null,
//         cubes: [],
//         blueTeam: [], //默认为蓝组
//         redTeam: [],
//         yellowTeam: [],
//         groupCount: 1,
//         // 从哪个路由跳转到设备管理页
//         fromRouteName: '',
//         unUsedCubeNames: []
//     };
//
//     function init() {
//         var MAX_RSEND_NUM = 1; //表示重发次数
//         var SCAN_OK = 0x00;
//         var SCAN_TIEMOUT_ERRCODE = 0x01;
//         /* 这里声明私有变量和方法 */
//         var defaultCount = 4; // 默认连接四个小块
//         var isException = true; // 标识小块是否是异常断开的
//         var isReSend = false; // 是否重发
//         var faultDisFlag = false;
//         var centralNum = 0; // 初始得到的USB外设
//         var reSendCnt = 0; // 重发计数
//         var isCache = false; // 是否正在缓存发图
//
//         /* 声明所有的回调方法 */
//         var initSuccessCallback;
//         var initFailCallback;
//         var connectCallback;
//         var disconnectCallback;
//         var sendImageSuccessCallback;
//         var sendImageFailCallback;
//         var shakeCallback;
//         var contactCallback;
//         var arrangementCallback;
//
//         function logger(data) {
//             console.log(data);
//         }
//
//         function reSendImage(failedCubes) {
//             var media = [];
//             var cubes = [];
//             failedCubes && failedCubes.forEach(function (fcube) {
//                 if (fcube.code != 2) {
//                     // 2--图片长度过大无法缓存
//                     console.log('send failed cube: ' + fcube.cube.deviceName);
//                     cubes.push(fcube.cube);
//                     media.push(fcube.media);
//                 }
//             });
//             instance.manager.sendImages(cubes, media, isCache, sendImageSuccessCallback, sendImageFailCallback);
//         }
//
//         function findCubesInUnusedCubes(cube) {
//             var found = false;
//             for (var i = 0; i < instance.unUsedCubeNames.length; i++) {
//                 if (cube.deviceName == instance.unUsedCubeNames[i]) {
//                     found = true;
//                     break;
//                 }
//             }
//             return found;
//         }
//
//         /**************************定义所有传入sdk中的回调方法**************************/
//         /**
//          * 初始化成功
//          * @param num：外设个数
//          */
//         function didInitSuccess(result, num) {
//             // 设备必须初始化出两个才正常，该逻辑需要待评估
//             console.log('搜索出 ' + num + ' 个USB设备');
//             if (num > 1) {
//                 centralNum = num;
//                 initSuccessCallback();
//             } else {
//                 initFailCallback();
//             }
//         }
//         /**
//          * 初始化失败
//          */
//         function didInitFailed() {
//             logger("init failed");
//             initFailCallback();
//             errCatch.catch(errCatch.catchCode.InitCode);
//         }
//         /**
//          * 连接回调
//          * @param cubes
//          */
//         function didConnected(cubes, errCode) {
//             logger('get ' + cubes.length + ' cubes' + ', errCode = ' + errCode);
//             if (errCode == SCAN_TIEMOUT_ERRCODE) {
//                 // 扫描超时，无响应
//                 result.reset();
//             }
//             instance.cubes = cubes;
//             if (connectCallback) {
//                 connectCallback(cubes);
//             }
//         }
//         /**
//          * 断开回调
//          * @param cube
//          */
//         function didDisconnected(cube) {
//             if (disconnectCallback) {
//                 disconnectCallback();
//             }
//         }
//         /**
//          * 发图成功回调
//          */
//         function didSendImageSuccess() {
//             logger('send image success');
//             reSendCnt = 0;
//             if (sendImageSuccessCallback) {
//                 sendImageSuccessCallback(true);
//             }
//         }
//
//         /**
//          * 发图失败回调
//          * @param failedCubes
//          */
//         function didSendImageFailed(failedCubes) {
//             logger('failed cube number: ' + failedCubes.length);
//             if (faultDisFlag) {
//                 // 主机异常断开，则不处理发图异常
//                 return;
//             }
//             if (reSendCnt < MAX_RSEND_NUM) {
//                 logger(Date.now() + ', resend image, cnt = ' + reSendCnt);
//                 reSendImage(failedCubes);
//                 reSendCnt++;
//             } else {
//                 logger(Date.now() + ', beyond max resend cnt');
//                 reSendCnt = 0;
//                 if (sendImageFailCallback) {
//                     sendImageFailCallback();
//                 }
//             }
//         }
//
//         function didShaked(cube, teamId) {
//             if (shakeCallback) {
//                 shakeCallback();
//             }
//         }
//
//         function didContacted(cubes, teamsId) {
//             if (contactCallback) {
//                 contactCallback();
//             }
//         }
//
//         function didArrangemented(isRight, teamId) {
//             if (arrengmentCallback) {
//                 arrengmentCallback();
//             }
//         }
//         /* 公有变量和方法（可以访问私有变量和方法） */
//         var result = {
//             /**********************初始化***************************/
//             /*
//              * @brief 初始化USB串口
//              */
//             initCenteral: function initCenteral(successDo, errorDo) {
//                 faultDisFlag = false;
//                 initSuccessCallback = successDo;
//                 initFailCallback = errorDo;
//                 xcaseManager.initialize(didInitSuccess, didInitFailed);
//             },
//             /******************连接和断开小块**************************/
//             /*
//              * @brief 连接小块
//              * @param count 需要连接的小块数量，默认是4
//              */
//             connect: function connect(count, callback) {
//                 connectCallback = callback;
//                 xcaseManager.requestCubes(count, didConnected);
//             },
//             /*
//              * @brief 断开小块
//              * @param cube 需要断开的小块对象
//              */
//             disconnect: function disconnect(cube) {
//                 xcaseManager.close(cube);
//             },
//             /**
//              * 批量断开小块，与endSession的区别就是endSession表示退出应用程序后触发的
//              * @param cubes
//              */
//             disconnectCubes: function disconnectCubes(cubes) {
//                 for (var i = 0; i < cubes.length; i++) {
//                     xcaseManager.close(cubes[i]);
//                 }
//             },
//             /**
//              * @brief 停止会话，可以断开全部小块；同时可处理一些退出程序之后的东西（比如断开和关闭蓝牙连接）
//              */
//             endSession: function endSession(cubes) {
//                 // var n = 0;
//                 // var timeout = setInterval(function () {
//                 //     xcaseManager.close(cubes[n]);
//                 //     n++;
//                 //     if(n >= cubes.length) {
//                 //         clearInterval(timeout);
//                 //     }
//                 // }, 100);
//                 xcaseManager.closeCubes(cubes);
//             },
//             /*******************发送图片和字符串************************/
//             /**
//              * 发送媒体
//              * @param cubes
//              * @param medias
//              * @param cache
//              * @param success
//              * @param failure
//              */
//             sendImages: function sendImages(cubes, medias, cache, success, failure) {
//                 console.log('cube num = ' + cubes.length + ' media num = ' + medias.length);
//                 isCache = cache;
//                 sendImageSuccessCallback = success;
//                 sendImageFailCallback = failure;
//                 xcaseManager.sendCubesMedias(cubes, medias, cache, didSendImageSuccess, didSendImageFailed);
//             },
//             /*******************设置和获取小块属性*********************/
//             /**
//              * @brief 设置小块背景颜色
//              * @param cube 	需要设置背景色的小块对象
//              * @param color 	rgb颜色值，如：0xff0000
//              */
//             setBackgroundColor: function setBackgroundColor(cube, color) {
//                 xcaseManager.setCubeBackground(cube, color);
//             },
//             /**
//              * @brief 设置小块边框
//              * @param cube 	需要设置边框的小块对象
//              * @param color 	边框的颜色值
//              * @param width 	边框的宽度   PS：以像素为单位，取值0~10
//              */
//             showBorder: function showBorder(cube, color, width) {
//                 xcaseManager.drawCubeFrame(cube, color, width);
//             },
//             /**
//              * @brief 闪烁小块
//              * @param cube 	小块对象的数组
//              * @param count 	需要闪烁的次数，>0的整数才有效
//              */
//             twinkleCube: function twinkleCube(cube, count) {
//                 xcaseManager.twinkleCube(cube, count);
//             },
//             /**
//              * 显示LOGO
//              * @param cube
//              */
//             showLogo: function showLogo(cube) {
//                 xcaseManager.showPic(cube, 1);
//             },
//             /**
//              * 显示连接上图片
//              * @param cube
//              */
//             showConnPic: function showConnPic(cube) {
//                 xcaseManager.showPic(cube, 2);
//             },
//             /**
//              * 小块关机
//              * @param cube 单个对象
//              */
//             powerOffCube: function powerOffCube(cube) {
//                 xcaseManager.powerOff(cube);
//             },
//             /**
//              * 复位主机
//              */
//             reset: function reset() {
//                 xcaseManager.reset();
//                 errCatch.scope._timeout(function () {
//                     errCatch.scope._cube.cubes = instance.cubes;
//                 });
//             },
//             showDynamicBoarder: function showDynamicBoarder(cube) {
//                 xcaseManager.showDynamicBoarder(cube);
//             },
//             /**********************设置分组和取消分组**********************/
//             /**
//              * 设置分组
//              * @param teams 小块数组列表
//              */
//             groupingCubes: function groupingCubes(teams) {
//                 xcaseManager.splitCubesAsTeams(teams);
//             },
//             /**
//              * @brief 取消分组
//              */
//             clearGroup: function clearGroup() {
//                 xcaseManager.destroyTeams();
//             },
//             /***************************其它****************************/
//             /**
//              * @brief 设置题目的正确答案
//              * @param cubes 			小块对象的数组
//              * @param directions 	小块方向的数组（上下左右：0123）
//              * @param orientation 	排列方式（横向/纵向：0/1）
//              * @param teamId 		小块所在的组Id，默认值为-1
//              */
//             setRightReuslt: function setRightReuslt(cubes, directions, orientation, teamId) {},
//             /**
//              * @brief 设置摇晃检查是否开启，如果关闭了，则不能检测到小块的摇晃操作
//              * @param isEnable 开启：true，关闭：false
//              */
//             setShakeEnable: function setShakeEnable(isEnable) {},
//             /**
//              * @brief 设置碰撞检查是否开启，如果关闭了，则不能检测到小块的碰撞操作
//              * @param isEnable 开启：true，关闭：false
//              */
//             setContactEnable: function setContactEnable(isEnable) {},
//             /**
//              * @brief 设置排列检查是否开启，如果关闭了，则不能检测到小块的排列操作
//              * @param isEnable 开启：true，关闭：false
//              */
//             setArrangementEnable: function setArrangementEnable(isEnable) {},
//             /**
//              * @brief 开启或关闭小块的所有功能，如果关闭了，则小块的所有操作都检测不到
//              * @param isEnable 开启：true，关闭：false
//              */
//             toggleCubeAllFouctions: function toggleCubeAllFouctions(isEnable) {},
//             /**
//              * @brief 设置是否阻止摇晃上报引起的冲突（碰撞的时候会干扰，引起线程阻塞）
//              PS：当前排列算法引起的问题，摇晃的时候最好关闭排列功能，否则会引起线程阻塞。
//              * @param isEnable 开启：true，关闭：false
//              */
//             setCollision: function setCollision(isEnable) {},
//             /*********************注册监听****************************/
//             /**
//              * @brief 注册摇晃监听
//              * @return 连接成功的小块数组
//              */
//             registShakeListener: function registShakeListener(listener) {
//                 xcaseManager.registerOnShake(listener);
//             },
//             registContactListener: function registContactListener(listener) {
//                 xcaseManager.registerOnMerge(listener);
//             },
//             registDivideListener: function registDivideListener(listener) {
//                 xcaseManager.registerOnDivide(listener);
//             },
//             registArrangementListener: function registArrangementListener(listener) {},
//             registDisconnetListener: function registDisconnetListener(listener) {
//                 xcaseManager.registerOnDisconnect(function (cube) {
//                     if (cube) {
//                         // 小块断开处理
//                         logger("disconnect cube = " + cube.deviceId + ",remain cube num = " + instance.cubes.length);
//                         faultDisFlag = true;
//                         errCatch.scope._timeout(function () {
//                             errCatch.scope._cube.cubes = instance.cubes;
//                         });
//                         if (!findCubesInUnusedCubes(cube)) {
//                             // 发通知，暂停答题
//                             errCatch.scope.$broadcast('USBFaultDis');
//                             // 在分组页面和游戏页面才显示弹框
//                             if (errCatch.scope._state.current.name == 'layout.gamesEn' || errCatch.scope._state.current.name == 'layout.app.deviceGroupColor') {
//                                 (function () {
//                                     var confirmResearch = function confirmResearch() {
//                                         // 提示是否重新搜索
//                                         errCatch.scope._modal.showConfirm($.tripTitle.hint, $.tips.autoDisHint, function () {
//                                             // 重新搜索
//                                             logger('重新搜索小块');
//                                             errCatch.scope._loading.loading($.tips.loadDevice);
//                                             var num = instance.manager.getCurrentCourseCubeNum();
//                                             instance.manager.connect(num, function (cubes) {
//                                                 //重新搜索成功
//                                                 faultDisFlag = false;
//                                                 logger('research cube num = ' + cubes.length);
//                                                 errCatch.scope._loading.finish();
//                                                 instance.cubes = cubes;
//                                                 if (cubes && cubes.length < num) {
//                                                     //搜索到的小块个数不够
//                                                     // errCatch.scope.$broadcast('USBFaultDis', '4');
//                                                     confirmResearch();
//                                                 } else {
//                                                     //足够小块的个数
//                                                     errCatch.scope.$broadcast('USBFaultDis', '3');
//                                                 }
//                                             });
//                                         }, function () {
//                                             // 点击退出
//                                             errCatch.scope.$broadcast('USBFaultDis', '5');
//                                         }, $.tripTitle.reSearch, '退出');
//                                     };
//
//                                     confirmResearch();
//                                 })();
//                             }
//                         }
//                     }
//                 });
//             },
//             registUSBDisconnectListener: function registUSBDisconnectListener(listener) {
//                 xcaseManager.registerOnUSBDisconnect(function () {
//                     logger('usb disconnected!!!');
//                     errCatch.scope._timeout(function () {
//                         errCatch.scope._cube.cubes = [];
//                     });
//                     faultDisFlag = true;
//                     errCatch.scope.$broadcast('USBFaultDis', '1');
//                     errCatch.scope._modal.showAlert($.tripTitle.hint, $.tips.usbFaultDis, function () {
//                         errCatch.scope.$broadcast('USBFaultDis', '2');
//                     }, $.tripTitle.confirm);
//                 });
//             },
//             registCubeTurnListener: function registCubeTurnListener(listener) {
//                 xcaseManager.registerOnTurn(listener); //cube, lastOrien, currentOrien
//             },
//             /****************************信息类函数****************************/
//             /**
//              * 获取当前上课的小块个数
//              */
//             getCurrentCourseCubeNum: function getCurrentCourseCubeNum() {
//                 var groupNum = instance.groupCount; //当前分组个数
//                 var currentCourseCubeNum = instance.default.OneGroupCount * groupNum;
//                 return currentCourseCubeNum;
//             }
//         };
//         return result;
//     }
//     instance.manager = init();
//     return instance;
// }]);
