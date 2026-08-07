import {WebGL} from "webglmusti";

import InterfaceElement = WebGL.Interface.InterfaceElement;
import Geom = WebGL.Geometry;
import Point2D = Geom.Base.Point2D;

type Int32 = number;
type Float = number;

class City{
	x: Float;
	y: Float;
	constructor(x: Float, y: Float){
		this.x = x;
		this.y = y;
	}
	getPoint(): Point2D{
		return new Point2D(this.x, this.y);
	}
	isInside(){
		//todo
	}
}

class MainScreen extends InterfaceElement.InterfaceElement{

	game_rect_bound: InterfaceElement.Rect;
	pixels_per_unit: Float;
	game_mouse: Point2D | undefined;


	constructor(x: Float, y: Float, width: Float, height: Float){
		super(x, y, width, height);
		this.pixels_per_unit = 25;
		const left = 0;
		const bot = 0;
		this.game_rect_bound = new InterfaceElement.Rect(left, left+this.getGameRectWidth(), 
		bot, bot+this.getGameRectHeight());

	}

	getGameRectWidth(){
		return this.width/this.pixels_per_unit;
	}
	getGameRectHeight(){
		return this.height/this.pixels_per_unit;
	}
	onMouseMove(global_mouse: Point2D){
		this.updateGameMouse(global_mouse);
	}
	onMouseDown(){
		console.log(this.game_mouse);
	}
	onMouseUp(){

	}

	gamePointToGlobalPoint(point: Point2D): Point2D{
		const x = point.x*this.pixels_per_unit;
		const y = point.y*this.pixels_per_unit;
		return new Point2D(x+this.x, y+this.y);
	}

	private updateGameMouse(global_mouse: Point2D){
		// todo: update in webglmusti 0.8
		if(this.isInside(global_mouse)){
			const relative_mouse = new Point2D(global_mouse.x-this.x, global_mouse.y-this.y);
			this.game_mouse = new Point2D(relative_mouse.x/this.pixels_per_unit, relative_mouse.y/this.pixels_per_unit);
		}else{
			this.game_mouse = undefined;
		}
	}
}

export class CEngine extends WebGL.App.BaseEngine{
	main_screen: MainScreen;
	global_mouse: Geom.Base.Point2D;

	cities: City[];

	constructor(){
		super();
		this.main_screen = new MainScreen(50, 50, 330, 330);
		this.global_mouse = new Point2D(0, 0);

		this.cities = [];
		this.cities.push(new City(1, 1));
		this.cities.push(new City(-1, 1));
		this.cities.push(new City(0, 0));
	}
	protected handleMouseMove(ev: MouseEvent): void {
		this.global_mouse.x = ev.clientX;
		this.global_mouse.y = ev.clientY;
		this.main_screen.onMouseMove(this.global_mouse);
	}
	protected handleMouseDown(ev: MouseEvent): void {
		this.main_screen.onMouseDown();
	}
	protected handleMouseUp(ev: MouseEvent): void {
		this.main_screen.onMouseUp();
	}

}