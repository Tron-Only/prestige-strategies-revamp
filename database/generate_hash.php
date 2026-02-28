<?php
// Simple password hash generator
$password = 'Tront@lkno1';
$hash = password_hash($password, PASSWORD_BCRYPT);
echo $hash;
