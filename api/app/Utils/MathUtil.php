<?php

namespace App\Utils;

use DateTime;
use DateTimeZone;
use SVDResult;

class MathUtil
{
    function getPerpExpiryYF()
    {
        // We get UTC date time now
        $now = date_create('now', new DateTimeZone('UTC'));

        // We get the hour
        $hours = $now->format('H');

        // Perps are maturing every 8h on Deribit
        // Hence, we can compute the remaining time to maturity
        $next_expiry_hour = (floor($hours / 8) + 1) * 8;
        $next_expiry_timestamp = gmmktime($next_expiry_hour, 0, 0, $now->format('n'), $now->format('j'), $now->format('Y'));

        // Convert the timestamp to a DateTime object
        $next_expiry = (new DateTime())->setTimestamp($next_expiry_timestamp)->setTimezone(new DateTimeZone('UTC'));

        // Calculate the difference
        $diff = date_diff($now, $next_expiry);
        return ($diff->h * 3600 + $diff->i * 60 + $diff->s) / 31536000;
    }

    function getOptionExpiryYF($now, $expiry_date)
    {
        $diff = date_diff($now, $expiry_date);
        return ($diff->h * 3600 + $diff->i * 60 + $diff->s) / 31536000;
    }

    function getOptionDateExpiry()
    {
        // Get UTC datetime now
        $now = date_create('now', new DateTimeZone('UTC'));
        $expiry_day = date_add($now, date_interval_create_from_date_string("1 days"));

        // Set the time to 08:00:00
        $expiry_day->setTime(8, 0, 0);

        return $expiry_day; // Return the DateTime object
    }

    function solve($A, $r)
    {
        if (count($A) == 0 || count($A) != count($r))
            return null;
        $svdres = $this->svd($A);

        $C = $this->toMatrix($svdres->Q);
        $SI = $this->inverse_matrix($C);

        $UT = $this->transpose_U($svdres->U, $svdres->n);

        $AA = $this->matrix_multiply($this->matrix_multiply($svdres->V, $SI), $UT);
        return $this->mv_multiply($AA, $r);
    }

    function identity_matrix($dim)
    {
        $I = [[]];
        // We don't fill all the values to optimize CPU resources and time
        for ($i = 0; $i < $dim; $i++) {
            $I[$i][$i] = 1.0;
        }

        return $I;
    }

    function mv_multiply($A, $b)
    {
        $nRowA = count($A);
        if ($nRowA == 0)
            return null;

        $nColA = count($A[0]);
        if ($nColA != count($b))
            return null;

        $R = [];

        for ($i = 0; $i < $nRowA; $i++) {
            $tot = 0.0;
            for ($j = 0; $j < $nColA; $j++) {
                $tot = $tot + $A[$i][$j] * $b[$j];
            }

            $R[$i] = $tot;
        }

        return $R;
    }

    function matrix_multiply($A, $B)
    {
        $nRowA = count($A);
        $nRowB = count($B);

        if ($nRowA == 0 || $nRowB == 0)
            return null;
        $nColA = count($A[0]);
        $nColB = count($B[0]);

        if ($nColA == 0 || $nColB == 0)
            return null;
        ;
        if ($nColA != $nRowB)
            return null;
        ;

        $R = [[]];

        for ($i = 0; $i < $nRowA; $i++) {
            for ($j = 0; $j < $nColB; $j++) {
                $tot = 0;

                for ($k = 0; $k < $nColA; $k++) {
                    $tot = $tot + $A[$i][$k] * $B[$k][$j];
                }

                $R[$i][$j] = $tot;
            }
        }

        return $R;
    }

    function inverse_matrix($A)
    {
        $fd = 0;
        $fdScaler = 1.0 / $A[$fd][$fd];

        $n = count($A);
        $I = $this->identity_matrix($n);

        for ($j = 0; $j < $n; $j++) {
            $A[$fd][$j] = $fdScaler * $A[$fd][$j];
            if ($fd == $j) {
                $I[$fd][$j] = $fdScaler * $I[$fd][$j];
            }
        }

        for ($i = 1; $i < $n; $i++) {
            $crScaler = $A[$i][$fd];

            for ($j = 0; $j < $n; $j++) {
                $A[$i][$j] = $A[$i][$j] - $crScaler * $A[$fd][$j];
                $I[$i][$j] = $I[$i][$j] - $crScaler * $I[$fd][$j];
            }
        }

        for ($fd = 1; $fd < $n; $fd++) {
            $fdScaler = 1.0 / $A[$fd][$fd];

            for ($j = 0; $j < $n; $j++) {
                $A[$fd][$j] = $A[$fd][$j] * $fdScaler;
                $I[$fd][$j] = $I[$fd][$j] * $fdScaler;
            }

            for ($i = 0; $i < $n; $i++) {
                if ($i != $fd) {
                    $crScaler = $A[$i][$fd];
                    for ($j = 0; $j < $n; $j++) {
                        $A[$i][$j] = $A[$i][$j] - $crScaler * $A[$fd][$j];
                        $I[$i][$j] = $I[$i][$j] - $crScaler * $I[$fd][$j];
                    }
                }
            }
        }

        return $I;
    }

