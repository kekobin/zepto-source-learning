//selector为函数、自身的实例、array、对象、html代码片段、存在上下文时
var Zepto = (function() {
	var $, zepto = {}, emptyArray = [],
    slice = emptyArray.slice,
	idSelectorRE = /^#([\w-]*)$/,
	classSelectorRE = /^\.([\w-]+)$/,
	tagSelectorRE = /^[\w-]+$/,
	class2Type = {}, 
	toString = class2Type.toString,
	readyRE = /complete|loaded|interactive/,
	fragmentRE = /^\s*<(\w+|!)[^>]*>/;

	$ = function(selector, context) {
		return zepto.init(selector, context);
	};

	$.fn = {
		test: function(value) {
			console.log(value);
		},
		each: function(array, callback) {
			for(var i=0,len=array.length;i<len;i++) {
				callback(i, array[i]);
			}
		},
		ready: function(callback) {
			if(readyRE.test(document.readyState)) callback($);
			else 
				document.addEventListener("DOMContentLoaded", function() {
					callback($);
				}, false);
		}
	}

	$.extend = function(target) {//这里只传了一个参数target过来，target可能是boolean，可能是{}等对象
		//arguments直接截取掉target，并将结果以数组形式返回给args。
		var deep, args = slice.call(arguments, 1);

		if(typeof target == "boolean") {
			deep = target;
			target = args.shift();
		}

		args.forEach(function(arg) {
			extend(target, arg, deep);
		});

		return target;
	}

	function extend(target, source, deep) {
		for(var key in source) {
			if(deep && isPlainObject(source[key]) || isArray(source[key])) {
				if(isPlainObject(source[key]) && !isPlainObject(target[key])) target[key] = {};
				if(isArray(source[key]) && !isArray(target[key])) target[key] = [];

				extend(target[key], source[key], deep);
			} else if(source[key] != undefined) target[key] = source[key];
		}
	}

	// $.each("Boolean Number Array Object Date String Error Function RegExp".split(" "), function(i, item) {

	// });

	zepto.init = function(selector, context) {
		if(!selector) return zepto.Z();
		else if(isFunction(selector)) {
			$(document).ready(selector);
		} else if(zepto.isZ(selector)) {
			return selector;
		} else {
			var dom;
			//....除开其它情况，则此时的selector为普通的CSS选择器，在document中查找selector
			if(isObject(selector)) {
			//这里的对象分为纯种对象和非纯种对象(document也是object)
				dom = [isPlainObject(selector) ? $.extend({}, selector) : selector];
				//下面的先放着
			// } else if(fragmentRE.test(selector)) dom =  zepto.fragment(selector.trim(), RegExp.$1, context), selector = null;
			// } else if(context) return $(context).find(selector); 
			} else dom = zepto.qsa(document, selector);

			return zepto.Z(dom, selector);
		}
	}

	// zepto.fragment = function(html, name, properties) {
	// 	console.log(RegExp.$1)
	// 	console.log(RegExp.$2)
	// }

	//最后的返回形式全部交给zepto.Z来处理
	zepto.Z = function(dom, selector) {
		dom = dom || [];
		dom.__proto__ = $.fn;//通过给dom设置__proto__属性指向$.fn来达到继承$.fn上所有方法的目的
		dom.selector = selector;

		return dom;
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

	zepto.isZ = function(selector) {
		return selector instanceof zepto.Z;
	}

	function isFunction(selector) {
		return typeof (selector) === "function";
	}

	function isObject(selector) {
		return typeof selector === "object";
	}

	function isWindow(obj) {
		return obj != null && obj.window == obj;
	}

	function isPlainObject(obj) {
	    return isObject(obj) && !isWindow(obj) && obj.__proto__ == Object.prototype;
	}

	function isArray(obj) {
		return obj instanceof Array;
	}

	//判断是否为document(通过doucment的nodeType为DOCUMENT_NODE判断)
	function isDocument(obj) {
		return obj && obj.nodeType === obj.DOCUMENT_NODE;//也可以为obj.nodeType === 9
	}

	return $;
});


window.$ = new Zepto;//返回的一定是Zepto的一个实例
