<?php
/*
	Plugin Name:Employee Register后台
	Plugin URI: http://leniy.org
	Version: 0.0.1
	Author: Leniy
	Author URI: http://leniy.org/
	声明：Leniy版权所有，严禁任何人抄袭使用类似的接口通讯方式、数据库组织结构、功能逻辑
*/
header('Content-Type:text/json; charset=utf-8');
include __DIR__ . '/config/leniy_config.php';//配置文件
include __DIR__ . '/functions/leniy_function.php';//配置文件

$json_data = json_decode(file_get_contents('php://input'), true);

if(null == $json_data){
	echo json_encode(array(
		"status"  => "error",
		"message" => "禁止直接打开接口页面，您的内网地址已经记录在案"
	));
	die;
}

//校验用户输入的姓名和手机号
if( mb_strlen($json_data['name'],'utf-8')<2 or mb_strlen($json_data['name'],'utf-8')>20 ){
	echo json_encode(array(
		"status"  => "error",
		"message" => "姓名字数不正确，重新登记"
	));
	die;
}

if( ! preg_match("/^1[3456789]\d{9}$/", $json_data['phone'], $matches) ) {
	echo json_encode(array(
		"status"  => "error",
		"message" => "手机号格式不正确，重新登记"
	));
	die;
}

try { //建立持久化的PDO连接
	$dsn = "$db_type:host=$db_host;dbname=$db_name;charset=$db_code";
	$pdo = new PDO($dsn, $db_user, $db_pass, array(PDO::ATTR_PERSISTENT => true));
	$pdo->exec("set names $db_type");
} catch (Exception $e) {
	echo json_encode(array(
		"status"  => "error",
		"message" => "连接数据库失败"
	));
	die;
}

if( "search" == $json_data['type'] ){
	echo json_encode(CheckIfExist($json_data, $pdo));
} elseif( "reg" == $json_data['type'] ){
	echo json_encode(AddEmployee($json_data, $pdo));
} else {
	echo json_encode(array(
		"status"  => "error",
		"message" => "检测到被攻击，相关数据已经记录"
	));
	die;
}
