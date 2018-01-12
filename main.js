/*****************************
 * @PROJECT: Memory Castle
 * @DATE: 12/20/17
 * @CREATOR: ElliotThomas (KhanGressman)
 * @SUSCRIBE: https://www.khanacademy.org/computer-programming/subscribe-to-elliotthomas/6143912861433856
 * @CREDIT: 
 *  https://www.khanacademy.org/computer-programming/math-library/6008018727141376 - by KhanGressman
 *  https://www.khanacademy.org/pixar/physics-simulation/6118624082329600 - by KhanGressman
 * http://lodev.org/cgtutor/raycasting.html
 * https://www.khanacademy.org/computer-programming/raycasting-3d-test-iiii/6592431021948928 (another program that used the above tutorial)
 * Baced off of https://www.khanacademy.org/computer-programming/game-template/5927200180731904 - by KhanGressman
*****************************/
/*********************************************************************************
 * @ABOUT
 * 
 * TODO:
 * Finsih the render method on the RaycastMap object type
 * Create a Texture object type that has a width property
 * 
 * TODO EVENTUALLY:
 * Precalculate raytracing rays from Camera
 * 
 * @Format (you can delete this in your program if you want.  Otherwise, you can stuff it into some corner where only you will see it):
 * Variables {
 *  Multiuse variables (variables that are used in every game) are all-caps.  Words are either separated by an underscore (_) or nothing
 *      Read-mostly variables are preceded by one underscore (_)
 *      Edit-mostly variables are preceded by two underscores (__)
 *      Do-not-touch-mostly variables are preceded by one underscore (_) and followed by one underscore (_) (eg. _DONOTTOUCHTHISVARIABLE_)
 * 
 *  User-defined variables can follow any system wdesired
 }
 * Functions {
 *  Pre-defined functions of multiple words are cammmel-case (anExampleFunctionName)
 } 
 * Object types {
 *  Pre-defined object types follow the same format as functions but start with a capatal
 }
 
 * @Loading:
 * {
 * Loading reduces lag by turning complicated shapes to draw into images.  Also, rather than turning each shape into an image as it is first shown in the game, all the images are converted in the first scene, the loading scene.
 * To load an image, call `load(drawingFunction, name);`.  `drawingFunction` is the name of the function that draws the image and returns an image of the picture via `get(x,y, width,height);`
 * To then use the image, you need to do the following: `image (IMAGE.name_used_for_loading, x, y, width* height*);` (if width and height are not specified, the width and height used when the image was `get`ted will be used.
 * How it works is the `load` function puts the drawing function in an array called _LOADFUNCS_ which then has all of its functions called in the Load scene.  The function that `load` puts into `_LOADFUNCS_` both calls the drawing function and then puts that into the `_IMAGES` array
 }
*********************************************************************************/
smooth ();


/***************
 * VARIABLES
***************/
{
    
// Environment

// graphics
var _GRAPHICS_ = "fancy"; // lag or no lag

var _SCREEN_HYP = Math.sqrt(width*width+height*height);


var _COLOR = {
    BLACK : color (40, 40, 40, 255),
    WHITE : color (220, 220, 220, 255),
    CREAM : color (242, 242, 220, 255),
    RED : color (175, 0, 0, 255),
    PURPLE : color (155, 0, 100),
    SEA : color (33, 136, 148),
    
    PURE : {
        BLACK: color (0, 0, 0, 255),
        WHITE: color (255, 255, 255, 255),
    },
};
_COLOR.CLEAR = {};

var _FONT = {
    SANS : createFont ("Segoe UI"),
    SERIF : createFont ("Georia"),
    CURSIVE : createFont ("Monotype Corsiva"),
    FANTASY : createFont ("Gabriola"),
    
    DEFAULT : {
        SANS : createFont ("sans"),
        SERIF : createFont ("serif"),
        CURSIVE : createFont ("cursive"),
        MONOSPACE : createFont ("monospace"),
        FANTASY : createFont ("fantasy"),
    },
};

// sound
var _MUTE = true;
var _SOUND = {};
if (!_MUTE) {
    _SOUND = {
        // put your sound files here
    };
}

// input
var _KEYS = [];

// other
var _FRAME_RATE_ = 30;


// Template Functionality
var __SCENE = 'load';

var _LOADFUNCS_ = [];
var _IMAGES = {};
var IMAGE_ID = 0; // in things like object types, it can be useful to have an id instead of a key

}


