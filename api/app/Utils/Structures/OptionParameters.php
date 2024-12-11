<?php

class OptionParameters {
	public $Spot;
	public $Forward;
	public $Vol;
	
	function __constructor($spot, $forward, $vol) {
		$this->Spot = $spot;
		$this->Forward = $forward;
		$this->Vol = $vol;
	}
}
