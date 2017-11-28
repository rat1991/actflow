'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (win) {

    function isIOS() {
        return navigator.userAgent.match(/(iPad|iPhone)/);
    }

    function connectWebViewJavascriptBridge(callback) {

        if (window.WebViewJavascriptBridge) {
            typeof callback === 'function' && callback.call(this, WebViewJavascriptBridge);
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function () {
                typeof callback === 'function' && callback.call(this, WebViewJavascriptBridge);
            }, false);
        }
    }

    function iosHandler(method, param, callback) {
        typeof method === 'function' && method.apply(this, [param, function (respones) {
            (typeof callback === 'undefined' ? 'undefined' : _typeof(callback)) && callback.call(this, respones);
        }]);
    }

    function androidHandler(method, param, callback) {

        win.WebViewJavascriptBridge.callHandler(method, param, function (responseData) {
            typeof callback === 'function' && callback.apply(this, arguments);
        });
    }

    function compareVersion(v1, v2, equal) {
        var arr = v1 && v1.split(".");
        var list = v2 && v2.split(".");
        if (!arr || !list) return;

        var i = 0;
        var arrlength = arr.length;
        var listlength = list.length;
        var length = arrlength > listlength ? arrlength : listlength;
        var isEqual = false;
        var item1 = "";
        var item2 = "";
        for (; i < length; i++) {
            item1 = Number(arr[i]);
            item2 = Number(list[i]);

            item1 = isNaN(item1) ? 0 : item1;
            item2 = isNaN(item2) ? 0 : item2;
            if (i == length - 1) isEqual = item1 === item2 && equal;

            if (item1 > item2 || isEqual) {
                return true;
            } else if (item1 < item2) {
                return false;
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

                    iosHandler(method, params ? params : null, callback);
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

    var Jsbridge = function Jsbridge() {};
    Jsbridge.prototype = {
        closeWeb: function closeWeb() {
            var method = isIOS() ? CloseWeb : 'CloseWeb';
            caller(method, null);
        },

        toAppLogin: function toAppLogin() {
            var method = isIOS() ? ToAppLogin : 'ToAppLogin';
            caller(method, null);
        },

        toAppRegister: function toAppRegister() {
            var method = isIOS() ? ToAppRegister : 'ToAppRegister';
            caller(method, null);
        },

        toAppMainPage: function toAppMainPage() {
            var method = isIOS() ? ToAppHomePage : 'ToAppHomePage';
            caller(method, null);
        },

        toAppInvestList: function toAppInvestList() {
            var method = isIOS() ? ToAppScatteredList : 'ToAppScatteredList';
            caller(method, null);
        },


        toAppInvestDetails: function toAppInvestDetails(id, typeId, subTypeId, profitTypeId, xmbSubType) {
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

        toAppLoan: function toAppLoan() {
            var method = isIOS() ? ToAppApplyForAssets : 'ToAppApplyForAssets';
            caller(method, null);
        },

        toAppMyInvest: function toAppMyInvest() {
            var method = isIOS() ? ToAppMyInvestment : 'ToAppMyInvestment';
            caller(method, null);
        },

        toAppMyInvestDetail: function toAppMyInvestDetail(projectId, type, investId, profitTypeId, isWePlanX, subTypeId, weXPlanType, title) {
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
            var method = isIOS() ? ToAppMyInvestmentDetails : 'ToAppMyInvestmentDetails';
            caller(method, investParam);
        },

        toAppTBX: function toAppTBX() {
            var method = isIOS() ? ToAppTreasureChest : 'ToAppTreasureChest';
            caller(method, null);
        },

        toAppCashRedPacket: function toAppCashRedPacket() {
            var method = isIOS() ? ToAppCashBonus : 'ToAppCashBonus';
            caller(method, null);
        },

        toAppOrdinaryRedPacket: function toAppOrdinaryRedPacket() {
            var method = isIOS() ? ToAppInvestBonus : 'ToAppInvestBonus';
            caller(method, null);
        },

        toAppKasiRedPacket: function toAppKasiRedPacket() {
            var method = isIOS() ? ToAppRateIncreaseBonus : 'ToAppRateIncreaseBonus';
            caller(method, null);
        },

        toAppWithdrawalRoll: function toAppWithdrawalRoll() {
            var method = isIOS() ? ToAppReflectBonus : 'ToAppReflectBonus';
            caller(method, null);
        },

        toAppSingInRoll: function toAppSingInRoll() {
            var method = isIOS() ? ToAppSignInCard : 'ToAppSignInCard';
            caller(method, null);
        },

        toAppPresent: function toAppPresent() {
            var method = isIOS() ? ToAppExquisiteGift : 'ToAppExquisiteGift';
            caller(method, null);
        },

        toAppRecharge: function toAppRecharge() {
            var method = isIOS() ? ToAppTopUp : 'ToAppTopUp';
            caller(method, null);
        },

        toAppPersonalCenter: function toAppPersonalCenter() {
            var method = isIOS() ? ToAppMy : 'ToAppMy';
            caller(method, null);
        },

        toAppInviteFriend: function toAppInviteFriend() {
            var method = isIOS() ? ToAppInvitedShare : 'ToAppInvitedShare';
            caller(method, null);
        },

        toAppActivity: function toAppActivity(shareType) {
            if (shareType == 2 || shareType == 3) {
                console.error('toAppActivity参数错误！');
                return;
            }
            var param = {
                FunctionType: shareType
            };
            var method = isIOS() ? ToAppActivity : 'ToAppActivity';
            caller(method, param);
        },

        toAppWePlan: function toAppWePlan() {
            var method = isIOS() ? ToAppWePlanList : 'ToAppWePlanList';
            caller(method, null);
        },

        toAppWePlanDetail: function toAppWePlanDetail(productId, typeId, subTypeId, weXPlanType, title) {
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

        toAppFind: function toAppFind() {
            var method = isIOS() ? ToAppFind : 'ToAppFind';
            caller(method, null);
        },

        toAppBeginnersArea: function toAppBeginnersArea() {
            var method = isIOS() ? ToAppBeginnersArea : 'ToAppBeginnersArea';
            caller(method, null);
        },

        toAppPublicNoticeList: function toAppPublicNoticeList() {
            var method = isIOS() ? ToAppPublicNoticeList : 'ToAppPublicNoticeList';
            caller(method, null);
        },

        toAppPublicNoticeDetails: function toAppPublicNoticeDetails(id, url, title) {
            var reqParam = {
                'id': id,
                'url': url,
                'title': title
            };
            var method = isIOS() ? ToAppPublicNoticeDetails : 'ToAppPublicNoticeDetails';
            caller(method, reqParam);
        },

        toAppSystemMessagesList: function toAppSystemMessagesList() {
            var method = isIOS() ? ToAppSystemMessagesList : 'ToAppSystemMessagesList';
            caller(method, null);
        },

        toAppSystemMessagesDetails: function toAppSystemMessagesDetails(id, url, title) {
            var reqParam = {
                'id': id,
                'url': url,
                'title': title
            };
            var method = isIOS() ? ToAppSystemMessagesDetails : 'ToAppSystemMessagesDetails';
            caller(method, reqParam);
        },

        toAppIWantBorrow: function toAppIWantBorrow() {
            var method = isIOS() ? ToAppIWantBorrow : 'ToAppIWantBorrow';
            caller(method, null);
        },

        toAppFeedBack: function toAppFeedBack() {
            var method = isIOS() ? ToAppFeedBack : 'ToAppFeedBack';
            caller(method, null);
        },

        toAppTuandaiBBS: function toAppTuandaiBBS(title, url) {
            var reqParam = {
                'title': title,
                'url': url
            };
            var method = isIOS() ? ToAppTuandaiBBS : 'ToAppTuandaiBBS';
            caller(method, reqParam);
        },

        toAppAutoBid: function toAppAutoBid() {
            var method = isIOS() ? ToAppAutoBid : 'ToAppAutoBid';
            caller(method, null);
        },

        toAppMyBorrowing: function toAppMyBorrowing() {
            var method = isIOS() ? ToAppMyBorrowing : 'ToAppMyBorrowing';
            caller(method, null);
        },

        toAppMyBorrowingDetails: function toAppMyBorrowingDetails(projectId, type, investId, profitTypeId, isWePlanX, subTypeId) {
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

        toAppDebtCollectionCalendar: function toAppDebtCollectionCalendar() {
            var method = isIOS() ? ToAppDebtCollectionCalendar : 'ToAppDebtCollectionCalendar';
            caller(method, null);
        },

        appPlayMusic: function appPlayMusic(musicUrl) {
            var param = {
                'url': musicUrl
            };
            var method = isIOS() ? ToAppIosPlayMusic : 'WebViewOnPlayMusic';
            caller(method, param);
        },
        appStopMusic: function appStopMusic() {
            var method = isIOS() ? ToAppIosStopMusic : 'WebViewOnPauseMusic';
            caller(method, null);
        },

        setTitleComponent: function (_setTitleComponent) {
            function setTitleComponent(_x) {
                return _setTitleComponent.apply(this, arguments);
            }

            setTitleComponent.toString = function () {
                return _setTitleComponent.toString();
            };

            return setTitleComponent;
        }(function (params) {
            var method = isIOS() ? setTitleComponent : 'setTitleComponent';

            caller(method, params, null, true);
            if (params.rightBtnCb) {
                this.registeEvent('RightButtonClick', params.rightBtnCb);
            }
        }),

        toAppBondsTransferList: function toAppBondsTransferList() {
            var method = isIOS() ? ToAppBondsTransferList : 'ToAppBondsTransferList';
            caller(method, null);
        },

        toAppFinancialPlanListFi: function toAppFinancialPlanListFi() {
            var method = isIOS() ? ToAppFinancialPlanList_fi : 'ToAppFinancialPlanList_fi';
            caller(method, null);
        },

        toAppRegularProjectListFi: function toAppRegularProjectListFi() {
            var method = isIOS() ? ToAppRegularProjectList_fi : 'ToAppRegularProjectList_fi';
            caller(method, null);
        },

        toAppBondsTransferDetails: function toAppBondsTransferDetails(Id, TypeId) {
            var param = {
                'Id': Id,
                'TypeId': TypeId
            };
            var method = isIOS() ? ToAppBondsTransferDetails : 'ToAppBondsTransferDetails';
            caller(method, param);
        },


        toAppFinancialPlanDetailsFi: function toAppFinancialPlanDetailsFi(id, typeId, subTypeId) {
            var param = {
                "Id": id,
                "TypeId": typeId,
                "SubTypeId": subTypeId
            };
            var method = isIOS() ? ToAppFinancialPlanDetails_fi : 'ToAppFinancialPlanDetails_fi';
            caller(method, param);
        },

        toAppRegularProjectDetailsFi: function toAppRegularProjectDetailsFi(id, typeId, subTypeId, profitTypeId, xmbSubType) {
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

        toAppSignIn: function toAppSignIn() {
            var method = isIOS() ? ToAppSignIn : 'ToAppSignIn';
            caller(method, null);
        },

        toAppMyInvestWePlanList: function toAppMyInvestWePlanList() {
            var method = isIOS() ? ToAppMyInvestWePlanList : 'ToAppMyInvestWePlanList';
            caller(method, null);
        },

        toAppMyInvestWePlanDetails: function toAppMyInvestWePlanDetails(projectId, type, investId, profitTypeId, isWePlanX, subTypeId, weXPlanType, title) {
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

        toAppMyInvestFinancialPlanListFi: function toAppMyInvestFinancialPlanListFi() {

            var method = isIOS() ? ToAppMyInvestFinancialPlanList_fi : 'ToAppMyInvestFinancialPlanList_fi';
            caller(method, null);
        },

        toAppMyInvestRegularProjectListFi: function toAppMyInvestRegularProjectListFi() {
            var method = isIOS() ? ToAppMyInvestRegularProjectList_fi : 'ToAppMyInvestRegularProjectList_fi';
            caller(method, null);
        },

        toAppTopUpFi: function toAppTopUpFi() {
            var method = isIOS() ? ToAppTopUp_fi : 'ToAppTopUp_fi';
            caller(method, null);
        },

        toAppDebtCollectionCalendarFi: function toAppDebtCollectionCalendarFi() {
            var method = isIOS() ? ToAppDebtCollectionCalendar_fi : 'ToAppDebtCollectionCalendar_fi';
            caller(method, null);
        },

        toAppMyInvestFinancialPlanDetailsFi: function toAppMyInvestFinancialPlanDetailsFi(projectId, type, investId, profitTypeId, isWePlanX, subTypeId, weXPlanType, title) {
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

        toAppMyInvestRegularProjectListDetailsFi: function toAppMyInvestRegularProjectListDetailsFi(projectId, type, investId, profitTypeId, isWePlanX, subTypeId, weXPlanType, title) {
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

        toAppSecuritiesTrading: function toAppSecuritiesTrading() {
            var method = isIOS() ? ToAppSecuritiesTrading : 'ToAppSecuritiesTrading';
            caller(method, null);
        },

        toAppBankOpenDepositoryAlert: function toAppBankOpenDepositoryAlert() {
            var method = isIOS() ? ToAppBankOpenDepositoryAlert : 'ToAppBankOpenDepositoryAlert';
            caller(method, null);
        },

        toAppBondsTransferListFi: function toAppBondsTransferListFi() {
            var method = isIOS() ? ToAppBondsTransferList_fi : 'ToAppBondsTransferList_fi';
            caller(method, null);
        },

        toAppBondsTransferDetailsFi: function toAppBondsTransferDetailsFi(productId, typeId, subTypeId, weXPlanType, title) {
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

        toAPPMenberCenter: function toAPPMenberCenter() {
            var method = isIOS() ? ToAPPMenberCenter : 'ToAPPMenberCenter';
            caller(method, null);
        },

        toAppNoviceExperienceGold: function toAppNoviceExperienceGold() {
            var method = isIOS() ? ToAppNoviceExperienceGold : 'ToAppNoviceExperienceGold';
            caller(method, null);
        },

        toAppPersonalData: function toAppPersonalData() {
            var method = isIOS() ? ToAppPersonalData : 'ToAppPersonalData';
            caller(method, null);
        },

        toAppDetails: function toAppDetails() {
            var method = isIOS() ? ToAppDetails : 'ToAppDetails';
            caller(method, null);
        },

        toAppUpdateAPK: function toAppUpdateAPK() {
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

        toAppP2p: function toAppP2p() {
            var method = isIOS() ? ToAppP2p : 'ToAppP2p';
            caller(method, null);
        },

        toAppRegularFi: function toAppRegularFi() {
            var method = isIOS() ? ToAppRegular_fi : 'ToAppRegular_fi';
            caller(method, null);
        },

        toAppCallService: function toAppCallService() {
            var method = isIOS() ? ToAppIosCallService : 'ToAppCallService';
            caller(method, null);
        },

        toAppOnlineService: function toAppOnlineService() {
            var method = isIOS() ? ToAppIosOnlineService : 'ToAppOnlineService';
            caller(method, null);
        },

        toAppPrivatePlacement: function toAppPrivatePlacement() {
            var method = isIOS() ? ToAppPrivatePlacement : 'ToAppPrivatePlacement';
            caller(method, null);
        },

        toAppPrivatePlacementDetails: function toAppPrivatePlacementDetails(mFundId, qiiStatus) {
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

        toAppViedoWebView: function toAppViedoWebView(screentype, videoUrl) {
            var params = {
                'screentype': screentype,
                'videoUrl': videoUrl
            };
            var method = isIOS() ? ToAppViedoWebView : 'ToAppViedoWebView';
            caller(method, params);
        },

        toAppWebViewShare: function toAppWebViewShare(params, callback) {
            var method = isIOS() ? ToAppWebViewShare : 'ToAppWebViewShare';
            caller(method, params, callback, true);
            typeof callback === 'function' && this.registeEvent('RightButtonClick', callback);
        },

        exec: function exec(methodName, params, callback) {

            var method = isIOS() ? window[methodName] : methodName;
            caller(method, params, callback);
        },
        isNewVersion: function isNewVersion() {
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
        isApp: function isApp() {
            var useragent = navigator.userAgent;
            return useragent.indexOf("tuandaiapp_android") != -1 || useragent.indexOf("tuandaiapp_IOS") != -1;
        },

        isCorrectVersion: function isCorrectVersion(v, equal) {
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
        checkVersion: function checkVersion(v) {
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

        registeEvent: function registeEvent(method, callback) {
            if (isIOS()) {
                window[method] = function (data) {
                    typeof callback === 'function' && callback.apply(this, arguments);
                };
            } else {
                connectWebViewJavascriptBridge(function (bridge) {
                    try {
                        if (!window.WebViewJavascriptBridge._messageHandler) {
                            bridge.init(function (message, responseCallback) {
                                responseCallback(data);
                            });
                        }
                    } catch (e) {
                        console.error("jsbridge-----error--", e);
                    }

                    bridge.registerHandler(method, function (data, responseCallback) {
                        var responseData = "Javascript Says Right back aka!";
                        responseCallback(responseData);
                        typeof callback === 'function' && callback.apply(this, arguments);
                    });
                });
            }
        },

        rightButtonClick: function rightButtonClick(callback) {
            this.registeEvent('RightButtonClick', callback);
        },

        shareActivitySuccessed: function shareActivitySuccessed(callback) {
            this.registeEvent('shareActivitySuccessed', callback);
        },

        appLifeHook: function appLifeHook(initCb, readyCb, webonPauseCb, webonDestroyCb, webonResumeHomeCb) {
            if (isIOS()) {
                win.ToAppLifeCycle = function (step) {
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
                };
            } else {
                connectWebViewJavascriptBridge(function (bridge) {
                    try {
                        if (!window.WebViewJavascriptBridge._messageHandler) {

                            bridge.init(function (message, responseCallback) {
                                console.log('JS got a message', message);

                                typeof initCb === 'function' && initCb.apply(this, arguments);

                                responseCallback();
                            });
                        }
                    } catch (e) {
                        console.error("jsbridge-----error--", e);
                    }

                    bridge.registerHandler("LoginToken", function (data, responseCallback) {
                        responseCallback();
                    });

                    bridge.registerHandler("WebonResume", function (data, responseCallback) {
                        typeof readyCb === 'function' && readyCb.apply(this, arguments);

                        responseCallback();
                    });
                    bridge.registerHandler("WebonResumeHome", function (data, responseCallback) {
                        typeof webonResumeHomeCb === 'function' && webonResumeHomeCb.apply(this, arguments);

                        responseCallback();
                    });

                    bridge.registerHandler("WebonPause", function (data, responseCallback) {
                        typeof webonPauseCb === 'function' && webonPauseCb.apply(this, arguments);

                        responseCallback();
                    });
                    bridge.registerHandler("WebonDestroy", function (data, responseCallback) {
                        typeof webonDestroyCb === 'function' && webonDestroyCb.apply(this, arguments);

                        responseCallback();
                    });
                });
            }
        }

    };
    var jsbridge = new Jsbridge();
    win.Jsbridge = jsbridge;
})(window);