/***************
 * FUNCTIONS
***************/
{
    
// Debuging Tools
var pr = function () {
    var data = "hello";
    if (arguments.length >= 1) {
        data = "";
        for (var i = 0; i < arguments.length; i ++) {
            if (typeof arguments[i] === 'object') {
                data += "[";
                for (var j in arguments[i]) {
                    data += j+", ";
                }
                data += "], ";
            }
            else {
                data += arguments[i]+", ";
            }
        }
    }
    println (data);
};
var printedOnce = false;
var printOnce = function () {
    if (!printedOnce) {
        printedOnce = true;
        pr (arguments);
    }
    return !printedOnce;
};

// Color Tools
var randomHSB = function (alpha, hue, sat, bright) {
    alpha = alpha || [];
    hue = hue || [];
    sat = sat || [];
    bright = bright || [];
    alpha[0] = alpha[0] || 0;
    alpha[1] = alpha[1] || 255;
    hue[0] = hue[0] || 0;
    hue[1] = hue[1] || 255;
    sat[0] = sat[0] || 0;
    sat[1] = sat[1] || 255;
    bright[0] = bright[0] || 0;
    bright[1] = bright[1] || 255;
    pushStyle ();
    colorMode (HSB);
    var c = color (random(hue[0],hue[1]), random(sat[0],sat[1]), random(bright[0],bright[1]), random(alpha[0],alpha[1]));
    popStyle ();
    return c;
};
var hsbaEdit = function (c, h, s, b, a) {
    h = h || 0;
    s = s || 0;
    b = b || 0;
    a = a || 0;
    pushStyle ();
    colorMode (HSB);
    var col = color (hue(c)+h, saturation(c)+s, brightness(c)+b, alpha(c)+a);
    popStyle ();
    return col;
};

// Image Tools
var load = function (func, key, param) {
    _LOADFUNCS_.push(function () {
        _IMAGES[key]=func(param);
    });
};
var grabImage = function (key) {
    return _IMAGES[key];
};

var _SPRITE = {};

var _BACKGROUND = {};


// Other Tools
var recLoop = function (obj, func) {
    for (var i in obj) {
        if (typeof i === 'object') {
            recLoop (i, func);
        }
        else {
            func (i);
        }
    }
};

// Variables that require the functions
for (var i in _COLOR) {
    if (typeof i === 'object') {
        _COLOR.CLEAR[i] = {};
        for (var j in i) {
            _COLOR.CLEAR[i][j] = hsbaEdit(i[j],0,0,0,-80);
        }
    }
    else {
        _COLOR.CLEAR[i] = hsbaEdit(_COLOR[i],0,0,0,-80);
    }
}
}

