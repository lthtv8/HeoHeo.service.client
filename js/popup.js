$(document).ready(function(){
	var url = {};
	url["login"] = "http://localhost/aidia/login";
	
	$(".PUP-1d").click(function() {
		let username = $("#PUP-1b_1").val();
		let password = $("#PUP-1b_2").val();//alert("-"+username+"-"+password+"-");
		
		if(username == "" && username.length ==0 ){
			loginUserMissing();
		}
		else if(password == "" && password.length ==0 ){
			loginPassMissing()
		}
		else {
			loginProcessing($(this));
			let data_post = {"username":username,"password":password};
			let input = $(this);
			$.post(url["login"],data_post, function(data){
				
				if(data.status == "1"){
					loginSuccess(input);
				}
				else{
					loginFail(input);
				}
			});
		}
	});
	
	function loginUserMissing(){
		$("#PUP-1c_1").text("*Chưa nhập tên tài khoản!").show();
	}
	
	function loginPassMissing(){
		$("#PUP-1c_2").text("*Chưa nhập mật khẩu!").show();
	}
	
	function loginFail(input){
		$("#PUP-1c_3").text("*Sai tài khoản hoặc mật khẩu!").show();
		
		input.css({"background":"none"});
		input.children("span").show();
		input.children("div").hide();
	}
	function loginProcessing(input){
		$("#PUP-1c_1").hide();
		$("#PUP-1c_2").hide();
		$("#PUP-1c_3").hide();
		input.css({"background":"#686868"});
		input.children("span").hide();
		input.children("div").show();
		
	}
	function loginSuccess(input){
		$("#PUP-1c_1").hide();
		$("#PUP-1c_2").hide();
		$("#PUP-1c_3").hide();
		input.css({"background":"none"});
		input.children("span").show();
		input.children("div").hide();
		
	}
});




