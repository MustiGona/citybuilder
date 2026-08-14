import {WebGL} from "webglmusti";

import InterfaceElement = WebGL.Interface.InterfaceElement;
import Geom = WebGL.Geometry;
import Point2D = Geom.Base.Point2D;

type Int32 = number;
type Float = number;

class City extends Geom.Circle.Circle{
	//x: Float;
	//y: Float;
	static current_id = 0;
	id: Int32;

	constructor(x: Float, y: Float){
		super(x, y, 0.3);
		this.id = City.current_id;
		City.current_id++;
	}
	getPoint(): Point2D{
		return this.centre;
	}
	isInside(pt: Point2D): boolean{
		return this.collisionPoint(pt);
	}
}

class MainScreen extends InterfaceElement.InterfaceElement{

	game_rect_bound: InterfaceElement.Rect;
	pixels_per_unit: Float;
	game_mouse: Point2D | undefined;

	dragging: boolean;


	constructor(x: Float, y: Float, width: Float, height: Float){
		super(x, y, width, height);
		this.pixels_per_unit = 25;
		const left = 0;
		const bot = 0;
		this.game_rect_bound = new InterfaceElement.Rect(left, left+this.getGameRectWidth(), 
		bot, bot+this.getGameRectHeight());
		this.game_mouse = undefined;
		this.dragging = false;

	}

	private hasMouseOver(): boolean{
		return this.game_mouse != undefined;
	}

	getGameRectWidth(){
		return this.width/this.pixels_per_unit;
	}
	getGameRectHeight(){
		return this.height/this.pixels_per_unit;
	}
	onMouseMove(global_mouse: Point2D){
		const old_game_mouse = this.game_mouse != undefined ? this.game_mouse.copy() : undefined;
		this.updateGameMouse(global_mouse);
		if(old_game_mouse != undefined && this.game_mouse != undefined){
			this.dragScreen(old_game_mouse, this.game_mouse);
		}

	}
	onMouseDown(){
		console.log(this.game_mouse);
		if(this.hasMouseOver()){
			this.dragging = true;
		}
	}
	onMouseUp(){
		this.dragging = false;
	}

	gamePointToGlobalPoint(point: Point2D): Point2D{
		const x = point.x*this.pixels_per_unit;
		const y = point.y*this.pixels_per_unit;
		return new Point2D(x+this.x, y+this.y);
	}

	private updateGameMouse(global_mouse: Point2D){
		if(this.isInside(global_mouse)){
			//to test
			const relative_mouse = new Point2D(global_mouse.x-this.x, global_mouse.y-this.y);
			this.game_mouse = new Point2D(this.game_rect_bound.left+relative_mouse.x/this.pixels_per_unit, this.game_rect_bound.bot+relative_mouse.y/this.pixels_per_unit);
		}else{
			this.game_mouse = undefined;
		}
	}
	private dragScreen(old_game_mouse: Point2D, new_game_mouse: Point2D){
		if(this.dragging){
			const dx = new_game_mouse.x - old_game_mouse.x;
			const dy = new_game_mouse.y - old_game_mouse.y;
			this.game_rect_bound.move(-dx, -dy);
			console.log(this.game_rect_bound.bot);
		}
	}
}

export class CEngine extends WebGL.App.BaseEngine{
	main_screen: MainScreen;
	global_mouse: Geom.Base.Point2D;

	cities: City[];
	hovered_city: Int32 | undefined;

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

		const game_mouse = this.main_screen.game_mouse;

		this.hovered_city = undefined;
		for(let i = 0; i < this.cities.length; i++){
			const city = this.cities[i];
			if(game_mouse != undefined && city.isInside(game_mouse)){
				this.hovered_city = city.id;
			}
		}
	}
	protected handleMouseDown(ev: MouseEvent): void {
		this.main_screen.onMouseDown();
	}
	protected handleMouseUp(ev: MouseEvent): void {
		this.main_screen.onMouseUp();
	}

}