var vertexPositionAttribute  = {}
var canvas = {}
var ground = {}

var Positions = []
var Objects = []
var GroundObjects = []
var shaderManager = {}
var pMatrix = {}
function onLoad()
{
	canvas = document.getElementById("drawArea");
	var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"]
	gl = null;
	for (var i =0; i < names.length; ++i){
		try {
			gl = canvas.getContext(names[i]);			
			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;
		} catch(e) {}
		
		if (gl){
			console.log("success")
			break;
		}
	}
	
	// TODO move all this to some other func
	canvas.onmouse
	
	initShaders();
	initBuffers();
	
	global_angle = 0;
	setInterval(update, 30);
	//update();
}

function initShaders(){	
	shaderManager = new ShaderManager()
	var shaderProgram = shaderManager.getProgram('flat')
	shaderProgram.enable()
}

function initBuffers(){
	var flatProgram = shaderManager.getProgram('flat')
	
	GroundObjects.push((new Ground()).setShaderProgram(flatProgram))
	//GroundObjects.push((new Ground()).setShaderProgram(flatProgram))
	
	for (var i = 0; i < 5; ++i)
	{
		Objects.push((new Cube()).setShaderProgram(flatProgram))
		Positions.push({x:0, y:0})
	}
	
		
	pMatrix = mat4.create();
	mat4.perspective(pMatrix, 45., gl.viewportWidth / gl.viewportHeight, 0.1, 100.)
}

//StackMatrix.push
//StackMatrix.pop 

function DrawGround(){
	for (var idx = 0; idx < GroundObjects.length; ++idx){
		var curObject = GroundObjects[idx]
		curObject.setGlobalTransform(pMatrix)		
		var mat = curObject.getMotionMatrix();		
				
		// TODO replace to matrix stack		
		mat4.identity(mat)
		//mat4.translate( mat, mat, moveDist)
		//mat4.rotateY(mat, mat, Math.PI * global_angle / 180.)	
		
		if (idx == 0)
		{
			mat4.rotateX(mat, mat, Math.PI * 90 / 180.)				
		}
		else
		{
			mat4.translate(mat, mat, [0, 1, 1])
		}
		curObject.draw()		
	}	
}


function updateCoord(val)
{
	var rnd = Math.random()
	var shift = 0
	if (rnd > 0.95)
	{
		shift = 1
	}
	//else if(rnd < 0.33)
	//{
//		shift = 0
//	}
	val += shift
	if (val < 0)
	{
		val += 8
	}
	val %= 8
	return val
}

// TODO get this param from groundObject
var cellCount = 8
var boxScale = 1./cellCount

function MoveObjectToCell(mat, row, col)
{	
	var groundHeight = GroundObjects[0].getHeight(col, row);
	// "-" because z was reverse
	var boxHeight = -groundHeight / boxScale + 1;
	
	// TODO get from ground
	var cellSize = 1	
	var objectLen = 2
	
	// translate to 0 0
	mat4.translate( mat, mat, [objectLen/2, boxHeight, objectLen/2])
	mat4.translate( mat, mat, [objectLen * (row  - (cellCount / 2)), 0, objectLen * ( col - (cellCount / 2))])
}

var x = 0
var y = 0
function DrawObjects(){	
	for (var idx = 0; idx < Objects.length; ++idx){		
		var curObject = Objects[idx]
		curObject.setGlobalTransform(pMatrix)
		var mat = curObject.getMotionMatrix();
		
		// TODO replace to matrix stack		
		mat4.identity(mat)
		
		// lift cube to a half of it size and set initial pos as 0
		
		//mat4.translate( mat, mat, moveDist)
		//mat4.rotateY(mat, mat, Math.PI * global_angle / 180.)
		mat4.scale(mat, mat, [boxScale, boxScale, boxScale])			
		
		position = Positions[idx]
		//position.x = idx
		//position.y = 0
		position.x = updateCoord(position.x)
		position.y = updateCoord(position.y)		
		
		
		
		MoveObjectToCell(mat, position.y, position.x)				
		curObject.draw()		
	}	
}

var moveDist = [0, -0.5, -3]

var FixedAngle = 0

function update()
{
	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND)
	
	// At the current moment i don't know exactily meanings of this attributes
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)	
	gl.depthFunc(gl.LESS);
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight)
	
	
	if (FixedAngle){
		global_angle = 90
	}
	else{
		global_angle = (global_angle + 1) % 360;
	}
	
	// TOTHINK - is this is a good practice to remake convertation of matrix every time 
	mat4.perspective(pMatrix, 45., gl.viewportWidth / gl.viewportHeight, 0.1, 100.)
	
	// Why reverse order
	mat4.translate(pMatrix, pMatrix, moveDist)
	mat4.rotateY(pMatrix, pMatrix,  global_angle * Math.PI / 180 )	
	
	DrawGround()
	DrawObjects()		
}
