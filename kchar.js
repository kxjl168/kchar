/**
 * from :http://256kb.cn
 * MIT Lincese
 * js create from JDK Character.class  codePointAt Function
 * http://www.unicode.org/glossary/
 * 
 * 
 * use: 	var withemojihtml= $kchar. replaceEmoji(inuptHtmlData);
 */

;(function(window){
	
	
	function KChar(options){
		
		this.default={
				    MIN_SUPPLEMENTARY_CODE_POINT : 0x010000,
				     MIN_HIGH_SURROGATE : '\uD800'.charCodeAt(0),
				     MIN_LOW_SURROGATE  : '\uDC00'.charCodeAt(0),
				     MAX_HIGH_SURROGATE : '\uDBFF'.charCodeAt(0),
				     MAX_LOW_SURROGATE  : '\uDFFF'.charCodeAt(0),
				     MIN_CODE_POINT : 0x000000,
				     MAX_CODE_POINT:0X10FFFF,
		};
	
		
	} ;
	
	KChar.prototype.isHighSurrogate=function(ch){
		var me=this;
		 return ch >= me.default.MIN_HIGH_SURROGATE && ch < (me.default.MAX_HIGH_SURROGATE + 1);
	}
	
	KChar.prototype. isLowSurrogate=function( ch) {
		var me=this;
	        return ch >= me.default.MIN_LOW_SURROGATE && ch < (me.default.MAX_LOW_SURROGATE + 1);
	    }

	KChar.prototype.codePointAt=function(seq,index) {
		var me=this;
	        var c1 = seq.charCodeAt(index);
	        if (me.isHighSurrogate(c1) && ++index < seq.length) {
	            var c2 = seq.charCodeAt(index);
	            if (me.isLowSurrogate(c2)) {
	                return me.toCodePoint(c1, c2);
	            }
	        }
	        return c1;
	    }
	
	KChar.prototype.toCodePoint=function(high,low) {
		var me=this;

		 var codept= ((high << 10) + low) + ( me.default.MIN_SUPPLEMENTARY_CODE_POINT
	             - ( me.default.MIN_HIGH_SURROGATE << 10)
	             -  me.default.MIN_LOW_SURROGATE);
	        return codept;
	    }
	
	
	//替换输入的emoji wei &#x??; html实体
	KChar.prototype.replaceEmoji=function(message)
	{
		var me=this;
		
		    var emojiRegexp = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c\ude32-\ude3a]|[\ud83c\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
		    if(!message)
		        return;
		    try{ 
		        var newMessage = message.match(emojiRegexp);
		        for(var emoj in newMessage){
		              var emojmessage = newMessage[emoj];
		              var index = message.indexOf(emojmessage);
		              if(index === -1)
		                  continue;
		              // $#x  --》 \u0024 \u0023 \u0078    %24%23x 
		              emojmessage = "[["+me.codePointAt( emojmessage)+";";
		              message = message.substr(0, index) + emojmessage + message.substr(index + 2);
		            }
		        return message;
		    }catch(err){
		        console.error("error in emojiToUnicode"+err.stack);
		    }
		 
	}
	//兼容angular js 不替换 emoji表情
	KChar.prototype.angularSce=function(message,$sce)
	{
		var me=this;
		
		    var emojiRegexp = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c\ude32-\ude3a]|[\ud83c\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
		    if(!message)
		        return;
		    try{ 
		        var newMessage = message.match(emojiRegexp);
		        for(var emoj in newMessage){
		              var emojmessage = newMessage[emoj];
		              var index = message.indexOf(emojmessage);
		              if(index === -1)
		                  continue;
		              // $#x  --》 \u0024 \u0023 \u0078    %24%23x 
		              emojmessage = "&#x"+me.codePointAt( emojmessage)+";";
		              message = $sce.trustAsHtml(message.substr(0, index)) + emojmessage + $sce.trustAsHtml(message.substr(index + 2));
		            }
		        return message;
		    }catch(err){
		        console.error("error in emojiToUnicode"+err.stack);
		    }
		 
	}
	
	
	
	
	
	var kchar=new KChar();
	window.$kchar={};
	// 返回emoji表情的 unicoe 数字
	window.$kchar.codePointAt=function(str){
		
		return kchar.codePointAt(str,0).toString(16);
		
	};
	window.$kchar.replaceEmoji=kchar.replaceEmoji;
	window.$kchar.angularSce=kchar.angularSce;
	
	
})(window);