    function transpose_U($U, $n)
    {
        $UT = [[]];
        $m = count($U);

        for ($j = 0; $j < $n; $j++) {
            for ($i = 0; $i < $m; $i++) {
                $UT[$j][$i] = $U[$i][$j];
            }
        }

        return $UT;
    }

    function toMatrix($q)
    {
        $R = [[]];
        $n = count($q);

        for ($i = 0; $i < $n; $i++) {
            $R[$i][$i] = $q[$i];
        }

        return $R;
    }

    function transpose($A)
    {
        $m = count($A);
        $n = count($A[0]);
        $AT = [[]];

        for ($i = 0; $i < $m; $i++) {
            for ($j = 0; $j < $n; $j++) {
                $AT[$j][$i] = $A[$i][$j];
            }
        }

        return $AT;
    }

    function pythag($a, $b)
    {
        $absa = abs($a);
        $absb = abs($b);
        if ($absa > $absb) {
            $r = $absb / $absa;
            return $absa * sqrt(1.0 + $r * $r);
        }

        if ($absb == 0) {
            return 0.0;
        }
        $r = $absa / $absb;
        return $absb * sqrt(1.0 + $r * $r);
    }

    function svd($A)
    {
        $eps = 1E-10;
        $tol = 1E-12;
        $itMax = 50;

        $m = count($A);
        $n = count($A[0]);

        $e = array_fill(0, $n, 0.0);
        $q = array_fill(0, $n, 0.0);

        $v = [[]];

        $g = 0.0;
        $x = 0.0;

        for ($i = 0; $i < $n; $i++) {
            $e[$i] = $g;
            $s = 0.0;
            $l = $i + 1;

            for ($j = $i; $j < $m; $j++) {
                $s = $s + $A[$j][$i] * $A[$j][$i];
            }

            if ($s <= $tol) {
                $g = 0.0;
            } else {
                $f = $A[$i][$i];

                if ($f < 0.0) {
                    $g = sqrt($s);
                } else {
                    $g = -sqrt($s);
                }

                $h = $f * $g - $s;
                $A[$i][$i] = $f - $g;

                for ($j = $l; $j < $n; $j++) {
                    $s = 0.0;
                    for ($k = $i; $k < $m; $k++) {
                        $s = $s + $A[$k][$i] * $A[$k][$j];
                    }
                    $f = $s / $h;
                    for ($k = $i; $k < $m; $k++) {
                        $A[$k][$j] = $A[$k][$j] + $f * $A[$k][$i];
                    }
                }
            }

            $q[$i] = $g;
            $s = 0.0;

            for ($j = $l; $j < $n; $j++) {
                $s = $s + $A[$i][$j] * $A[$i][$j];
            }

            if ($s <= $tol) {
                $g = 0.0;
            } else {
                $f = $A[$i][$i + 1];
                if ($f < 0.0) {
                    $g = sqrt($s);
                } else {
                    $g = -sqrt($s);
                }

                $h = $f * $g - $s;
                $A[$i][$i + 1] = $f - $g;

                for ($j = $l; $j < $n; $j++) {
                    $e[$j] = $A[$i][$j] / $h;
                }
                for ($j = $l; $j < $m; $j++) {
                    $s = 0.0;
                    for ($k = $l; $k < $n; $k++) {
                        $s = $s + $A[$j][$k] * $A[$i][$k];
                    }
                    for ($k = $l; $k < $n; $k++) {
                        $A[$j][$k] = $A[$j][$k] + $s * $e[$k];
                    }
                }
            }

            $y = abs($q[$i]) + abs($e[$i]);
            if ($x > $y) {
                $x = $y;
            }
        }

        for ($i = $n - 1; $i >= 0; $i--) {
            if ($g != 0.0) {
                $h = $g * $A[$i][$i + 1];

                for ($j = $l; $j < $n; $j++) {
                    $v[$j][$i] = $A[$i][$j] / $h;
                }
                for ($j = $l; $j < $n; $j++) {
                    $s = 0.0;
                    for ($k = $l; $k < $n; $k++) {
                        $s = $s + $A[$i][$k] * $v[$k][$j];
                    }
                    for ($k = $l; $k < $n; $k++) {
                        $v[$k][$j] = $v[$k][$j] + $s * $v[$k][$i];
                    }
                }
            }

            for ($j = $l; $j < $n; $j++) {
                $v[$i][$j] = 0.0;
                $v[$j][$i] = 0.0;
            }

            $v[$i][$i] = 1.0;
            $g = $e[$i];
            $l = $i;
        }

        for ($i = $n - 1; $i >= 0; $i--) {
            $l = $i + 1;
            $g = $q[$i];

            for ($j = $l; $j < $n; $j++) {
                $A[$i][$j] = 0.0;
            }
            if ($g != 0.0) {
                $h = $A[$i][$i] * $g;
                for ($j = $l; $j < $n; $j++) {
                    $s = 0.0;
                    for ($k = $l; $k < $m; $k++) {
                        $s = $s + $A[$k][$i] * $A[$k][$j];
                    }
                    $f = $s / $h;
                    for ($k = $i; $k < $m; $k++) {
                        $A[$k][$j] = $A[$k][$j] + $f * $A[$k][$i];
                    }
                }
                for ($j = $i; $j < $m; $j++) {
                    $A[$j][$i] = $A[$j][$i] / $g;
                }
            } else {
                for ($j = $i; $j < $m; $j++) {
                    $A[$j][$i] = 0.0;
                }
            }
            $A[$i][$i] = $A[$i][$i] + 1.0;
        }

        $eps = $eps * $x;

        for ($k = $n - 1; $k >= 0; $k--) {
            for ($it = 0; $it < $itMax; $it++) {
                for ($l = $k; $l >= 0; $l--) {
                    $test_conv = false;
                    if (abs($e[$l]) <= $eps) {
                        $test_conv = true;
                        break;
                    }
                    if (abs($q[$l - 1]) <= $eps) {
                        break;
                    }
                }

                if (!$test_conv) {
                    $c = 0.0;
                    $s = 1.0;
                    $l1 = $l - 1;

                    for ($i = $l; $i < $k + 1; $i++) {
                        $f = $s * $e[$i];
                        $e[$i] = $c * $e[$i];

                        if (abs($f) <= $eps) {
                            break;
                        }
                        $g = $q[$i];
                        $h = $this->pythag($f, $g);

                        $q[$i] = $h;
                        $c = $g / $h;
                        $s = -$f / $h;

                        for ($j = 0; $j < $m; $j++) {
                            $y = $A[$j][$l1];
                            $z = $A[$j][$i];
                            $A[$j][$l1] = $y * $c + $z * $s;
                            $A[$j][$i] = -$y * $s + $z * $c;
                        }
                    }
                }

                $z = $q[$k];
                if ($l == $k) {
                    if ($z < 0.0) {
                        $q[$k] = -$z;
                        for ($j = 0; $j < $n; $j++) {
                            $v[$j][$k] = -$v[$j][$k];
                        }
                    }
                    break;
                }
                if ($it >= $itMax - 1) {
                    break;
                }

                $x = $q[$l];
                $y = $q[$k - 1];
                $g = $e[$k - 1];
                $h = $e[$k];
                $f = (($y - $z) * ($y + $z) + ($g - $h) * ($g + $h)) / (2.0 * $h * $y);
                $g = $this->pythag($f, 1.0);

                if ($f < 0.0) {
                    $f = (($x - $z) * ($x + $z) + $h * ($y / ($f - $g) - $h)) / $x;
                } else {
                    $f = (($x - $z) * ($x + $z) + $h * ($y / ($f + $g) - $h)) / $x;
                }

                $c = 1.0;
                $s = 1.0;

                for ($i = $l + 1; $i < $k + 1; $i++) {
                    $g = $e[$i];
                    $y = $q[$i];
                    $h = $s * $g;
                    $g = $c * $g;
                    $z = $this->pythag($f, $h);
                    $e[$i - 1] = $z;
                    $c = $f / $z;
                    $s = $h / $z;
                    $f = $x * $c + $g * $s;
                    $g = -$x * $s + $g * $c;
                    $h = $y * $s;
                    $y = $y * $c;

                    for ($j = 0; $j < $n; $j++) {
                        $x = $v[$j][$i - 1];
                        $z = $v[$j][$i];
                        $v[$j][$i - 1] = $x * $c + $z * $s;
                        $v[$j][$i] = -$x * $s + $z * $c;
                    }

                    $z = $this->pythag($f, $h);
                    $q[$i - 1] = $z;
                    $c = $f / $z;
                    $s = $h / $z;
                    $f = $c * $g + $s * $y;
                    $x = -$s * $g + $c * $y;

                    for ($j = 0; $j < $m; $j++) {
                        $y = $A[$j][$i - 1];
                        $z = $A[$j][$i];
                        $A[$j][$i - 1] = $y * $c + $z * $s;
                        $A[$j][$i] = -$y * $s + $z * $c;
                    }
                }

                $e[$l] = 0.0;
                $e[$k] = $f;
                $q[$k] = $x;
            }
        }

        return new SVDResult($A, $q, $v);
    }

    function getError($ref_returns, $target_returns, $reg_factors)
    {
        $n = count($ref_returns);
        $l = count($ref_returns[0]);

        $sq = 0.0;

        for ($i = 0; $i < $n; $i++)
        {
            $err = 0.0;
            for ($j = 0; $j < $l; $j++)
            {
                $err += $ref_returns[$i][$j] * $reg_factors[$j];
            }

            $err -= $target_returns[$i];
            $sq += $err * $err;
        }

        return sqrt($sq / ($n - 1));
    }
}
