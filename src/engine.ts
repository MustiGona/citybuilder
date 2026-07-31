import {WebGL} from "webglmusti";

import A = WebGL.Interface.InternalWindow;

type Float = number;

class City{

}

class MainScreen extends WebGL.Interface.InterfaceElement.InterfaceElement{

}

export class CEngine extends WebGL.App.BaseEngine{
	main_screen: MainScreen;

	constructor(){
		super();
		this.main_screen = new MainScreen(50, 50, 80, 80);
	}


}