/***************
 * OBJECT TYPES
***************/
{

/** Math **/
/* Vector */
var Vector = function () {
    this.args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
    for (var i = 0; i < 3; i ++) {
        this.defineThunk (Vector.thunk[i], i);
    }

};
Vector.thunk = ["x", "y", "z"];
Vector.deleted = [];
Vector.prototype = {
    // New Vectors
    new : function () {
        var v;
        if (Vector.deleted.length > 0) {
            v = Vector.deleted.pop();
            v.constructor (arguments);
        }
        else {
            v = Vector.new(arguments);
        }
        return v;
    },
    delete : function () {
        Vector.deleted.push(this);
    },
    
    // Makes this.x, this.y, and this.z aliases of this.ars[0], this.args[1], and this.agrs[2]
    defineThunk : function (property, index) {
        Object.defineProperty(this, property, {
            get : function () {return this.args[index];},
            set : function (val) {this.args[index] = val;},
        });
    },
    
    // Vector functions
    unitVector : function () {
        var i;
        var len = this.args.length;
        var mag = this.getMagnitude();
        for (i = 0; i < len; i ++) {
            this.args[i] /= mag;
        }
        return Vector.new (this.args);
    },
    add : function (vector) {
        var i;
        var len = min(vector.args.length, this.args.length);
        var abcd = this.args;
        for (i = 0; i < len; i++) {
            this.args[i] = (vector.args[i]||0)+(this.args[i]||0);
        }
        return Vector.new (this.args);
        
        
    },
    sub : function (vector) {
        var i;
        var len = min(vector.args.length, this.args.length);
        for (i = 0; i < len; i++) {
            this.args[i] = (this.args[i]||0)-(vector.args[i]||0);
        }
        return Vector.new (this.args);
    },
    mult : function (scalar) {
        scalar = scalar === undefined ? 1 : scalar;
        var i;
        var len = this.args.length;
        for (i = 0; i < len; i++) {
            this.args[i] = (scalar)*(this.args[i]);
        }
        return Vector.new (this.args);
    },
    div : function (scalar) {
        scalar = scalar === undefined ? 1 : 1/scalar;
        var i;
        var len = this.args.length;
        for (i = 0; i < len; i++) {
            this.args[i] = (scalar)*(this.args[i]);
        }
        return Vector.new (this.args);
    },
    getDot : function (vector) {
        var i;
        var len = min(vector.args.length, this.args.length);
        var answer = 0;
        for (i = 0; i < len; i ++) {
            answer += vector.args[i]*this.args[i];
        }
        return answer;
    },
    getCross : function (vector) {
        var v1Len = this.args.length;
        var v2Len = vector.args.length;
        var error = false;
        var c = Vector.new (0,0,0);
        var a = this;
        var b = vector;
        try {
            if (v1Len !== 3 || v2Len !== 3) {
                error = true;
                throw "Vector Error: Tried to get the cross product of two vectors not in 3 dimentions:\n v1 is in "+v1Len+" dimentions and v2 is in "+v2Len+" dimentions.\n\n";
            }
        }
        catch (err) {
            println (err);
        }
        
        if (!error) {
            c.x = a.y*b.z - a.z*b.y;
            c.y = a.z*b.x - a.x*b.z;
            c.z = a.x*b.y - a.y*b.x;
        }
        return c;
    },
    getMagnitude : function () {
        var i;
        var mag = 0;
        var len = this.args.length;
        for (i = 0; i < len; i ++) {
            mag += this.args[i]*this.args[i];
        }
        mag = Math.sqrt(mag);
        return mag;
    },
    get : function () {
        var args = [];
        var i;
        for (i = 0; i < this.args.length; i ++) {
            args[i] = this.args[i];
        }
        return Vector.new (args);
    },
    getMatrix : function () {
        //var matrix = Matrix.new ([this.args]);
        //matrix.transpose();
        //return matrix;
    },
    copy : function (intoVector) {
        if (intoVector === undefined) {
            return this.get();
        }
        else {
            intoVector.args = this.args;
        }
    },
    print : function (l) {
        l = l || "\n";
        for (var i = 0; i < this.args.length; i ++) {
            println ("|"+this.args[i]+"|"+l);
        }
    },
    
    // Transforms
    rotateZ : function (thetaZ, origin) {
        // Gives origin a default value
        origin = origin.get() || Vector.new (0,0,0);
        
        // Defines some variables
        var nv = Vector.new(0,0,0); // New vector
        var sine = sin(thetaZ); // Sine of thetaZ
        var cosine = cos(thetaZ); // Cosine of thetaZ
        
        // Sets the new vector to this vector rotated
        nv.x = cosine * (this.x - origin.x) - sine   * (this.y - origin.y) + origin.x;
        nv.y = sine   * (this.x - origin.x) + cosine * (this.y - origin.y) + origin.y;
        
        // Updates this vector
        this.x = nv.x;
        this.y = nv.y;
        this.z = nv.z;
        
        // Deletes the old vectors
        origin.delete ();
        nv.delete ();
        
        // Returns the new vector
        return this.get();
    },
    rotateY : function (thetaY, origin) {
        // Gives origin a default value
        origin = origin.get() || Vector.new (0,0,0);
        
        // Defines some variables
        var nv = Vector.new(0,0,0); // New vector
        var sine = sin(thetaY); // Sine of thetaY
        var cosine = cos(thetaY); // Cosine of thetaY
        
        // Sets the new vector to this vector rotated
        nv.x = cosine * (this.x - origin.x) - sine   * (this.y - origin.y) + origin.x;
        nv.z = sine   * (this.x - origin.x) + cosine * (this.z - origin.z) + origin.z;
        
        // Updates this vector
        this.x = nv.x;
        this.y = nv.y;
        this.z = nv.z;
        
        // Deletes the old vectors
        origin.delete ();
        nv.delete ();
        
        // Returns the new vector
        return this.get();
    },
    rotateX : function (thetaX, origin) {
        // Gives origin a default value
        origin = origin.get() || Vector.new (0,0,0);
        
        // Defines some variables
        var nv = Vector.new(0,0,0); // New vector
        var sine = sin(thetaX); // Sine of thetaX
        var cosine = cos(thetaX); // Cosine of thetaX
        
        // Sets the new vector to this vector rotated
        nv.y = cosine * (this.y - origin.y) - sine   * (this.z - origin.z) + origin.y;
        nv.z = sine   * (this.y - origin.y) + cosine * (this.z - origin.z) + origin.z;
        
        // Updates this vector
        this.x = nv.x;
        this.y = nv.y;
        this.z = nv.z;
        
        // Deletes the old vectors
        origin.delete ();
        nv.delete ();
        
        // Returns the new vector
        return this.get();
    },
    
    scale : function (scaleVector, origin) {
        // Gives default values to the parameters
        scaleVector = scaleVector || Vector.new (1,1,1);
        scaleVector.y = scaleVector.y === undefined ? scaleVector.x : scaleVector.y;
        scaleVector.z = scaleVector.z === undefined ? scaleVector.x : scaleVector.z;
        origin = origin || Vector.new (0,0,0);
        
        // Scales the Vector
        this.sub (origin);
        this.x *= scaleVector.x;
        this.y *= scaleVector.y;
        this.z *= scaleVector.z;
        
        // Deletes the old vectors
        scaleVector.delete ();
        origin.delete ();
        
        // Returns the scaled Vector
        return this.get();
    },
};

/** Graphic **/
/* Objects */
var Object3D = function () {};
Object3D.prototype = {
    boundingBoxIntersection : function (ray) {/* Make it do an actual bounding box collision check */},
};

var RaycastMap = function () {
    this.map = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ];
    
    // RenderInformation (ri)
    this.ri = {};
    this.renderedImage = get(0,0,1,1);
    var imgd = this.renderImage.imageData;
    for (var i = 0; i < imgd.length; i ++) {imgd.data[i] = 0;}
    
    // Color schemes
    this.texScheme = {};
};
RaycastMap.prototype = {
    boundingBoxIntersection : function () {return true;},
    render : function (ray, px,py, camera) {
        // Defines some variables from the camera
        var wid = camera.dim.x, hei = camera.dim.y;
        var plane = camera.plane.x;
        
        // Resize the rendered picture if needed
        if (this.renderedImage.width !== wid || this.renderImage.height !== hei) {
            this.renderedImage.resize(wid, hei);
        }
        
        // If px === 0, render
        if (px === 0) {
            // Sets up some varibles
            
            var cameraX = 2 * px / wid - 1; // -1 to 1 along the width of screen
            
            var rayPosX = camera.pos.x, // where the ray is
                rayPosY = camera.pos.y;
            var rayDirX = camera.dir.x + plane.x * cameraX; // which way the ray faces
            var rayDirY = camera.dir.y + plane.y * cameraX;
            
            var mapX = floor(rayPosX); // where is the ray in the map
            var mapY = floor(rayPosY);
            
            var hit = 0; // Do we have a hit against a wall?
            var stepX; // left or right?
            var stepY; // up or down?
            
            var side; // which side (left,right,front,back) of the wall did the ray hit?
            
            // Distances between one x or y side of map grid to the next; and distances between the start position and the next x or y side of map grid
            var deltaDistX = Math.sqrt(1 + (rayDirY * rayDirY) / (rayDirX * rayDirX));
            var deltaDistY = Math.sqrt(1 + (rayDirX * rayDirX) / (rayDirY * rayDirY));
            
            var sideDistX,
                sideDistY;
            
            // defines sideDistX and sideDistY as well as stepX and stepY
            if (rayDirX < 0) {
                stepX = -1;
                sideDistX = (rayPosX - mapX) * deltaDistX;
            }
            else {
                stepX = 1;
                sideDistX = (mapX + 1.0 - rayPosX) * deltaDistX;
            }
            if (rayDirY < 0) {
                stepY = -1;
                sideDistY = (rayPosY - mapY) * deltaDistY;
            }
            else {
                stepY = 1;
                sideDistY = (mapY + 1.0 - rayPosY) * deltaDistY;
            }
            
            // Performs DDA algorithm
            // loop as long as there is no hit
            while (hit === 0) {
                // Which way do we go?
                if (sideDistX < sideDistY) {
                    // Take an x-ward step
                    sideDistX += deltaDistX;
                    mapX += stepX;
                    side = 0;
                }
                else {
                    // Take a y-ward step
                    sideDistY += deltaDistY;
                    mapY += stepY;
                    side = 1;
                }
                
                // Is there a hit/ray goes to far?
                if (this.map[mapX][mapY] > 0) {hit = 1;}
                if (dist(mapX,mapY, rayPosX,rayPosY) > 50) {hit = -1;}
            }
            
            
            // Calculate how far away the wall is
            var perpWallDist; // perpendicular distance (how far either x or y) instead of real distance (how far both x and y) to avoid fish eye effect and other problems
            
            if (side === 0) {perpWallDist = (mapX - rayPosX + (1 - stepX) / 2) / rayDirX;}
            else            {perpWallDist = (mapY - rayPosY + (1 - stepY) / 2) / rayDirY;}
            
            // Define how high the wall is
            var lineHeight = ~~(hei / perpWallDist);
            
            var drawStart = -lineHeight / 2 + height / 2;
            if (drawStart < 0) {drawStart = 0;}
            
            var drawEnd = lineHeight / 2 + height / 2;
            if (drawEnd > hei) {drawEnd = hei;}
            
            // Find the texture data
            var texNum = this.map[mapX][mapY] - 1; // which texture?  what number did the map hit?
            
            // Find where exactally along the wall the ray hit
            var wallX;
            if (side === 0) {wallX = rayPosY + perpWallDist * rayDirY;}
            else            {wallX = rayPosX + perpWallDist * rayDirX;}
            wallX -= floor(wallX);
            
            var tex = this.texScheme[texNum] || this.texScheme.default; // tex instead of texture since texture is a Processing.JS function
            if (side === 1) {tex.divide(2);}
            
            // Where along the texture are we?
            var texX = floor(wallX * tex.width);
            if (side === 0 && rayDirX > 0) {texX = tex.width - texX - 1;}
            if (side === 1 && rayDirY < 0) {texX = tex.width - texX - 1;}
            
            // Save the needed data for when the next pixel downward is drawn
            this.ri = {
                hit : hit,
                side : side,
                
                lineHeight : lineHeight,
                drawStart : drawStart,
                drawEnd : drawEnd,
                
                tex : tex,
                texX : texX,
            };
        }
        
        // Now draw the pixel using the saved data
        var pixelColor; // the color of the pixel to be colored
        
        // draw the ceiling
        if (py < this.ri.drawStart) {}
        // draw the floor
        else if (py > this.ri.drawEnd) {}
        // draw the wall
        else {
            var d = py * 256 - hei * 128 + this.ri.lineHeight * 128;
            var texY = ~~(((d * this.ri.tex.height) / this.ri.lineHeight) / 256);
            
            if (this.ri.hit < 1) {
                pixelColor = 0;
            }
            else {
                pixelColor = this.ri.tex[this.ri.tex.height * texY + this.ri.texX];
                if (this.ri.side === 1){
                    pixelColor = (pixelColor >> 1) & 8355711; // change to use tex.darken or tex.divide
                }
            }
        }
        
        // Return the rendered pixel
        return pixelColor;
        
        /*// If px === 0, render (save information: start and end draw, lineHeight, hit, texNum, texHeight, side, rayDirX, rayDirY, mapX, mapY, wallX, perpWallDist, distPlayer, 
        if (px === 0) {
            var stepX, stepY;
            var sideDistX, sideDistY;
            var col;
            
            var cameraX = 2 * px / camera.dim.x - 1;
            var rayPosX = camera.pos.x, rayPosY = camera.pos.y;
            this.ri.rayDirX = ray.x;
            this.ri.rayDirY = ray.z;
            
            this.ri.mapX = Math.floor(rayPosX);
            this.ri.mapY = Math.floor(rayPosY);
            
            var deltaDistX = Math.sqrt(1 + (this.ri.rayDirY * this.ri.rayDirY) / (this.ri.rayDirX * this.ri.rayDirX));
            var deltaDistY = Math.sqrt(1 + (this.ri.rayDirX * this.ri.rayDirX) / (this.ri.rayDirY * this.ri.rayDirY));
            
            this.ri.hit = 0;
            
            if (this.ri.rayDirX < 0) {
                stepX = -1;
                sideDistX = (rayPosX - this.ri.mapX) * deltaDistX;
            }
            else {
                stepX = 1;
                sideDistX = (this.ri.mapX + 1.0 - rayPosX) * deltaDistX;
            }
            if (this.ri.rayDirY < 0) {
                stepY = -1;
                sideDistY = (rayPosY - this.ri.mapY) * deltaDistY;
            }
            else {
                stepY = 1;
                sideDistY = (this.ri.mapY + 1.0 - rayPosY) * deltaDistY;
            }
            
            while (this.ri.hit === 0) {
                if (sideDistX < sideDistY) {
                    sideDistX += deltaDistX;
                    this.ri.mapX += stepX;
                    this.ri.side = 0;
                }
                else {
                    sideDistY += deltaDistY;
                    this.ri.mapY += stepY;
                    this.ri.side = 1;
                }
                
                if (this.map[this.ri.mapX][this.ri.mapY] > 0) {this.ri.hit = 1;}
                if (dist(this.ri.mapX,this.ri.mapY, rayPosX,rayPosY) > 50) {this.ri.hit = -1;}
            }
            
            if (this.ri.side === 0) {this.ri.perpWallDist = (this.ri.mapX - rayPosX + (1 - stepX) / 2) / this.ri.rayDirX;}
            else            {this.ri.perpWallDist = (this.ri.mapY - rayPosY + (1 - stepY) / 2) / this.ri.rayDirY;}
            
            this.ri.lineHeight = ~~(camera.dim.y / this.ri.perpWallDist);
            
            this.ri.drawStart = -this.ri.lineHeight / 2 + camera.dim.y / 2;
            if (this.ri.drawStart < 0) {this.ri.drawStart = 0;}
            this.ri.drawEnd = this.ri.lineHeight / 2 + camera.dim.y / 2;
            
            this.ri.texNum = this.map[this.ri.mapX][this.ri.mapY] - 1;
            
            if (this.ri.side === 0) {this.ri.wallX = this.ri.rayPosY + this.ri.perpWallDist * this.ri.rayDirY;}
            else            {this.ri.wallX = this.ri.rayPosX + this.ri.perpWallDist * this.ri.rayDirX;}
            this.ri.wallX -= floor(this.ri.wallX);
            
            this.ri.col = this.colorScheme[this.ri.texNum];
            if (this.ri.side === 1) {this.ri.col = color(red(col)/2,green(col)/2,blue(col)/2);}
            
            this.ri.tex = this.texScheme[this.ri.texNumber];
            this.texX = floor(this.ri.wallX * this.ri.text.width);
            if (this.ri.side === 0 && this.ri.rayDirX > 0) {this.ri.texX = this.ri.tex.width - this.ri.texX - 1;}
            if (this.ri.side === 1 && this.ri.rayDirY < 0) {this.ri.texX = this.ri.tex.wdtih - this.ri.texX - 1;}
            
        }
        // Then, draw (update and return this.renderedImage)
        if (this.renderImage.width !== camera.dim.x || this.renderImage.height !== camera.dim.y) {
            this.renderImage.resize (camera.dim.x,camera.dim.y);
        }
        
        // Draws the ceiling
        if (py <= this.ri.drawStart) {
            
        }
        // Draws the floor
        else if (py >= this.ri.drawEnd) {
            
        }
        // Draws the wall
        else {
            var d = py * 256 - this.cam.dim.y * 128 + this.ri.lineHeight * 128;
                var texY = ~~(((d * this.ri.texHeight) / this.ri.lineHeight) / 256);
                var Color;
                if (this.ri.hit < 1) {
                    Color = 0;
                }
                else {
                    Color = this.texScheme[this.ri.texNum][this.ri.texHeight * texY + this.ri.texX];
                    if(side === 1){
                        Color = (Color >> 1) & 8355711;
                    }
                }
                pixAt (imageData.data, x,y,Color);
        }*/
        
        
    }, // Requires the nested loop to be px,py instead of vise versa (or just use the Camera object type)
};

