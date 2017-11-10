function supportCtrl($scope,$ionicModal){
	//支持的银行卡图标
	$("#support-view span img").attr("src",imgRrc+"h5images/icon_bank_hsb"+variable+".png");
	//判断支持的银行
	$(".couponsTab span").off("click").on("click",function(){
		var item=$(this).index();
		$(this).siblings("p").css("left",1.8*item+"rem");
		$("#support-view ul").html("");
		$scope.initSupport();
	});
	//初始化支持的银行
	$scope.initSupport=function(){
		$.ajax({
			url :getRootPath()+"/ThridPayAccountAction.cjtGetPaychannelFromLocal.do?FAPView=JSON",
			type: 'post',
			success : function(data) {
				var data=$.parseJSON(data);
				console.log(data);
				if(data.FAPStatus==0){
					var arr=[];
					var brr=[];
					if(data.success==true){
						for (var i = 0; i <data.data.payList.length; i++) {
							if(data.data.payList[i].cardType=="DC"){
								arr.push(data.data.payList[i]);
							}else{
								brr.push(data.data.payList[i]);
							}
						}
						if($(".couponsTab p").css("left")=="0px"){//储蓄卡
							//console.log(arr)
							for(var j=0;j<arr.length;j++){
								var img="";
								var BANKNAME=arr[j].instName;
								img=bankCard(BANKNAME,img);
								$("#support-view ul").append('<li data-type="2">'
										+'<span><img src="'+img+'"></span>'
										+'<p><label>'+arr[j].instName+'</label><i>单笔'+arr[j].cardAttribute+' 单日'+arr[j].ext+'</i></p>'
								+'</li>');
							}
						}else{//信用卡
							//console.log(brr)
							for(var n=0;n<brr.length;n++){
								var img="";
								var BANKNAME=brr[n].instName;
								img=bankCard(BANKNAME,img);
								$("#support-view ul").append('<li data-type="2">'
										+'<span><img src="'+img+'"></span>'
										+'<p><label>'+brr[n].instName+'</label><i>单笔'+brr[n].cardAttribute+' 单日'+brr[n].ext+'</i></p>'
								+'</li>');
							}
						}
					}else{
						//alert(data.errors.msg);
						$scope.msg = data.errors.msg;
						$scope.openModalThree();
						setTimeout(function(){
							$scope.closeModalThree();
						},1000*3);
					}
				}else if(data.FAPStatus==2){
					loginH5Host();//从新调登录接口
				}else{
					//alert(data.FAPErrorMessage);
					$scope.msg = data.FAPErrorMessage;
					$scope.openModalThree();
					setTimeout(function(){
						$scope.closeModalThree();
					},1000*3);
				}
			},
			error:function(a,b,c){
				alert("错误");
			}					
		});
	};
	$scope.initSupport();

	//弹框
	$ionicModal.fromTemplateUrl('templates/modalThree.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modalThree = modal;
	});
	$scope.openModalThree = function() {
		$scope.modalThree.show();
	};
	$scope.closeModalThree = function() {
		$scope.modalThree.hide();
	};
};
angular.module("myapp")
		.controller("supportCtrl",['$scope','$ionicModal',supportCtrl]);