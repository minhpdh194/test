<?php

class SVDResult {
	public $U;
	public $Q;
	public $V;
	
	public $n;
	
	function __construct($u, $q, $v) {
		$this->U = $u;
		$this->Q = $q;
		$this->V = $v;
		$this->n = count($v);
	}
}