/* Scene */
var Scene = function () {
  this.objects = [];  
};
Scene.prototype = {
    findIntersections : function (ray) {
        var intersections = [];
        for (var i = 0; i < this.objects.length; i ++) {
            if (this.objects[i].boundingBoxIntersection(ray)) {
                intersections.push (this.objects[i]);
            }
        }
        return intersections;
    },
};

/* Camera */
var Camera = function (pos, direction, dimensions) {
    // Vectors
    this.pos = pos || Vector.new (0,0,0);
    this.dir = direction || Vector.new (0,0,1);
    this.plane = {
        x : Vector.new (1,0,0),
        y : Vector.new (0,1,0)
    };
    
    this.fov = Vector.new (0.66, 0.66);
    this.plane.x.mult (this.fov.x);
    this.plane.y.mult (this.fov.y);
    
    // Original Vectors
    this.opos = this.pos.get();
    this.odir = this.dir.get();
    this.oplaneX = this.plane.x.get();
    this.oplaneY = this.plane.y.get();
    
    // Other
    this.rotation = Vector.new (0,0,0);
    
    this.dim = dimensions || Vector.new (width,height);
};
Camera.prototype = {
    delete : function () {
        this.pos.delete ();
        this.dir.delete ();
        this.plane.x.delete ();
        this.plane.y.delete ();
        this.fov.delete ();
        this.dim.delete ();
        this.opos.delete ();
        this.odir.delete ();
        this.oplaneX.delete ();
        this.oplaneY.delete ();
    },
    
    rotate : function (thetaZ, thetaY, thetaX, origin) {
        // Sets default values for all the parameters
        thetaZ = thetaZ || 0;
        thetaY = thetaY || 0;
        thetaX = thetaX || 0;
        origin = origin || this.pos;
        
        // Finds the total X,Y,Z rotation of the camera
        this.rotation.z += thetaZ;
        this.rotation.y += thetaY;
        this.rotation.x += thetaX;
        
        // Sets the camera vectors back to the original values
        this.opos.copy(this.pos);
        this.odir.copy(this.dir);
        this.oscreenX.copy(this.screen.x);
        this.oscreenY.copy(this.screen.y);
        
        // Rotates on the Z axis
        this.pos.rotateZ (this.rotation.z);
        this.dir.rotateZ (this.rotation.z);
        this.pnx.rotateZ (this.rotation.z);
        this.pny.rotateZ (this.rotation.z);
        
        // Rotate on the Y axis
        this.pos.rotateY (this.rotation.y);
        this.dir.rotateY (this.rotation.y);
        this.pnx.rotateY (this.rotation.y);
        this.pny.rotateY (this.rotation.y);
        
        // Rotate on the Z axis
        this.pos.rotateX (this.rotation.x);
        this.dir.rotateX (this.rotation.x);
        this.pnx.rotateX (this.rotation.x);
        this.pny.rotateX (this.rotation.x);
        
    },
    render : function (scene) {
        // Sets up variables
        var x,y, px=0,py=0;
        var wid = this.dim.x, hei = this.dim.y;
        var ray; /** TODO: precalculate raytracing rays from camera **/
        var intersectingObjects=[], i;
        
        // Loops through every pixel on the screen
        for (x = -this.fov.x; x < this.fov.x; x += (2*this.fov.x) / wid, px += 1) {
            for (y = -this.fov.y; y < this.fov.y; y += (2*this.fov.y) / wid, py += 1) {
                // Defines a ray
                ray = this.castRay (x,y); // ray is an object
                ray = Vector.new (ray.x,ray.y,ray.z);
                
                // Finds which objects the ray intersects
                intersectingObjects = scene.findIntersections(ray); // -> loops through all objects and sees which one has the ray passing through its bounding box | takes a vector
                // Calls that object's render function
                
                for (i = 0; i < intersectingObjects.length; i += 1) {
                    intersectingObjects[i].render (ray, px,py, this); // -> if raycasting or voxel, DDA algorithm, otherwise, raytracing algorithm
                }
                
                
                // Deletes the ray vector
                ray.delete ();
            }
        }
        
        /*
loop horizontal
	define calchight
	loop vertical
		if send
			send ray
			calculate intersection
		if 2d map
			send = false
			cal hight
		color accordingly
        */
    },
    
    castRay : function (x,y) {
        var u, v;
        
        u = {
            x : lerp(-this.u.x,this.u.x, x),
            y : lerp(-this.u.y,this.u.y, x),
            z : lerp(-this.u.z,this.u.z, x)
        };
        v = {
            x : lerp(-this.v.x,this.v.x, y),
            y : lerp(-this.v.y,this.v.y, y),
            z : lerp(-this.v.z,this.v.z, y)
        };
        
        var ray = {
            x : u.x + v.x,
            y : u.y + v.y,
            z : u.z + v.z
        };
        
        
        return ray;
    },
};

}

