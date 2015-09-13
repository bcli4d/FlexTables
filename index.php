<?php
/**
 * Step 1: Require the Slim Framework
 *
 * If you are not using Composer, you need to require the
 * Slim Framework and register its PSR-0 autoloader.
 *
 * If you are using Composer, you can skip this step.
 */
require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

/**
 * Step 2: Instantiate a Slim application
 *
 * This example instantiates a Slim application using
 * its default settings. However, you will usually configure
 * your Slim application now by passing an associative array
 * of setting names and values into the application constructor.
 */
$app = new \Slim\Slim();

$CONFIG_FILE = "config.json";

$config = file_get_contents($CONFIG_FILE);
$config_json = json_decode($config, JSON_UNESCAPED_SLASHES);



/**
 * Step 3: Define the Slim application routes
 *
 * Here we define several Slim application routes that respond
 * to appropriate HTTP request methods. In this example, the second
 * argument for `Slim::get`, `Slim::post`, `Slim::put`, `Slim::patch`, and `Slim::delete`
 * is an anonymous function.
 */

// GET route
$app->get(
    '/',
    function () {
        $template = <<<EOT
<!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8"/>
            <title>Slim Framework for PHP 5</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha/css/bootstrap.css"/>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fixed-data-table/0.4.6/fixed-data-table.css" />
            <link rel="stylesheet" href="javascript/public/style.css" />
            <style>
            </style>
        </head>
        <body>

            <div id="app"></div>
        </body>
        <script type="text/javascript" src="javascript/build/bundle.js">

        </script>
    </html>
EOT;
        echo $template;
    }
);

// POST route
$app->post(
    '/post',
    function () {
        echo 'This is a POST route';
    }
);

// PUT route
$app->put(
    '/put',
    function () {
        echo 'This is a PUT route';
    }
);

// PATCH route
$app->patch('/patch', function () {
    echo 'This is a PATCH route';
});

// DELETE route
$app->delete(
    '/delete',
    function () {
        echo 'This is a DELETE route';
    }
);

$app->get(
  '/getConfig',
  function () use($config_json, $app) {
    $config_safe = array(
      "title" => $config_json["title"],
      "path" => $config_json["path"]
    );
    echo json_encode($config_safe);
  }
);

$app->get(
  '/getData',
  function () use($config_json, $app){


    $pathState = (int)$app->request->params("pathState");


    $dataUrl = $config_json["path"][$pathState]["dataUrl"];

    $apiKey = $config_json["apiKey"];


    $dataUrl = $dataUrl . "?api_key=".$apiKey;


    //Add parameters to dataUrl
    if( isset($config_json["path"][$pathState]["params"]) ){
      $params = $config_json["path"][$pathState]["params"];
      $reqParams = urldecode($app->request->params($params));

      $dataUrl = $dataUrl . "&" . $params . "=" . urlencode($reqParams);
    }



    //Make the remote request
    $cSession = curl_init();
    try {
        $ch = curl_init();

        if (FALSE === $ch)
            throw new Exception('failed to initialize');


        curl_setopt($ch,CURLOPT_URL, $dataUrl);
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
        curl_setopt($ch,CURLOPT_HEADER, false);

        $content = curl_exec($ch);

        if (FALSE === $content)
            throw new Exception(curl_error($ch), curl_errno($ch));

        // ...process $content now
    } catch(Exception $e) {

        trigger_error(sprintf(
            'Curl failed with error #%d: %s',
            $e->getCode(), $e->getMessage()),
            E_USER_ERROR);

    }

    echo ($content);
  }
);

/**
 * Step 4: Run the Slim application
 *
 * This method should be called last. This executes the Slim application
 * and returns the HTTP response to the HTTP client.
 */
$app->run();
