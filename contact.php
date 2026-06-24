<?php

if (isset($_POST['name'])) {

    $name    = htmlspecialchars(trim($_POST['name'] ?? ''));
    $email   = htmlspecialchars(trim($_POST['email'] ?? ''));
    $message = htmlspecialchars(trim($_POST['message'] ?? ''));

    $errors = [];

    if ($name === '') {
        $errors[] = 'Please enter your name.';
    }
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Please enter a valid email address.';
    }
    if ($message === '') {
        $errors[] = 'Please write a message.';
    }

    if (empty($errors)) {
        $entry = "[" . date('Y-m-d H:i:s') . "] " . $name . " <" . $email . ">: " . $message . "\n";

        file_put_contents(__DIR__ . '/messages.txt', $entry, FILE_APPEND);

        $success = true;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Message Sent — Lauryn Hill Fan Tribute</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <nav>
    <div class="logo">Lauryn Hill</div>
  </nav>

  <section class="about">
    <div class="section-header">
      <h2 class="section-title">
        <?php if (!empty($success)): ?>
          Message Received
        <?php else: ?>
          Something Went Wrong
        <?php endif; ?>
      </h2>
    </div>

    <?php if (!empty($success)): ?>
      <p class="about-text">
        Thanks, <?php echo $name; ?>! Your message has been saved.
        We'll get back to you at <?php echo $email; ?>.
      </p>
    <?php else: ?>
      <p class="about-text">
        Please fix the following and try again:
      </p>
      <ul class="about-text">
        <?php foreach ($errors as $error): ?>
          <li>- <?php echo $error; ?></li>
        <?php endforeach; ?>
      </ul>
    <?php endif; ?>

    <p style="margin-top: 24px;">
      <a class="cta" href="index.html" style="text-decoration:none; display:inline-block;">BACK TO HOME</a>
    </p>
  </section>

  <footer>
    <span>Fan tribute project & built for learning purposes</span>
  </footer>
</body>
</html>