/***************
 * MAIN
***************/

/** SCENES **/
{
var Load = function () {
    this.imageIndex = -1;
    this.rotateSpeed = 2;
    this.cli = _LOADFUNCS_[0]; // currently loading image
};
Load.prototype = {
    loadImages : function () {
        if (this.imageIndex < 0) {
            this.drawLoadImage ();
        }
        else if (this.imageIndex >= 0 && this.imageIndex < _LOADFUNCS_.length) {
            this.cli = _LOADFUNCS_[this.imageIndex];
            this.cli();
        }
        else {
            __SCENE = 'logo';
        }
        this.imageIndex += 1;
    },
    drawLoadImage : function () {
        pushStyle ();
        background (0,0,0,0);
        stroke (_COLOR.CLEAR.WHITE);
        strokeWeight (7);
        noFill ();
        
        ellipse (width/2, height/2, width/3, height/3);
        
        
        fill (_COLOR.CLEAR.CREAM);
        noStroke ();
        
        for (var i = 0; i < 3; i ++) {
            ellipse (width/2, height/3, 30-i*10, 35-i*4);
        }
        
        popStyle ();
        this.loaderImage = get (0, 0, width, height);
    },
    draw : function () {
        background (_COLOR.BLACK);
        pushMatrix ();
        
        translate ( width/2,  height/2);
        var speed = 10;
        rotate (millis()/(100/speed));
        translate (-width/2, -height/2);
        
        image (this.loaderImage, 0, 0, width, height);
        
        
        popMatrix ();
        
        fill (_COLOR.CREAM);
        textSize (30);
        textAlign (CENTER, TOP);
        
        text ("Loading...", width/2, 20);
        
        stroke (_COLOR.RED);
        strokeWeight (2);
        noFill ();
        
        rectMode (CENTER);
        rect (width/2, height/1.2, width/2, 25, 10);
        
        fill (_COLOR.RED);
        
        rectMode (CORNER);
        var per = constrain(this.imageIndex/_LOADFUNCS_.length, 0, 1);
        rect (width/4, height/1.25, width/2*per, 25, 10);
        fill (hsbaEdit(_COLOR.RED, 0, -100, 25));
        rect (width/4 + 10, height/1.25 + 3, width/2*per - 20, 10, 20);
        
        fill (_COLOR.WHITE);
        textAlign (CENTER, TOP);
        textSize (22);
        text (round(per*100)+"%", width/2, height/1.25);
    },
    run : function () {
        frameRate (0);
        this.loadImages ();
        this.draw ();
    },
};

var Logo = function () {
    this.frame = 0;
    this.scene = 0;
    this.presentsAlpha = 0;
};
Logo.prototype = {
    onFirstFrame : function () {},
    draw : function () {
        background (40);
        
        fill (hsbaEdit(_COLOR.CREAM, 0,0,0, this.frame-255));
        textFont (_FONT.SANS, 50);
        textAlign (CENTER, CENTER);
        text("Awesome Logo", 0,0, width,height);
        
        textSize (30);
        fill (hsbaEdit(_COLOR.CREAM, 0,0,0, this.presentsAlpha-255));
        text("Presents...", 0,50, width,height);
    },
    run : function () {
        __SCENE = "menu";
        this.draw ();
        
        if (this.frame >= 300) {
            this.presentsAlpha += 3;
        }
        if (this.presentsAlpha >= 100) {
            __SCENE = 'menu';
        }
        
        this.frame ++;
        
    },
};

var Menu = function () {
    
};
Menu.prototype = {
    onFirstFrame : function () {},
    run : function () {},
};

var Game = function () {
    
};
Game.prototype = {
    onFirstFrame : function () {
    },
    run : function () {},
};


}


var _SCENES_ = {
    'load' : new Load (),
    'logo' : new Logo (),
    'menu' : new Menu (),
    'game' : new Game (),
};


/** SPECIAL FUNCTIONS **/
{
draw = function () {
    var sc = __SCENE;
    _SCENES_[__SCENE.toLowerCase()].run ();
    if (sc !== __SCENE) {
        _SCENES_[__SCENE.toLowerCase()].onFirstFrame();
    }
};


keyPressed = function () {
    _KEYS[keyCode] = true;
};
keyReleased = function () {};
keyTyped = function () {};

mousePressed = function () {};
mouseReleased = function () {};
mouseClicked = function () {};
mouseOver = function () {};
mouseOut = function () {};

}






