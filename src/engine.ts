import {WebGL} from "webglmusti";

import * as CityMap from "./city_screen/city_map";
import * as City from "./city/city";

import InterfaceElement = WebGL.Interface.InterfaceElement;
import Geometry = WebGL.Geometry;
import Point2D = Geometry.Base.Point2D;
import TransformationMatrix = WebGL.Matrix.TransformationMatrix3x3;
import Colour = WebGL.Colour;

type Int32 = number;
type Float = number;


const theme: WebGL.Interface.Theme.InterfaceTheme = {
  primary: WebGL.Colour.ColourUtils.fromHex("40EB9E"),
  secondary: WebGL.Colour.ColourUtils.fromHex("4fb286"),
  tertiary: WebGL.Colour.ColourUtils.fromHex("77FFC2"),
  background: WebGL.Colour.ColourUtils.fromHex("3c896d"),
  secondary_background: WebGL.Colour.ColourUtils.fromHex("266C52"),
  close: WebGL.Colour.ColourUtils.fromHex("546d64"),
  close_hover: WebGL.Colour.ColourUtils.fromHex("CC1212"),
}


/*
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
}*/



class MainScreen extends InterfaceElement.InterfaceElement{

	game_rect_bound: InterfaceElement.Rect;
	pixels_per_unit: Float;
	game_mouse: Point2D | undefined;

	dragging: boolean;
	drag_point: Point2D | undefined;

	city_screen: CityMap.CityMap;


	constructor(x: Float, y: Float, width: Float, height: Float){
		super(x, y, width, height);
		this.pixels_per_unit = 25;
		const left = 0;
		const bot = 0;
		this.game_rect_bound = new InterfaceElement.Rect(
			left, left+this.getGameRectWidth(), 
			bot, bot+this.getGameRectHeight()
		);
		this.game_mouse = undefined;
		this.dragging = false;

		this.city_screen = new CityMap.CityMap();
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
		//const old_game_mouse = this.game_mouse != undefined ? this.game_mouse.copy() : undefined;
		this.updateGameMouse(global_mouse);
		if(this.drag_point != undefined && this.game_mouse != undefined){
			this.dragScreen(this.drag_point, this.game_mouse);
		}
	}
	onMouseDown(){
		//console.log(this.game_mouse);
		if(this.hasMouseOver()){

			
			this.dragging = true;
			this.drag_point = this.game_mouse;
		}
		
	}
	onMouseUp(){
		this.dragging = false;
	}

	gamePointToGlobalPoint(point: Point2D): Point2D{
		const x = (point.x-this.game_rect_bound.left)*this.pixels_per_unit;
		const y = (point.y-this.game_rect_bound.bot)*this.pixels_per_unit;
		return new Point2D(x+this.x, y+this.y);
	}

	private updateGameMouse(global_mouse: Point2D){
		if(this.isInside(global_mouse)){
			//to test
			const relative_mouse = new Point2D(global_mouse.x-this.x, global_mouse.y-this.y);
			this.game_mouse = new Point2D(this.game_rect_bound.left+(relative_mouse.x/this.pixels_per_unit), this.game_rect_bound.bot+(relative_mouse.y/this.pixels_per_unit));
		}else{
			this.game_mouse = undefined;
		}
	}
	private dragScreen(drag_point: Point2D, mouse_point: Point2D){
		if(this.dragging){
			const dx = mouse_point.x - drag_point.x;
			const dy = mouse_point.y - drag_point.y;
			this.game_rect_bound.move(-dx, -dy);
		}
	}
}

export class MainInterface extends InterfaceElement.InterfaceElement{
	next_turn_button: WebGL.Interface.Button.BasicButton;
	constructor(){
		super(100, 10, 200, 80);
		this.next_turn_button = new WebGL.Interface.Button.BasicButton(110, 15, 140, 70, 15);
		this.next_turn_button.text = "Next Turn";
		this.next_turn_button.setTheme(theme);
	}
	addNextTurnFunction(f: () => void){
		this.next_turn_button.onPressed = f;
	}
	onMouseMove(pt: Geometry.Base.Point2D){
		this.next_turn_button.onMouseMove(pt);
	}
	onMouseDown(){
		this.next_turn_button.onMouseDown();
	}
	onMouseUp(){
		this.next_turn_button.onMouseUp();
	}

	draw(vp: TransformationMatrix, 
			colour_shader: WebGL.Shader.MVPColourProgram,
			text_drawer: WebGL.TextDrawer
		){
		this.drawBackground(vp, colour_shader, Colour.ColourUtils.grey());
		this.next_turn_button.draw(vp, colour_shader, text_drawer);
	}
}

export class CEngine extends WebGL.App.BaseEngine{
	main_screen: MainScreen;
	main_interface: MainInterface;
	global_mouse: Geometry.Base.Point2D;

	cities: City.City[];
	hovered_city: Int32 | undefined;

	city_screen: CityMap.CityMap;



	constructor(){
		super();
		this.main_screen = new MainScreen(100, 100, 380, 380);
		this.main_interface = new MainInterface();
		this.addMainInterfaceFunctions();
		this.global_mouse = new Point2D(0, 0);

		this.cities = [];
		this.cities.push(new City.City(1, 1));
		this.cities.push(new City.City(-1, 1));
		this.cities.push(new City.City(0, 0));

		this.city_screen = new CityMap.CityMap();
	}

	addMainInterfaceFunctions(){
		this.main_interface.addNextTurnFunction(() => {
			this.nextTurn();
		});
	}

	nextTurn(){
		console.log("running next turn");
		//todo
	}

	protected handleMouseMove(ev: MouseEvent): void {
		this.global_mouse.x = ev.clientX;
		this.global_mouse.y = ev.clientY;
		this.main_screen.onMouseMove(this.global_mouse);
		this.main_interface.onMouseMove(this.global_mouse);

		const game_mouse = this.main_screen.game_mouse;

		this.hovered_city = undefined;
		for(let i = 0; i < this.cities.length; i++){
			const city = this.cities[i];
			if(game_mouse != undefined && city.isInside(game_mouse)){
				this.hovered_city = city.id;
			}
		}
		this.city_screen.onMouseMove(this.global_mouse);
	}
	protected handleMouseDown(ev: MouseEvent): void {
		this.main_screen.onMouseDown();
		this.main_interface.onMouseDown();
		if(this.hovered_city != undefined){
			//open city map
			this.city_screen.loadCity(this.cities[this.hovered_city]);
		}
		this.city_screen.onMouseDown(this.global_mouse);
	}
	protected handleMouseUp(ev: MouseEvent): void {
		this.main_interface.onMouseUp();
		this.main_screen.onMouseUp();
	}

}