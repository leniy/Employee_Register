<?php
/*
	Plugin Name:Employee Register后台
	Plugin URI: http://leniy.org
	Version: 0.0.1
	Author: Leniy
	Author URI: http://leniy.org/
*/

//检查帐号是否已经存在
function CheckIfExist($json_data, $pdo){
	$checkphone = $pdo->prepare("SELECT * FROM tb_employee WHERE tb_employee.phone LIKE :phone LIMIT 1");
	$checkphone->bindParam(':phone', $json_data['phone'], PDO::PARAM_STR);
	$checkphone->execute();
	$checkphoneresult = $checkphone->fetch();
	if($checkphoneresult){ //有结果
		return array(
			"status"  => "success",
			"message" => $checkphoneresult
			);
	} else {
		return array(
			"status"  => "error",
			"message" => "帐号不存在"
			);
	}
}

//创建员工条目
function AddEmployee($json_data, $pdo){
	if( "success" == CheckIfExist($json_data, $pdo)["status"]) {
		return array(
			"status"  => "error",
			"message" => "帐号已经存在，请勿重新创建，点击“查询”按钮获取帐号信息"
			);
	} else {
		$nowbiggestid = GetBiggestIDinSQL($pdo);
		$IDtoAdd = NumAdd($nowbiggestid);
		$ip = GetIP();
		$hash = md5($ip);
		$addemployee = $pdo->prepare("INSERT INTO tb_employee (id, name, phone, city, country, regsourceip, hash) VALUES (:id, :name, :phone, :city, :country, :regsourceip, :hash)");
		$addemployee->bindParam(':id',      $IDtoAdd,              PDO::PARAM_STR);
		$addemployee->bindParam(':name',    $json_data['name'],    PDO::PARAM_STR);
		$addemployee->bindParam(':phone',   $json_data['phone'],   PDO::PARAM_STR);
		$addemployee->bindParam(':city',    $json_data['city'],    PDO::PARAM_STR);
		$addemployee->bindParam(':country', $json_data['country'], PDO::PARAM_STR);
		$addemployee->bindParam(':regsourceip', $ip,               PDO::PARAM_STR);
		$addemployee->bindParam(':hash',    $hash,                 PDO::PARAM_STR);
		$addemployee->execute();
		return array(
			"status"  => "success",
			"message" => "注册成功，您的id是：" . $IDtoAdd . "（五位数），点击“查询”按钮获取帐号信息"
			);
	}
}

//获取终端IP
function GetIP(){
	if(!empty($_SERVER["HTTP_CLIENT_IP"]))
		$cip = $_SERVER["HTTP_CLIENT_IP"];
	else if(!empty($_SERVER["HTTP_X_FORWARDED_FOR"]))
		$cip = $_SERVER["HTTP_X_FORWARDED_FOR"];
	else if(!empty($_SERVER["REMOTE_ADDR"]))
		$cip = $_SERVER["REMOTE_ADDR"];
	else
		$cip = "0.0.0.0";
	return $cip;
}

//获取当前员工数据库中已有最大的id号
function GetBiggestIDinSQL($pdo){
	$getbiggestid = $pdo->prepare("SELECT id FROM tb_employee ORDER BY id DESC LIMIT 1");
	$getbiggestid->execute();
	$getbiggestidresult = $getbiggestid->fetch();
	return (int)$getbiggestidresult["id"];
}

//数字自增跳过4
function NumAdd($number){
	//由于id不能用自增，需要跳过所有4，则手动创建id
	$number = $number + 1;
	while(preg_match("/4/", (string)$number, $matches)){
		$number = $number + 1;
	}
	return $number;
}
