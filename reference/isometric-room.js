
/* The isometric room.
 *
 * Copyright 2008 Joaquín M López Muñoz.
 * Distributed under the Boost Software License, Version 1.0.
 * (See accompanying file LICENSE_1_0.txt or copy at
 * http://www.boost.org/LICENSE_1_0.txt)
 */

function block(x,y,z,xx,yy,zz)
{
    this.id=0;
    this.x=x;
    this.y=y;
    this.z=z;
    this.xx=xx;
    this.yy=yy;
    this.zz=zz;
    this.z_index=0;
    this.get_h=block_get_h;
    this.get_v=block_get_v;
    this.out_of_bounds=block_out_of_bounds;
    this.overlap=block_overlap;
    this.supports=block_supports;
    this.projection_overlap=block_projection_overlap;
    this.is_behind=block_is_behind;
    this.try_move=block_try_move;
    this.local_try_move=block_local_try_move;
    this.mov_completed=false;
    this.act=block_act;
    this.falling=false;
    this.z_0=this.z;
}

function block_get_h()
{
    return h0+this.x-this.yy-this.y;
}

function block_get_v()
{
    return v0+this.x/2+this.y/2-this.z-this.zz;
}

function block_out_of_bounds()
{
    return this.x<0||this.y<0||this.z<0||
        this.x+this.xx>max_x||this.y+this.yy>max_y||this.z>max_z;
}

function block_overlap(obj)
{
    function interval_overlap(a1,a2,b1,b2)
    {
        return a1>=b1&&a1<b2 || b1>=a1&&b1<a2;
    }

    return interval_overlap(this.x,this.x+this.xx,obj.x,obj.x+obj.xx)&&
        interval_overlap(this.y,this.y+this.yy,obj.y,obj.y+obj.yy)&&
        interval_overlap(this.z,this.z+this.zz,obj.z,obj.z+obj.zz);
}

function block_supports(obj)
{
    function interval_overlap(a1,a2,b1,b2)
    {
        return a1>=b1&&a1<b2 || b1>=a1&&b1<a2;
    }

    return this.z+this.zz==obj.z&&
        interval_overlap(this.x,this.x+this.xx,obj.x,obj.x+obj.xx)&&
        interval_overlap(this.y,this.y+this.yy,obj.y,obj.y+obj.yy);
}

function block_projection_overlap(obj)
{
    function interval_overlap(a1,a2,b1,b2)
    {
        return a1>=b1&&a1<b2 || b1>=a1&&b1<a2;
    }

    return interval_overlap(
            this.x-this.y-this.yy,this.x+this.xx-this.y,
            obj.x- obj.y- obj.yy, obj.x+ obj.xx- obj.y)&&
        interval_overlap(
            this.x-this.z-this.zz,this.x+this.xx-this.z,
            obj.x- obj.z- obj.zz, obj.x+ obj.xx- obj.z)&&
        interval_overlap(
            -this.y-this.yy+this.z,-this.y+this.z+this.zz,
            - obj.y- obj.yy+ obj.z,- obj.y+ obj.z+ obj.zz);
}

function block_is_behind(obj)
{
    return this.projection_overlap(obj)&&
        (this.x+this.xx<=obj.x||this.y+this.yy<=obj.y||this.z+this.zz<=obj.z);
}

function block_local_try_move(xx,yy,zz)
{
    if(this.mov_completed)return false;
    this.mov_completed=true;
    this.x+=xx;this.y+=yy;this.z+=zz;
    if(this.out_of_bounds()){
        this.x-=xx;this.y-=yy;this.z-=zz;
        return false;
    }
    for(var i=0;i<objs.length;++i){
        if(this==objs[i])continue;
        if(this.overlap(objs[i])){
            if(!objs[i].local_try_move(xx,yy,zz)){
                this.x-=xx;this.y-=yy;this.z-=zz;
                return false;
            }
        }
    }
    if(xx!=0||yy!=0){
        for(var i=0;i<objs.length;++i){
            if(this==objs[i])continue;
            if(!this.falling&&this.supports(objs[i])){
                objs[i].local_try_move(xx,yy,0);
            }
        }
    }
    return true;
}

function block_try_move(xx,yy,zz)
{
    for(var i=0;i<objs.length;++i)objs[i].mov_completed=false;
    return this.local_try_move(xx,yy,zz);
}

function block_act()
{
    this.falling=(this.z_0>this.z);
    this.z_0=this.z;
}

function single_img_block(x,y,z,xx,yy,zz,src)
{
    this.inheritFrom=block;
    this.inheritFrom(x,y,z,xx,yy,zz);
    this.img=null;
    this.src=src;
    this.write_html=single_img_block_write_html;
}

function single_img_block_write_html()
{
    document.write(
        "<img id='obj"+this.id+"' "+
        "style='position:absolute;left:"+this.get_h()+
        ";top:"+this.get_v()+";z-index:0' "+
        "src='"+this.src+"'>");
    this.img=document.getElementById("obj"+this.id);
}

function box(x,y,z)
{
    this.inheritFrom=single_img_block;
    this.inheritFrom(x,y,z,16,14,17,"iso_box.gif");
}

