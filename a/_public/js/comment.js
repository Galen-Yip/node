$(function() {
	$(".comment").click(function(e){
		var target = $(this);
		var cId = target.data('cid');
		var tId = target.data('tid');

		if($('#toId').length > 0){
			$('#toId').val(tId)
		}else{
			$('<input>').attr({
				type: 'hidden',
				id: 'toId',
				name: 'comment[tid]',       //在路由里面定义了
				value: tId
			}).appendTo('#commentForm');
		}

		

		if($('#commentId').length > 0){
			$('#commentId').val(tId)
		}else{
			$('<input>').attr({
				type: 'hidden',
				id: 'commentId',
				name: 'comment[cid]',       //在路由里面定义了
				value: cId
			}).appendTo('#commentForm');
		}

		
	})
})