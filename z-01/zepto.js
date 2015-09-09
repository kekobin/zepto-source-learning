//基本结构及selector为零时
var Zepto = (function() {
	var $, zepto = {};

	$ = function(selector, context) {
		return zepto.init(selector, context);
	};

	$.fn = {
		test: function(value) {
			console.log(value);
		}
	}

	zepto.init = function(selector, context) {
		if(!selector) return zepto.Z();
	}

	//最后的返回形式全部交给zepto.Z来处理
	zepto.Z = function(dom, selector) {
		dom = dom || [];
		dom.__proto__ = $.fn;//通过给dom设置__proto__属性指向$.fn来达到继承$.fn上所有方法的目的
		dom.selector = selector;

		return dom;
	}

	return $;
});


window.$ = new Zepto;//返回的一定是Zepto的一个实例