function drawerbox(x,y,z)
{
    this.inheritFrom=single_img_block;
    this.inheritFrom(x,y,z,16,12,13,"iso_drawerbox.gif");
}

function table(x,y,z)
{
    this.inheritFrom=single_img_block;
    this.inheritFrom(x,y,z,40,26,15,"iso_table.gif");
}

function book(x,y,z)
{
    this.inheritFrom=single_img_block;
    this.inheritFrom(x,y,z,8,11,3,"iso_book.gif");
}

function coach(x,y,z)
{
    this.inheritFrom=single_img_block;
    this.inheritFrom(x,y,z,18,18,13,"iso_coach.gif");
}

function cactus(x,y,z)
{
    this.inheritFrom=single_img_block;
    this.inheritFrom(x,y,z,12,12,21,"iso_cactus.gif");
}

function multi_img_block(x,y,z,xx,yy,zz,srcs)
{
    this.inheritFrom=block;
    this.inheritFrom(x,y,z,xx,yy,zz);
    this.img=null;
    this.imgs=new Array();
    this.srcs=srcs;
    this.write_html=multi_img_block_write_html;
    this.switch_img=multi_img_block_switch_img;
}

function multi_img_block_write_html()
{
    for(var i=0;i<this.srcs.length;++i){
        document.write(
            "<img id='obj"+this.id+"-"+i+"' "+
            "style='position:absolute;left:"+this.get_h()+
            ";top:"+this.get_v()+";z-index:0;"+
            "visibility:"+(i==0?"visible":"hidden")+"' "+
            "src='"+this.srcs[i]+"'>");
        this.imgs.push(document.getElementById("obj"+this.id+"-"+i));
    }
    this.img=this.imgs[0];
}

function multi_img_block_switch_img(i)
{
    var old=this.img;
    this.img=this.imgs[i];
    if(this.img!=old){
        this.img.style.left=old.style.left;
        this.img.style.top=old.style.top;
        this.img.style.zIndex=old.style.zIndex;
        old.style.visibility="hidden";
        this.img.style.visibility="visible";
    }
}

function mouse(x,y,z)
{
    var srcs=new Array();
    srcs.push("iso_mouse_e.gif");
    srcs.push("iso_mouse_w.gif");
    srcs.push("iso_mouse_n.gif");
    srcs.push("iso_mouse_s.gif");

    this.inheritFrom=multi_img_block;
    this.inheritFrom(x,y,z,7,7,5,srcs);
    this.east=0;
    this.west=1;
    this.north=2;
    this.south=3;
    this.direction=this.east;
    this.try_advance=mouse_try_advance;
    this.base_act=this.act;
    this.act=mouse_act;
}

function mouse_try_advance()
{
    var dx=this.direction==this.east?2:this.direction==this.west?-2:0;
    var dy=this.direction==this.south?2:this.direction==this.north?-2:0;
    this.x+=dx;
    this.y+=dy;
    var blocked=false;
    if(this.out_of_bounds()){
        this.x-=dx;
        this.y-=dy;
        blocked=true;
    }
    else for(var i=0;i<objs.length;++i){
        if(this==objs[i])continue;
        if(this.overlap(objs[i])){
            this.x-=dx;
            this.y-=dy;
            blocked=true;
            break;
        }
    }
    return !blocked;
}

function mouse_act()
{
    this.base_act();
    if(Math.random()<0.05||!this.try_advance()){
        switch(this.direction){
            case this.north:case this.south:
            if(this.x<=hero.x){
                this.direction=this.west;
                if(!this.try_advance()){
                    this.direction=this.east;
                    this.try_advance();
                }
            }
            else{
                this.direction=this.east;
                if(!this.try_advance()){
                    this.direction=this.west;
                    this.try_advance();
                }
            }
            break;
            case this.east:case this.west:
            if(this.y<=hero.y){
                this.direction=this.north;
                if(!this.try_advance()){
                    this.direction=this.south;
                    this.try_advance();
                }
            }
            else{
                this.direction=this.south;
                if(!this.try_advance()){
                    this.direction=this.north;
                    this.try_advance();
                }
            }
            break;
        }
        this.switch_img(this.direction);
    }
}

function iso_hero(x,y,z)
{
    var srcs=new Array();
    var dirs=new Array();
    dirs.push("e");dirs.push("w");dirs.push("n");dirs.push("s");
    for(var i=0;i<dirs.length;++i){
        for(var j=0;j<4;++j){
            srcs.push("iso_hero_"+dirs[i]+j+".gif");
        }
    }

    this.inheritFrom=multi_img_block;
    this.inheritFrom(x,y,z,12,12,27,srcs);
    this.dz=0;
    this.east=0;
    this.west=1;
    this.north=2;
    this.south=3;
    this.direction=this.east;
    this.moving=false;
    this.step=0;
    this.jump=0;
    this.base_act=this.act;
    this.act=iso_hero_act;
    this.keydown=iso_hero_keydown;
    this.keyup=iso_hero_keyup;
}

