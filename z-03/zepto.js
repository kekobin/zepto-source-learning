//selector为函数、自身的实例、array、对象、html代码片段、存在上下文时
var Zepto = (function() {
	var $, zepto = {}, emptyArray = [],
    slice = emptyArray.slice,
	idSelectorRE = /^#([\w-]*)$/,
	classSelectorRE = /^\.([\w-]+)$/,
	tagSelectorRE = /^[\w-]+$/;

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
		else if(isFunction(selector)) {

		} else {
			var dom;
			//....除开其它情况，则此时的selector为普通的CSS选择器，在document中查找selector
			if(isObject(selector)) {
			//这里的对象分为纯种对象和非纯种对象(document也是object)
				dom = (isPlainObject(selector))
			} else dom = zepto.qsa(document, selector);

			return zepto.Z(dom, selector);
		}
	}

	function isFunction(selector) {
		return typeof selector === "function";
	}

	function isObject(selector) {
		return typeof selector === "object";
	}

	zepto.qsa = function(element, selector) {
		var found;
		
		//当element为document且selector为id时
		return (isDocument(element) && idSelectorRE.test(selector)) ?
		((found = element.getElementById(RegExp.$1)) ? [found] : []):
		//当element不为元素节点并且不为document时，返回[]
		(element.nodeType !== 1 && element.nodeType != 9) ? [] : 
		//否则将获取到的结果转成数组并返回(使用Array.prototype.slice.call()方法,这里估计是getElementsByClassName、getElementsByTagName、querySelectorAll
		//返回的不是严格意义上的数组，而是DOM层的collection,所以需要转话成严格意义的数组)
		slice.call(
		classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) : 
		//如果selector是标签名,直接调用getElementsByTagName
		tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) : 
		element.querySelectorAll(selector))
	}

	//判断是否为document(通过doucment的nodeType为DOCUMENT_NODE判断)
	function isDocument(obj) {
		return obj && obj.nodeType === obj.DOCUMENT_NODE;//也可以为obj.nodeType === 9
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
