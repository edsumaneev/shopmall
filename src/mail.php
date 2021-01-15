<?php

$admin_email  = 'r_aycom@mail.ru'; // имейл, на который отправляется форма
$form_subject = 'Сообщение с вашего сайта'; // тема письма

$data = [
  'Имя'               => htmlspecialchars($_POST['name']),
  'Телефон'           => htmlspecialchars($_POST['tel']),
  'Email'             => htmlspecialchars($_POST['email']),
  'Вариант подписки'  => htmlspecialchars($_POST['typeorder']),
];

$c = true;
foreach ($data as $key => $value) {
  if ($value != "") {
    $message .= "
    " . (($c = !$c) ? '<tr>' : '<tr style="background-color: #f8f8f8;">') . "
      <td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td>
      <td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td>
    </tr>
    ";
  }
}

$message = "<table style='width: 100%;'>$message</table>";

function adopt($text)
{
  return '=?UTF-8?B?' . Base64_encode($text) . '?=';
}

$headers = "MIME-Version: 1.0" . PHP_EOL .
"Content-Type: text/html; charset=utf-8" . PHP_EOL .
'From: ' . adopt(htmlspecialchars($_POST['name'])) . ' <' . htmlspecialchars($_POST['email']) . '>' . PHP_EOL .
'Reply-To: ' . htmlspecialchars($_POST['email']) . '' . PHP_EOL;

mail($admin_email, adopt($form_subject), $message, $headers);
