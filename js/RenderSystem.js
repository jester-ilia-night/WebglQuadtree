/*RenderComponent.prototype.render = function(MVPMatrix, shaderProgram, verteciesCount){
	var uMVPMatrix = shaderProgram.getUniform("uMVPMatrix")
	gl.uniformMatrix4fv(uMVPMatrix, false, MVPMatrix);
	gl.drawArrays(gl.TRIANGLES, 0, verteciesCount);
}


inherit(RenderSystem, System)

function RenderSystem(){
    System.call(this)
}

RenderSystem.prototype.update = function(){
    mat4 VPMatrix = CameraPosition.getViewProjMatrix();
    
    for (entity in entities){
        ModelPositionComponent modelposition = entity.GetComponent(ModelPosition);
        var pos = modelPosition.getPos()

        height = heightMap.getHeighAtPoint(pos)

        //x and y in modelcoord, height in relative for ground
        var WorldMatrix = translateToWorld(pos.x, pos.y, height)

        var MVPMatrix = mat4.create()
        mat4.multiply(MVPMatrix, WorldMatrix, VPMatrix)

		MaterialComponent material = entity.GetComponent(Material)
		ShapeComponent shape = entity.GetComponent(Shape)
		Shader shader = takeShader...
		
        RenderComponent render = GetComponent(render);        
        
        shader.enable()
        
        material.apply()        
        shape.apply()
        
        render.draw(MVPMatrix, shader, shape.verteciesCount)
        
        shape.disable()
        material.disable()
    }	
}
*/


function RenderComponent(){
	Component.call(this)	
	this.FAMILY_ID = "RenderComponent";		
}
extendObj(RenderComponent, Component)

function TextureComponent(ctx, texture){
	RenderComponent.call(this)
	this.ctx = ctx;	
	this.texture = texture;
	this.COMPONENT_ID = 0;
}
extendObj(TextureComponent, RenderComponent)

TextureComponent.prototype.update = function(){
	//ctx.drawRect();
}

TextureComponent.prototype.getContext = function(){
	return this.ctx
}

TextureComponent.prototype.getTexture = function(){
	//this.texture.width = "10px"
	//mainShipObj.style.height = 'auto'
	return this.texture
}

//***********************************************************

function BackgroundComponent(image, level){
	Component.call(this)
	this.FAMILY_ID = 'BackgroundComponent';
	this.image = image
	this.level = level
} 

extendObj(BackgroundComponent, Component)

BackgroundComponent.prototype.update = function(){
}

BackgroundComponent.prototype.getContext = function(){
	return this.ctx
}

BackgroundComponent.prototype.getTexture = function(){
	return this.image
}

BackgroundComponent.prototype.getLevel = function(){
	return this.level
}
//***********************************************************

function clamp(val, minv, maxv)
{
	return Math.max( minv, Math.min(val, maxv));
}

// Draw background
function BackgroundSystem(entityManager, worldSize){
	this.systemId = "Background"
	this.entityManager = entityManager
	this.worldSize	= worldSize
	this.backgroundComponentId = new BackgroundComponent().getFamilyID()
	//this.positionComponentId = new PositionComponent().getFamilyID()
}

BackgroundSystem.prototype.update = function(dt){
	
}


BackgroundSystem.prototype.draw = function(ctx, canvasSize, visibleRect ){	
	var w = canvasSize.width
	var h = canvasSize.height
	
	// i expect that layers are sorted by z
	var entities = this.entityManager.getEntitiesWithComponent(this.backgroundComponentId);	
	
	//var posComp = entity.getComponentByFamilyID(this.positionComponentId);
	
	// ratio of visible
	var visiblePart = {
		'left' : clamp(visibleRect.left / this.worldSize.width, 0., 1.),
		'top' : clamp(visibleRect.top / this.worldSize.height, 0., 1.),
		'right' : clamp((visibleRect.left + visibleRect.width) / this.worldSize.width, 0, 1),
		'bottom' : clamp((visibleRect.top + visibleRect.height) / this.worldSize.height, 0, 1)
	};
	
	// all backgrounds is entities
	for (var i = 0; i < entities.length; ++i){
		var entity = entities[i];
		var bgComp = entity.getComponentByFamilyID(this.backgroundComponentId);	
		
				
		var texture = bgComp.getTexture();
		
		var level = bgComp.getLevel()
		
		/*
		var x = this.canvas.width * posInPerc.x
		ctx.fillStyle = 'black';
		ctx.lineWidth = 1
		ctx.beginPath()
		ctx.moveTo(x, 0);
		ctx.lineTo(x, h + 1);
		ctx.stroke();
		*/
		
		// level 0 - 
		var left = clamp(texture.width * visiblePart.left, 0, texture.width / 2);
		var right = clamp(texture.width * visiblePart.right, 0, texture.width );
		
		//console.log(left, right)
		//var right = texture.width * visiblePart.right; 
		//console.log(visiblePart.left, visiblePart.right);
		//ctx.drawImage(texture, 1300, 0, 1310, h, 0, 0, texture.width, h)
		ctx.drawImage(texture, left, 0, w, h, 0, 0, w, h)
		// mock drawing
		// 
		// is it static (like stars or sun)
			//draw
		
		// get layer distance(level)
		// compute visible part rect
		
		
		
		// is it repeated
		
		// draw
	}
	
	
}


