import {Component, OnInit} from 'angular2/core';
import {BaseComponent} from '../../../../../common/base/BaseComponent';

@Component({
	selector: 'main-home-component',
	templateUrl: '/client/src/pages/internal/containers/home/main/template/main-home-component.html'
})

export class MainHomeComponent extends BaseComponent implements OnInit {

	constructor() {
		super();
	 }

	ngOnInit() { }
}