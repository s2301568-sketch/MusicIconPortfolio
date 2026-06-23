<?php
// =========================================================
// contact.php
// This file runs on the SERVER (not in the browser) whenever
// someone submits the contact form on index.html.
//
// IMPORTANT: PHP only works if your site is opened through a
// PHP-capable server, not by double-clicking the HTML file.
// To test this locally, run:  php -S localhost:8000
// then visit:  http://localhost:8000/index.html
// =========================================================

// 1. Only continue if the form was actually submitted with POST.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // 2. Grab the form fields. htmlspecialchars() escapes any HTML
    //    the visitor typed, so it can't break our page or inject code.
    $name    = htmlspecialchars(trim($_POST['name'] ?? ''));
    $email   = htmlspecialchars(trim($_POST['email'] ?? ''));
    $message = htmlspecialchars(trim($_POST['message'] ?? ''));

    // 3. Very basic validation — make sure nothing is empty.
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

    // 4. If there are no errors, "send" the message.
    //    For a real site you'd email it with mail() or save it to a
    //    database. Here we just save it to a simple text log file
    //    so beginners can see the result without setting up email.
    if (empty($errors)) {
        $entry = sprintf(
            "[%s] %s <%s>: %s\n",
            date('Y-m-d H:i:s'),
            $name,
            $email,
            $message
        );

        // append the message to messages.txt (created automatically)
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
      <a class="cta" href="index.html" style="text-decoration:none; display:inline-block;">Back to Home</a>
    </p>
  </section>

  <footer>
    <span>Fan tribute project &middot; built for learning purposes</span>
  </footer>
</body>
</html>