function iso_hero_act()
{
    this.base_act();
    if(this.jump>0){
        --this.jump;
        this.dz=this.jump>10?4:this.jump>4?3:this.jump>0?2:0;
        this.try_move(0,0,this.dz);
    }
    if(this.moving){
        switch(this.direction){
            case this.north:this.try_move(0,-2,0);break;
            case this.south:this.try_move(0,2,0);break;
            case this.east :this.try_move(2,0,0);break;
            case this.west :this.try_move(-2,0,0);break;
        }
        this.step=(this.step==3)?0:this.step+1;
    }
    else this.step=0;
    this.switch_img(this.direction*4+this.step);
}

function iso_hero_keydown(ch)
{
    switch(ch){
        case 'Q':this.direction=this.west;this.moving=true;break;
        case 'S':this.direction=this.east;this.moving=true;break;
        case 'P':this.direction=this.north;this.moving=true;break;
        case 'L':this.direction=this.south;this.moving=true;break;
        case ' ':if(this.jump==0&&!this.falling)this.jump=15;break;
    }
}

function iso_hero_keyup(ch)
{
    switch(ch){
        case 'Q':if(this.direction==this.west)this.moving=false;break;
        case 'S':if(this.direction==this.east)this.moving=false;break;
        case 'P':if(this.direction==this.north)this.moving=false;break;
        case 'L':if(this.direction==this.south)this.moving=false;break;
    }
}

function exert_gravity()
{
    for(var i=0;i<objs.length;++i)objs[i].mov_completed=false;
    for(var i=0;i<objs.length;++i)objs[i].local_try_move(0,0,-1);
}

function assign_z_indices() {
    function depth_sort(objs) {
        for(var pivot = 0; pivot < objs.length;) {
            var new_pivot = false;
            for(var i = pivot; i < objs.length; ++i) {
                var obj = objs[i];
                var parent = true;
                for(var j = pivot; j < objs.length; ++j) {
                    if(j == i) continue;
                    var obj2 = objs[j];
                    if(obj2.is_behind(obj)) {
                        parent = false;
                        break;
                    }
                }
                if(parent) {
                    objs[i] = objs[pivot];
                    objs[pivot] = obj;
                    ++pivot;
                    new_pivot = true;
                }
            }
            if(!new_pivot) ++pivot;
        }
    }
    depth_sort(objs);
    for(var i = 0; i < objs.length; ++i) objs[i].z_index = i; // Unnecessary for my game
}

function refresh_display()
{
    update_h0v0();
    for(var i=0;i<objs.length;++i)
    {
        var obj=objs[i];
        var img=obj.img;
        img.style.left=obj.get_h();
        img.style.top=obj.get_v();
        img.style.zIndex=obj.z_index;
    }
}

function keydown_check(e)
{
    var key_code=(window.event)?event.keyCode:e.keyCode;
    hero.keydown(String.fromCharCode(key_code));
}

function keyup_check(e)
{
    var key_code=(window.event)?event.keyCode:e.keyCode;
    hero.keyup(String.fromCharCode(key_code));
}

function loop()
{
    exert_gravity();
    for(var i=0;i<objs.length;++i)objs[i].act();
    assign_z_indices();
    refresh_display();
    setTimeout(loop,20);
}

function init()
{
    window.onkeydown=function(e){if(e.keyCode==32){return false;}};
    document.onkeydown=keydown_check;
    document.onkeyup=keyup_check;
    loop();
}

var h0=0;
var v0=0;
var max_x=224;
var max_y=224;
var max_z=136;

function update_h0v0()
{
    function get_html_x(obj)
    {
        var el=obj;var pl=0;
        while(el){pl+=el.offsetLeft;el=el.offsetParent;}
        return pl;
    }

    function get_html_y(obj)
    {
        var el=obj;var pt=0;
        while(el){pt+=el.offsetTop;el=el.offsetParent;}
        return pt;
    }

    h0=227+get_html_x(document.getElementById("canvas"));
    v0=139+get_html_y(document.getElementById("canvas"));
}

var objs=new Array();

function add(obj)
{
    obj.id=objs.length;
    objs.push(obj);
}

var hero=new iso_hero(168,170,0);
add(hero);
add(new mouse(20,20,0));
add(new box(28,22,0));
add(new box(28,36,0));
add(new box(44,22,0));
add(new box(44,36,0));
add(new box(28,22,17));
add(new box(32,36,17));
add(new box(44,22,17));
add(new box(42,20,34));
add(new box(42,18,51));
add(new drawerbox(84,172,0));
add(new drawerbox(84,184,0));
add(new drawerbox(84,196,0));
add(new drawerbox(84,172,13));
add(new drawerbox(84,184,13));
add(new drawerbox(84,196,13));
add(new drawerbox(84,172,26));
add(new drawerbox(84,184,26));
add(new drawerbox(84,196,26));
add(new table(16,174,0));
add(new book(46,182,15));
add(new book(48,182,18));
add(new book(46,182,21));
add(new coach(176,62,0));
add(new coach(158,62,0));
add(new coach(140,62,0));
add(new coach(140,44,0));
add(new book(172,66,13));
add(new cactus(102,16,0));