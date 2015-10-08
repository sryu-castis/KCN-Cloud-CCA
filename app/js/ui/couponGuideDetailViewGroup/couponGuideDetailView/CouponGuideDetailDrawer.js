define(["framework/Drawer", "ui/couponGuideDetailViewGroup/couponGuideDetailView/CouponGuideDetailModel"], function (Drawer, CouponGuideDetailModel) {
    var CouponGuideDetailDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/couponGuideDetailViewGroup/couponGuideDetailView/LayoutTemplate.ejs'}), 
        		'discount': new EJS({url: 'js/ui/couponGuideDetailViewGroup/couponGuideDetailView/CouponTemplate.ejs'}),
        		'monthly': new EJS({url: 'js/ui/couponGuideDetailViewGroup/couponGuideDetailView/MonthlyCouponTemplate.ejs'}),
        		'use': new EJS({url: 'js/ui/couponGuideDetailViewGroup/couponGuideDetailView/UseTemplate.ejs'}),
        		'register2': new EJS({url: 'js/ui/couponGuideDetailViewGroup/couponGuideDetailView/Use2ndTemplate.ejs'}),
        		'register1': new EJS({url: 'js/ui/couponGuideDetailViewGroup/couponGuideDetailView/RegistrationTemplate.ejs'}),
        		'tax': new EJS({url: 'js/ui/couponGuideDetailViewGroup/couponGuideDetailView/TaxTemplate.ejs'}),
        		'refund': new EJS({url: 'js/ui/couponGuideDetailViewGroup/couponGuideDetailView/RefundTemplate.ejs'})
        		};
        
        var _this = this;
        var marqueeText = null;
        CouponGuideDetailDrawer.prototype.onCreateLayout = function () {
        	var result = _this.templateList['layout'].render({model: this.model});
			this.getContainer().html(result);

        };

        CouponGuideDetailDrawer.prototype.onPaint = function () {
            var result = null;
            switch(this.model.data)	{
            case 0: // 쿠폰 할인권이란
            	result = _this.templateList['discount'].render({model: this.model});
            	break;
            case 1:	// vod 쿠폰 요금제 안내
            	result = _this.templateList['monthly'].render({model: this.model});
            	break;
            case 2:	// 쿠폰 이용 안내
            	result = _this.templateList['use'].render({model: this.model});
            	break;
            case 6:	// 쿠폰 등록 안내 - 2
            	result = _this.templateList['register2'].render({model: this.model});
            	break;
            case 3:	// 쿠폰 등록 안내
            	result = _this.templateList['register1'].render({model: this.model});
            	break;
            case 4:	// 부가가치세 안내
            	result = _this.templateList['tax'].render({model: this.model});
            	break;
            case 5:	// 환불 정책 안내
            	result = _this.templateList['refund'].render({model: this.model});
            	break;
        	default:
        		break;
            }
			setTimeout(function(){$("#detail_guide .subViewArea").html(result);},10);
        };
        CouponGuideDetailDrawer.prototype.onAfterPaint = function () {
        };
//        CouponGuideDetailDrawer.prototype.onDestroy = function ()	{
//        	$("#couponGuideDetailView").hide();
//        }

    };
    CouponGuideDetailDrawer.prototype = Object.create(Drawer.prototype);


    return CouponGuideDetailDrawer;
});
