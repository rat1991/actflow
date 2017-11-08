/*
跳转到登录: toAppLogin
跳转到注册: toAppRegister
返回首页: toAppMainPage
跳转到散标投资列表#--投资-优质项目--#: toAppInvestList
跳转到散标项目详情: toAppInvestDetails
跳转到申请资产标借款（我要借款子页面）: toAppLoan
跳转到我的投资列表: toAppMyInvest
跳转到我的投资详情: toAppMyInvestDetail
跳转到团宝箱: toAppTBX
跳转到现金红包: toAppCashRedPacket
跳转到投资红包: toAppOrdinaryRedPacket
跳转到加息卷: toAppKasiRedPacket
跳转到提现卷: toAppWithdrawalRoll
跳转到签到卡: toAppSingInRoll
跳转到精美礼品: toAppPresent
充值: toAppRecharge
我的财富: toAppPersonalCenter
邀请好友: toAppInviteFriend
活动分享: toAppActivity
WE计划列表#--投资-理财计划--#: toAppWePlan
跳转到WE计划项目详情: toAppWePlanDetail
发现: toAppFind
新手专区: toAppBeginnersArea
团贷公告列表: toAppPublicNoticeList
团贷公告详情: toAppPublicNoticeDetails
系统消息列表: toAppSystemMessagesList
系统消息详情: toAppSystemMessagesDetails
我要借款: toAppIWantBorrow
意见反馈: toAppFeedBack
团贷社区: toAppTuandaiBBS
自动投标: toAppAutoBid
我的借款列表: toAppMyBorrowing
我的借款详情: toAppMyBorrowingDetails
理财日历: toAppDebtCollectionCalendar
播放音乐: appPlayMusic
停止播放音乐: appStopMusic
设置原生标题栏文字及右侧按钮: setTitleComponent
title右侧按钮的type为2时的按钮点击事件: rightButtonClick
分享成功之后的回调: shareActivitySuccessed
投资列表-P2P-债权转让: toAppBondsTransferList
投资列表-定期理财-理财计划: toAppFinancialPlanListFi
投资列表-定期理财-定期项目: toAppRegularProjectListFi
P2P-债权转让项目详情: toAppBondsTransferDetails
定期理财-理财计划项目详情: toAppFinancialPlanDetailsFi
定期理财-定期项目项目详情: toAppRegularProjectDetailsFi
团贷签到: toAppSignIn（5.1.1删除）
P2P-投资记录-we计划: toAppMyInvestWePlanList
we计划投资详情: toAppMyInvestWePlanDetails
定期理财-投资记录-理财计划: toAppMyInvestFinancialPlanListFi
定期理财-投资记录-定期项目: toAppMyInvestRegularProjectListFi
定期理财-充值: toAppTopUpFi
定期理财-理财日历: toAppDebtCollectionCalendarFi
理财计划投资详情: toAppMyInvestFinancialPlanDetailsFi
定期项目投资详情: toAppMyInvestRegularProjectListDetailsFi
证券交易: toAppSecuritiesTrading
开通存管提示弹窗: toAppBankOpenDepositoryAlert
非固定插件调用: exec
投资列表-定期理财-定期转让: toAppBondsTransferList_fi
定期理财-定期转让项目详情: toAppBondsTransferDetails_fi
会员中心: toAPPMenberCenter
新手体验金: toAppNoviceExperienceGold
个人资料: toAppPersonalData
个人资料-详细资料: toAppDetails
更新app（android）: toAppUpdateAPK
网贷专区: toAppP2p
定期专区: toAppRegularFi
电话客服: toAppCallService
人工客服: toAppOnlineService
私募: toAppPrivatePlacement
私募-私募项目详情: toAppPrivatePlacementDetails
webview播放视频: toAppViedoWebView  
toAppWebViewShare: 动态地址分享

*/
(function(win) {

    function isIOS() {
        return navigator.userAgent.match(/(iPad|iPhone)/);
    }

    function connectWebViewJavascriptBridge(callback) {

        if (window.WebViewJavascriptBridge) {
            typeof callback === 'function' && callback.call(this, WebViewJavascriptBridge);
        } else {
            document.addEventListener(
                'WebViewJavascriptBridgeReady',
                function() {
                    typeof callback === 'function' && callback.call(this, WebViewJavascriptBridge);
                },
                false
            );
        }
    }

    /*
        @params:
            method: function 原生方法
            param: 参数
            callback: 回调
    */

    function iosHandler(method, param, callback) {
        typeof method === 'function' && method.apply(this, [param, function(respones) {
            typeof callback && callback.call(this, respones);
        }]);
        /*window[method](param, function(respones) {
            typeof callback && callback.call(this, respones);
        });*/
    }

    function androidHandler(method, param, callback) {

        win.WebViewJavascriptBridge.callHandler(
            method, param,
            function(responseData) {
                typeof callback === 'function' && callback.apply(this, arguments);
            }
        );
    }
    /*版本对比 
        @params: equal 是否包含等于 true 包含 false 不包含
        例：v1 > v2 return true 
            v1 >= v2 return true 
    */
    function compareVersion(v1, v2, equal) {
        var arr = v1 && v1.split(".");
        var list = v2 && v2.split(".");
        if (!arr || !list) return;

        var i = 0;
        var arrlength = arr.length;
        var listlength = list.length;
        var length = arrlength > listlength ? arrlength : listlength; //取最长的数组长度
        var isEqual = false;
        var item1 = "";
        var item2 = "";
        for (; i < length; i++) {
            item1 = Number(arr[i]);
            item2 = Number(list[i]);

            item1 = isNaN(item1) ? 0 : item1;
            item2 = isNaN(item2) ? 0 : item2;
            if (i == length - 1)
                isEqual = item1 === item2 && equal; //是否包含等于

            if (item1 > item2 || isEqual) {
                return true;
            } else if (item1 < item2) {
                return false
            }
        }
        return false;
    }

    function values(obj) {
        var vals = [];

        for (var key in obj) {
            vals.push(obj[key]);
        }

        return vals;
    }

    function caller(method, params, callback, isJson) {

        try {
            if (isIOS()) {
                var params = params || undefined;
                if (isJson) {

                    iosHandler(method, params ? params : null, callback)
                } else {
                    params = values(params ? params : {});
                    typeof method === 'function' && method.apply(this, params.length === 0 ? undefined : params);
                }
            } else {
                androidHandler(method, params ? params : null, callback);
            }
        } catch (e) {
            console.info("不支持jsbridge", e);
        }
    }


    var Jsbridge = function() {};
    Jsbridge.prototype = {
        //关闭页面
        closeWeb: function() {
            var method = isIOS() ? CloseWeb : 'CloseWeb';
            caller(method, null);
        },
        //跳转到登录
        toAppLogin: function() {
            var method = isIOS() ? ToAppLogin : 'ToAppLogin';
            caller(method, null);
        },
        // 跳转到注册
        toAppRegister: function() {
            var method = isIOS() ? ToAppRegister : 'ToAppRegister';
            caller(method, null);
        },
        // 返回首页
        toAppMainPage: function() {
            var method = isIOS() ? ToAppHomePage : 'ToAppHomePage';
            caller(method, null);

        },
        // 跳转到散标投资列表#--投资-优质项目--#
        toAppInvestList: function() {
            var method = isIOS() ? ToAppScatteredList : 'ToAppScatteredList';
            caller(method, null);

        },
        // 跳转到散标项目详情
        /**
            Id：string 项目id
            TypeId：int 项目类型 1-商友贷 6-净值标 7-股权抵押标9-车贷 10-消费贷 11-房贷 15-分期宝 17-股票配资 20-供应链22-项目宝（固定期限）23-项目宝（浮动期限）25-分期宝-正合普惠
            SubTypeId： int 项目类型子类型 1-分期宝 2-分期乐3-小树时代4-快来贷5-你我金融
            ProfitTypeId： int 收益类型 1-浮动 2-固定
            XmbSubType： boolean 项目宝子类型  0-默认值 1-私募股权2-房地产3-其它

        */

        toAppInvestDetails: function(id, typeId, subTypeId, profitTypeId, xmbSubType) {
            var investParam = {
                'Id': id,
                'TypeId': typeId,
                'SubTypeId': subTypeId,
                'ProfitTypeId': profitTypeId,
                'XmbSubType': xmbSubType
            };
            var method = isIOS() ? ToAppScatteredDetails : 'ToAppScatteredDetails';
            caller(method, investParam);
        },
        // 跳转到申请资产标借款（我要借款子页面）
        toAppLoan: function() {
            var method = isIOS() ? ToAppApplyForAssets : 'ToAppApplyForAssets';
            caller(method, null);
        },
        // 跳转到我的投资列表
        toAppMyInvest: function() {
            var method = isIOS() ? ToAppMyInvestment : 'ToAppMyInvestment';
            caller(method, null);
        },
        // 跳转到我的投资详情
        /**
            ProjectId:项目类型
            Type: 申购id
            InvestId:项目ID
            ProfitTypeId:
            IsWePlanX：是否为we计划X 可不传
            SubTypeId： 项目类型子id
            weXPlanType: 0：普通WE计划 1：WE分期宝 2：复投宝 3:复投宝新手标
        */
        toAppMyInvestDetail: function(projectId, type, investId, profitTypeId, isWePlanX, subTypeId, weXPlanType, title) {
            var investParam = {
                'ProjectId': projectId,
                'Type': type,
                'InvestId': investId,
                'ProfitTypeId': profitTypeId,
                'IsWePlanX': isWePlanX,
                'SubTypeId': subTypeId,
                'TDWeXPlanType': weXPlanType,
                'Title': title
            }
            var method = isIOS() ? ToAppMyInvestmentDetails : 'ToAppMyInvestmentDetails';
            caller(method, investParam);
        },
        // 跳转到团宝箱
        toAppTBX: function() {
            var method = isIOS() ? ToAppTreasureChest : 'ToAppTreasureChest';
            caller(method, null);
        },
        // 跳转到现金红包
        toAppCashRedPacket: function() {
            var method = isIOS() ? ToAppCashBonus : 'ToAppCashBonus';
            caller(method, null);
        },
        // 跳转到投资红包
        toAppOrdinaryRedPacket: function() {
            var method = isIOS() ? ToAppInvestBonus : 'ToAppInvestBonus';
            caller(method, null);
        },
        // 跳转到加息卷
        toAppKasiRedPacket: function() {
            var method = isIOS() ? ToAppRateIncreaseBonus : 'ToAppRateIncreaseBonus';
            caller(method, null);
        },
        // 跳转到提现卷
        toAppWithdrawalRoll: function() {
            var method = isIOS() ? ToAppReflectBonus : 'ToAppReflectBonus';
            caller(method, null);
        },

        // 跳转到签到卡 
        toAppSingInRoll: function() {
            var method = isIOS() ? ToAppSignInCard : 'ToAppSignInCard';
            caller(method, null);
        },
        // 跳转到精美礼品
        toAppPresent: function() {
            var method = isIOS() ? ToAppExquisiteGift : 'ToAppExquisiteGift';
            caller(method, null);
        },
        //充值
        toAppRecharge: function() {
            var method = isIOS() ? ToAppTopUp : 'ToAppTopUp';
            caller(method, null);
        },


        //我的财富
        toAppPersonalCenter: function() {
            var method = isIOS() ? ToAppMy : 'ToAppMy';
            caller(method, null);
        },
        //邀请好友
        toAppInviteFriend: function() {
            var method = isIOS() ? ToAppInvitedShare : 'ToAppInvitedShare';
            caller(method, null);

        },

        //活动分享
        /*
            shareType: 1-活动分享；2-邀请有礼；3-签到分享；4-活动分享2；5-活动分享3；
                       6-运营报告分享；7：品牌专题分享1；8-品牌专题分享2；9-活动分享4；
                       10-活动分享5；11-活动分享6；12-活动分享7；13-活动分享8；14-活动分享9；
                       15-活动分享10；16-活动分享11；17-活动分享12；18-活动分享13 ； 
                       19-活动分享14；20-活动分享15；21-活动分享16；22-活动分享17 ；
                       23-活动分享18；24-活动分享19；25-活动分享20；

        */
        toAppActivity: function(shareType) {
            //不允许传2,3
            if (shareType == 2 || shareType == 3) {
                // alert("参数错误！");
                console.error('toAppActivity参数错误！');
                return;
            }
            var param = {
                FunctionType: shareType
            }
            var method = isIOS() ? ToAppActivity : 'ToAppActivity';
            caller(method, param);
        },

        //WE计划列表#--投资-理财计划--#
        toAppWePlan: function() {
            var method = isIOS() ? ToAppWePlanList : 'ToAppWePlanList';
            caller(method, null);
        },
        // 跳转到WE计划项目详情
        /**
            weXPlanType: 0：普通WE计划 1：WE分期宝 2：复投宝 3:复投宝新手标
        */
        toAppWePlanDetail: function(productId, typeId, subTypeId, weXPlanType, title) {
            var wxInvestParam = {
                'ProductId': productId,
                'TypeId': typeId,
                'SubTypeId': subTypeId,
                'TDWeXPlanType': weXPlanType,
                'Title': title
            };
            var method = isIOS() ? ToAppWePlanDetails : 'ToAppWePlanDetails';
            caller(method, wxInvestParam);
        },

        /*
        --------------------------------------------新增方法开始--------------------------------------------
        */
        //发现
        toAppFind: function() {
            var method = isIOS() ? ToAppFind : 'ToAppFind';
            caller(method, null);
        },
        //新手专区
        toAppBeginnersArea: function() {
            var method = isIOS() ? ToAppBeginnersArea : 'ToAppBeginnersArea';
            caller(method, null);
        },
        //团贷公告列表
        toAppPublicNoticeList: function() {
            var method = isIOS() ? ToAppPublicNoticeList : 'ToAppPublicNoticeList';
            caller(method, null);
        },
        //团贷公告详情
        /*
            id: 公告id
            url: 如果有值表示跳转到该url地址的h5页面，否则跳转到原生页面,
            title: 目标页面标题
        */
        toAppPublicNoticeDetails: function(id, url, title) {
            var reqParam = {
                'id': id,
                'url': url,
                'title': title
            };
            var method = isIOS() ? ToAppPublicNoticeDetails : 'ToAppPublicNoticeDetails';
            caller(method, reqParam);
        },
        //系统消息列表
        toAppSystemMessagesList: function() {
            var method = isIOS() ? ToAppSystemMessagesList : 'ToAppSystemMessagesList';
            caller(method, null);
        },
        //系统消息详情
        /*
            id: 系统消息id
            url: 如果有值表示跳转到该url地址的h5页面，否则跳转到原生页面,
            title: 目标页面标题
        */
        toAppSystemMessagesDetails: function(id, url, title) {
            var reqParam = {
                'id': id,
                'url': url,
                'title': title
            };
            var method = isIOS() ? ToAppSystemMessagesDetails : 'ToAppSystemMessagesDetails';
            caller(method, reqParam);
        },
        //我要借款
        toAppIWantBorrow: function() {
            var method = isIOS() ? ToAppIWantBorrow : 'ToAppIWantBorrow';
            caller(method, null);
        },
        //意见反馈
        toAppFeedBack: function() {
            var method = isIOS() ? ToAppFeedBack : 'ToAppFeedBack';
            caller(method, null);
        },
        //团贷社区
        toAppTuandaiBBS: function(title, url) {
            var reqParam = {
                'title': title,
                'url': url
            };
            var method = isIOS() ? ToAppTuandaiBBS : 'ToAppTuandaiBBS';
            caller(method, reqParam);
        },
        //自动投标
        toAppAutoBid: function() {
            var method = isIOS() ? ToAppAutoBid : 'ToAppAutoBid';
            caller(method, null);
        },
        //我的借款列表
        toAppMyBorrowing: function() {
            var method = isIOS() ? ToAppMyBorrowing : 'ToAppMyBorrowing';
            caller(method, null);
        },
        //我的借款详情
        /**
            ProjectId:项目类型
            Type: 申购id
            InvestId:项目ID
            ProfitTypeId:
            IsWePlanX：是否为we计划X 可不传
            SubTypeId： 项目类型子id
        */
        toAppMyBorrowingDetails: function(projectId, type, investId, profitTypeId, isWePlanX, subTypeId) {
            var investParam = {
                'ProjectId': projectId,
                'Type': type,
                'InvestId': investId,
                'ProfitTypeId': profitTypeId,
                'IsWePlanX': isWePlanX,
                'SubTypeId': subTypeId
            };
            var method = isIOS() ? ToAppMyBorrowingDetails : 'ToAppMyBorrowingDetails';
            caller(method, investParam);
        },

        //理财日历
        toAppDebtCollectionCalendar: function() {
            var method = isIOS() ? ToAppDebtCollectionCalendar : 'ToAppDebtCollectionCalendar';
            caller(method, null);
        },

        /*
         *--------------------------------------------新增方法结束--------------------------------------------
         */
        appPlayMusic: function(musicUrl) {
            var param = {
                'url': musicUrl
            };
            var method = isIOS() ? ToAppIosPlayMusic : 'WebViewOnPlayMusic';
            caller(method, param);
        },
        appStopMusic: function() {
            var method = isIOS() ? ToAppIosStopMusic : 'WebViewOnPauseMusic';
            caller(method, null);
        },

        //设置原生标题栏文字及右侧按钮
        /*
                titleContent 标题栏内容
                rightbuttonVisible 右侧按钮是否显示
                rightbuttonContent 右侧按钮内容
                rightbuttonTyppe 右侧按钮类型（ 1: 分享 2: 调用js事件） 为2时，点击按钮触发rightButtonClick 类型为1时不传shareTypeList参数默认为分享邀请好友
                showTitleComponent: 是否显示标题栏 true则显示
                shareTypeList: 分享列表（array）
                showTitleComponent: 是否显示标题栏 Boolean true为显示， false为不显示
                rightBtnCb: 右侧按钮回调函数，rightbuttonTyppe为1则为分享成功后的回调 （写了这个回调后不需要另外写RightButtonClick及shareActivitySuccessed）
                */
        setTitleComponent: function(params) {
            var method = isIOS() ? setTitleComponent : 'setTitleComponent';
            // var cb = params.shareCb ? params.shareCb : null;
            caller(method, params, null, true);
            if (params.rightBtnCb) {
                this.registeEvent('RightButtonClick', params.rightBtnCb);
            }
        },
        /*1124新增方法-----------4.9.0----*/
        //投资列表-P2P-债权转让
        toAppBondsTransferList: function() {
            var method = isIOS() ? ToAppBondsTransferList : 'ToAppBondsTransferList';
            caller(method, null);
        },
        //投资列表-定期理财-理财计划
        toAppFinancialPlanListFi: function() {
            var method = isIOS() ? ToAppFinancialPlanList_fi : 'ToAppFinancialPlanList_fi';
            caller(method, null);
        },
        //投资列表-定期理财-定期项目
        toAppRegularProjectListFi: function() {
            var method = isIOS() ? ToAppRegularProjectList_fi : 'ToAppRegularProjectList_fi';
            caller(method, null);
        },
        //P2P-债权转让项目详情
        toAppBondsTransferDetails: function(Id, TypeId) {
            var param = {
                'Id': Id,
                'TypeId': TypeId
            };
            var method = isIOS() ? ToAppBondsTransferDetails : 'ToAppBondsTransferDetails';
            caller(method, param);
        },
        //定期理财-理财计划项目详情

        toAppFinancialPlanDetailsFi: function(id, typeId, subTypeId) {
            var param = {
                "Id": id,
                "TypeId": typeId,
                "SubTypeId": subTypeId,
            };
            var method = isIOS() ? ToAppFinancialPlanDetails_fi : 'ToAppFinancialPlanDetails_fi';
            caller(method, param);
        },
        //定期理财-定期项目项目详情
        /**
            Id：string 项目id
            TypeId：int 项目类型 1-商友贷 6-净值标 7-股权抵押标9-车贷 10-消费贷 11-房贷 15-分期宝 17-股票配资 20-供应链22-项目宝（固定期限）23-项目宝（浮动期限）25-分期宝-正合普惠
            SubTypeId： int 项目类型子类型 1-分期宝 2-分期乐3-小树时代4-快来贷5-你我金融
            ProfitTypeId： int 收益类型 1-浮动 2-固定
            XmbSubType： boolean 项目宝子类型  0-默认值 1-私募股权2-房地产3-其它

        */
        toAppRegularProjectDetailsFi: function(id, typeId, subTypeId, profitTypeId, xmbSubType) {
            var investParam = {
                'Id': id,
                'TypeId': typeId,
                'SubTypeId': subTypeId,
                'ProfitTypeId': profitTypeId,
                'XmbSubType': xmbSubType
            };
            var method = isIOS() ? ToAppRegularProjectDetails_fi : 'ToAppRegularProjectDetails_fi';
            caller(method, investParam);
        },
        //团贷签到
        toAppSignIn: function() {
            var method = isIOS() ? ToAppSignIn : 'ToAppSignIn';
            caller(method, null);
        },
        //P2P-投资记录-we计划
        toAppMyInvestWePlanList: function() {
            var method = isIOS() ? ToAppMyInvestWePlanList : 'ToAppMyInvestWePlanList';
            caller(method, null);
        },
        //we计划投资详情
        /**
            ProjectId:项目类型
            Type: 申购id
            InvestId:项目ID
            ProfitTypeId:
            IsWePlanX：是否为we计划X 可不传
            SubTypeId： 项目类型子id
            weXPlanType: 0：普通WE计划 1：WE分期宝 2：复投宝 3:复投宝新手标
        */
        toAppMyInvestWePlanDetails: function(projectId, type, investId, profitTypeId, isWePlanX, subTypeId, weXPlanType, title) {
            var param = {
                'ProjectId': projectId,
                'Type': type,
                'InvestId': investId,
                'ProfitTypeId': profitTypeId,
                'IsWePlanX': isWePlanX,
                'subTypeId': subTypeId,
                'TDWeXPlanType': weXPlanType,
                'Title': title
            };
            var method = isIOS() ? ToAppMyInvestWePlanDetails : 'ToAppMyInvestWePlanDetails';
            caller(method, param);
        },
        //定期理财-投资记录-理财计划
        toAppMyInvestFinancialPlanListFi: function() {

            var method = isIOS() ? ToAppMyInvestFinancialPlanList_fi : 'ToAppMyInvestFinancialPlanList_fi';
            caller(method, null);
        },
        //定期理财-投资记录-定期项目
        toAppMyInvestRegularProjectListFi: function() {
            var method = isIOS() ? ToAppMyInvestRegularProjectList_fi : 'ToAppMyInvestRegularProjectList_fi';
            caller(method, null);
        },
        //定期理财-充值
        toAppTopUpFi: function() {
            var method = isIOS() ? ToAppTopUp_fi : 'ToAppTopUp_fi';
            caller(method, null);
        },
        //定期理财-理财日历
        toAppDebtCollectionCalendarFi: function() {
            var method = isIOS() ? ToAppDebtCollectionCalendar_fi : 'ToAppDebtCollectionCalendar_fi';
            caller(method, null);
        },
        //理财计划投资详情
        /**
            ProjectId:项目类型
            Type: 申购id
            InvestId:项目ID
            ProfitTypeId:
            IsWePlanX：是否为we计划X 可不传
            SubTypeId： 项目类型子id
            weXPlanType: 0：普通WE计划 1：WE分期宝 2：复投宝 3:复投宝新手标
        */
        toAppMyInvestFinancialPlanDetailsFi: function(projectId, type, investId, profitTypeId, isWePlanX, subTypeId, weXPlanType, title) {
            var investParam = {
                'ProjectId': projectId,
                'Type': type,
                'InvestId': investId,
                'ProfitTypeId': profitTypeId,
                'IsWePlanX': isWePlanX,
                'SubTypeId': subTypeId,
                'TDWeXPlanType': weXPlanType,
                'Title': title
            };
            var method = isIOS() ? ToAppMyInvestFinancialPlanDetails_fi : 'ToAppMyInvestFinancialPlanDetails_fi';
            caller(method, investParam);
        },
        //定期项目投资详情
        /**
            ProjectId:项目类型
            Type: 申购id
            InvestId:项目ID
            ProfitTypeId:
            IsWePlanX：是否为we计划X 可不传
            SubTypeId： 项目类型子id
            weXPlanType: 0：普通WE计划 1：WE分期宝 2：复投宝 3:复投宝新手标
        */
        toAppMyInvestRegularProjectListDetailsFi: function(projectId, type, investId, profitTypeId, isWePlanX, subTypeId, weXPlanType, title) {
            var investParam = {
                'ProjectId': projectId,
                'Type': type,
                'InvestId': investId,
                'ProfitTypeId': profitTypeId,
                'IsWePlanX': isWePlanX,
                'SubTypeId': subTypeId,
                'TDWeXPlanType': weXPlanType,
                'Title': title
            };
            var method = isIOS() ? ToAppMyInvestRegularProjectListDetails_fi : 'ToAppMyInvestRegularProjectListDetails_fi';
            caller(method, investParam);
        },

        /*1124新增方法 ---end*/

        /*161226新增方法----4.9.3-------*/
        //证券交易
        toAppSecuritiesTrading: function() {
            var method = isIOS() ? ToAppSecuritiesTrading : 'ToAppSecuritiesTrading';
            caller(method, null);
        },
        //开通存管提示弹窗
        toAppBankOpenDepositoryAlert: function() {
            var method = isIOS() ? ToAppBankOpenDepositoryAlert : 'ToAppBankOpenDepositoryAlert';
            caller(method, null);
        },
        /*161226新增方法-----------end*/

        /*170324新增方法开始------.5.0.1-------------------*/
        //投资列表-定期理财-定期转让
        toAppBondsTransferListFi: function() {
            var method = isIOS() ? ToAppBondsTransferList_fi : 'ToAppBondsTransferList_fi';
            caller(method, null);
        },
        //定期理财-定期转让项目详情
        /**
            productId: 项目ID
            typeId: 项目类型 1:商友贷 3:零售贷 6:净值标 7:股权抵押标 9:车贷 11:房贷 15:分期宝  18:私募宝 20:供应链金融   22:项目宝固定 23：项目宝浮动 25正合普惠 100：we计划 
            subTypeId: 子类型
            weXPlanType: we计划类型
            title: 标题
        */
        toAppBondsTransferDetailsFi: function(productId, typeId, subTypeId, weXPlanType, title) {
            var param = {
                'Id': productId,
                'TypeId': typeId,
                'subTypeId': subTypeId,
                'weXPlanType': weXPlanType,
                'title': title
            };
            var method = isIOS() ? ToAppBondsTransferDetails_fi : 'ToAppBondsTransferDetails_fi';
            caller(method, param);
        },
        //会员中心
        toAPPMenberCenter: function() {
            var method = isIOS() ? ToAPPMenberCenter : 'ToAPPMenberCenter';
            caller(method, null);
        },
        //新手体验金
        toAppNoviceExperienceGold: function() {
            var method = isIOS() ? ToAppNoviceExperienceGold : 'ToAppNoviceExperienceGold';
            caller(method, null);
        },
        //个人资料
        toAppPersonalData: function() {
            var method = isIOS() ? ToAppPersonalData : 'ToAppPersonalData';
            caller(method, null);
        },
        //个人资料-详细资料
        toAppDetails: function() {
            var method = isIOS() ? ToAppDetails : 'ToAppDetails';
            caller(method, null);
        },
        //更新app（android调用原生方法，ios直接唤起AppStore）
        toAppUpdateAPK: function() {
            console.info('toAppUpdateAPK--');
            try {
                if (isIOS()) {
                    window.location.href = 'https://itunes.apple.com/cn/app/%E5%9B%A2%E8%B4%B7%E7%BD%91-%E5%AE%89%E5%85%A8%E5%90%88%E8%A7%84%E7%9A%84%E7%90%86%E8%B4%A2%E5%B9%B3%E5%8F%B0/id796440356?mt=8';
                } else {
                    androidHandler('ToAppUpdateAPK', null);
                }
            } catch (e) {
                console.info("不支持jsbridge", e);
            }
        },


        /*------170324新增方法结束-----end--------------*/

        /*170428新增方法开始------.5.1.0-------------------*/
        //网贷专区
        toAppP2p: function() {
            var method = isIOS() ? ToAppP2p : 'ToAppP2p';
            caller(method, null);
        },
        //定期专区
        toAppRegularFi: function() {
            var method = isIOS() ? ToAppRegular_fi : 'ToAppRegular_fi';
            caller(method, null);
        },
        /*------170428新增方法结束-----end--------------*/
        //电话客服
        toAppCallService: function() {
            var method = isIOS() ? ToAppIosCallService : 'ToAppCallService';
            caller(method, null);
        },
        //人工客服
        toAppOnlineService: function() {
            var method = isIOS() ? ToAppIosOnlineService : 'ToAppOnlineService';
            caller(method, null);
        },
        //安全中心
        // toAppSecurityCenter: function() { 
        //  try {
        //      if (isIOS()) {
        //          typeof ToAppIosSaftCenter === 'function' && ToAppIosSaftCenter();
        //          typeof ToAppSecurityCenter === 'function' && ToAppSecurityCenter();

        //      } else {
        //          androidHandler('ToAppSecurityCenter', null);
        //      }

        //  } catch (e) {
        //      console.info("不支持jsbridge", e);
        //  }
        // },

        /*------170523新增方法开始---5.1.1--start--------------*/

        //私募
        toAppPrivatePlacement: function() {
            var method = isIOS() ? ToAppPrivatePlacement : 'ToAppPrivatePlacement';
            caller(method, null);
        },
        //私募-私募项目详情
        /**
            跳转到私募项目详情前置条件：投资者是否符合合格投资者资格认定，符合才能跳转
            mFundId: 项目id,
            qiiStatus: 合格投资者状态 1合格2不合格
        */
        toAppPrivatePlacementDetails: function(mFundId, qiiStatus) {
            if (!qiiStatus) {
                console.error('请判断投资者是否符合合格投资者资格认定');
                return;
            }
            var method = isIOS() ? ToAppPrivatePlacementDetails : 'ToAppPrivatePlacementDetails';
            var params = {
                'mFundId': mFundId,
                'qiiStatus': qiiStatus
            };
            caller(method, params);
        },
        //webview播放视频 
        /* 
            screentype: 1横屏 2竖屏
            videoUrl: 视频播放地址
        */
        toAppViedoWebView: function(screentype, videoUrl) {
            var params = {
                'screentype': screentype,
                'videoUrl': videoUrl
            };
            var method = isIOS() ? ToAppViedoWebView : 'ToAppViedoWebView';
            caller(method, params);
        },

        /*------170523新增方法结束-----end--------------*/

        /*---------------170607新增方法-----start----5.1.2-----*/
        //Webview分享 
        /* 
        params(json):
        {
            shareTypeList: [{
                ShareToolType: 分享类型 1-微信分享 2-短信分享 3-微博分享 4-QQ分享 5-朋友圈分享 6-QQ空间分享 7-二维码
                ShareToolName: 第三方的产品名称， 如微信
                IconUrl: 图片地址
                Title: 标题
                ShareContent: 分享文本内容
                ShareUrl: 分享地址
                IsEnabled: 是否启用 true： 启用 False： 未启用
            }]
        }
        callback: 分享回调 返回参数：成功-onComplete，失败-onError，取消-onCancel
        
        */
        toAppWebViewShare: function(params, callback) {
            var method = isIOS() ? ToAppWebViewShare : 'ToAppWebViewShare';
            caller(method, params, callback, true);
            typeof callback === 'function' && this.registeEvent('RightButtonClick', callback);
        },


        /*---------------170607新增方法-----end----5.1.2-----*/


        //非固定插件调用
        /*
        params,--参数 （json），
        iosName：ios方法名
        androidName：android方法名
        callback：回调函数

        */
        exec: function(methodName, params, callback) {

            var method = isIOS() ? window[methodName] : methodName;
            caller(method, params, callback)
            /*try {
                if (isIOS()) {
                    console.log("ios-func", methodName);
                    iosHandler(methodName, params, callback);

                } else {
                    console.log("android-func");
                    androidHandler(methodName, params, callback);
                }
            } catch (e) {
                console.info("不支持jsbridge", e);
            }*/
        },
        isNewVersion: function() {
            var str = navigator.userAgent;
            var arr = str.match(/\[([^\[\]]*)\]/);

            if (arr && arr[1]) {
                var vst = arr[1].split('_');
                var vstr = vst[0] + vst[1];
                if (vst && vst[vst.length - 1] >= '4.3.4' && (vstr == "tuandaiappandroid" || vstr == "tuandaiappIOS")) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }

        },
        isApp: function() {
            var useragent = navigator.userAgent;
            return useragent.indexOf("tuandaiapp_android") != -1 || useragent.indexOf("tuandaiapp_IOS") != -1;

        },

        isCorrectVersion: function(v, equal) {
            var str = navigator.userAgent;
            var arr = str.match(/\[([^\[\]]*)\]/);
            if (arr && arr[1]) {
                var vst = arr[1].split('_');
                var curVersion = vst[vst.length - 1];
                var isCorrect = compareVersion(curVersion, v, equal);
                return isCorrect;
            } else {
                return false;
            }
        },
        checkVersion: function(v) {
            var str = navigator.userAgent;
            var arr = str.match(/\[([^\[\]]*)\]/);
            v = v || '4.3.5';
            if (arr && arr[1]) {
                var vst = arr[1].split('_');
                var vstr = vst[0] + vst[1];
                if (vst && vst[vst.length - 1] == v && (vstr == "tuandaiappandroid" || vstr == "tuandaiappIOS")) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },


        //监听app事件
        registeEvent: function(method, callback) {
            if (isIOS()) {
                window[method] = function(data) {
                    typeof callback === 'function' && callback.apply(this, arguments);
                }
            } else {
                //android需要注册方法
                connectWebViewJavascriptBridge(function(bridge) {
                    try {
                        if (!window.WebViewJavascriptBridge._messageHandler) {
                            bridge.init(function(message, responseCallback) {
                                responseCallback(data);
                            });
                        }
                    } catch (e) {
                        console.error("jsbridge-----error--", e);
                    }

                    bridge.registerHandler(method, function(data, responseCallback) {
                        var responseData = "Javascript Says Right back aka!";
                        responseCallback(responseData);
                        typeof callback === 'function' && callback.apply(this, arguments);
                    });

                });
            }

        },
        //title右侧按钮的type为2时的按钮点击事件
        rightButtonClick: function(callback) {
            this.registeEvent('RightButtonClick', callback);
        },

        //分享成功之后的回调
        shareActivitySuccessed: function(callback) {
            this.registeEvent('shareActivitySuccessed', callback);
        },



        // 生命周期
        /*
            initCb：初始化回调
            loginTokenCb：获取loginToken用于登录（已废弃）
            readyCb：打开活动页回调（只执行一次）
            webonPauseCb：离开活动页回调
            webonDestroyCb：销毁进程回调
            webonResumeHomeCb: 离开后回到页面时回调
         **/
        appLifeHook: function(initCb, readyCb, webonPauseCb, webonDestroyCb, webonResumeHomeCb) {
            if (isIOS()) {
                /*              window.ToAppIosPostLoginToken = function(data) {

                                    loginTokenCb.apply(this, arguments);
                                }*/
                /*
                step:
                1： h5界面加载完毕 注册h5调用原生的方法， 此时原生调用h5 传参数1
                2： 当前的h5界面 将进入了下一个界面或者上一个界面。 此时传参2
                3: 用户按home键 将程序退至后台， 此时传参3
                4: 用户重新启动程序(程序由后台切换至前台), 此时传数4
                */
                win.ToAppLifeCycle = function(step) {
                    switch (step) {
                        case 1:
                            typeof readyCb === 'function' && readyCb.apply(this, arguments);
                            break;
                        case 2:
                            typeof webonPauseCb === 'function' && webonPauseCb.apply(this, arguments);
                            break;
                        case 3:
                            typeof webonPauseCb === 'function' && webonPauseCb.apply(this, arguments);
                            break;
                        case 4:
                            typeof webonResumeHomeCb === 'function' && webonResumeHomeCb.apply(this, arguments);
                            break;
                    }

                }
            } else {
                connectWebViewJavascriptBridge(function(bridge) {
                    try {
                        if (!window.WebViewJavascriptBridge._messageHandler) {

                            bridge.init(function(message, responseCallback) {
                                console.log('JS got a message', message);
                                // var data = {
                                //  'Javascript Responds': '测试中文!'
                                // };
                                // console.log('JS responding with', data);
                                typeof initCb === 'function' && initCb.apply(this, arguments);
                                // responseCallback(data);
                                responseCallback();
                            });
                        }
                    } catch (e) {
                        console.error("jsbridge-----error--", e);
                    }

                    bridge.registerHandler("LoginToken", function(data, responseCallback) {
                        // var responseData = "Javascript Says Right back aka!";
                        // typeof loginTokenCb === 'function' && loginTokenCb.apply(this, arguments);
                        // responseCallback(responseData);
                        responseCallback();
                    });

                    bridge.registerHandler("WebonResume", function(data, responseCallback) {
                        // var responseData = "Javascript Says Right back aka!";
                        typeof readyCb === 'function' && readyCb.apply(this, arguments);
                        // responseCallback(responseData);
                        responseCallback();

                    });
                    bridge.registerHandler("WebonResumeHome", function(data, responseCallback) {
                        // var responseData = "Javascript Says Right back aka!";
                        typeof webonResumeHomeCb === 'function' && webonResumeHomeCb.apply(this, arguments);
                        // responseCallback(responseData);
                        responseCallback();
                    });

                    bridge.registerHandler("WebonPause", function(data, responseCallback) {
                        // var responseData = "Javascript Says Right back aka!";
                        typeof webonPauseCb === 'function' && webonPauseCb.apply(this, arguments);

                        // responseCallback(responseData);
                        responseCallback();
                    });
                    bridge.registerHandler("WebonDestroy", function(data, responseCallback) {
                        // var responseData = "Javascript Says Right back aka!";
                        typeof webonDestroyCb === 'function' && webonDestroyCb.apply(this, arguments);
                        // responseCallback(responseData);
                        responseCallback();
                    });
                });
            }

        }

    }
    var jsbridge = new Jsbridge();
    win.Jsbridge = jsbridge;
})(window);