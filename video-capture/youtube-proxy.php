<?php

$url = 'http://www.youtube.com/get_video_info?html5=1&video_id=';
if (!array_key_exists('id', $_GET)) {
    header('content-type: application/json');
    echo json_encode(['error' => 'Missing id param']);
    http_response_code(400);
    exit();
}

$id = $_GET['id'];

$data = file_get_contents($url . $id);

function decode($str)
{
    $data = explode('&', $str);
    return array_reduce($data, function ($acc, $part) {
        list($key, $val) = explode('=', $part);
        $val = urldecode($val);

        if ($val) {
            switch ($val[0]) {
                case ',':
                    $val = explode(',', substr($val, 1));
                    break;
                case '{':
                    $val = json_decode($val, true);
                    break;
                case '<':
                    break;
                default:
                    if (!preg_match('|^http|', $val) && preg_match('|=|', $val)) {
                        $val = decode($val);
                    }
            }
        }

        $acc[$key] = $val;
        return $acc;
    }, []);
}

$data = decode($data);
$map = $data['url_encoded_fmt_stream_map'];
$assetUrl = urldecode($map['url']);
$map['url'] = $assetUrl;
error_log(json_encode($data['url_encoded_fmt_stream_map'], JSON_PRETTY_PRINT) . PHP_EOL);
//error_log($assetUrl);
//echo json_encode($data, JSON_PRETTY_PRINT);
readfile($assetUrl);
