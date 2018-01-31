/** Math **/
/***************************************************
 * Vector Object Type:
 * 
 * @DOCUMENTATION:
 
 * Create a new Vector:
var vector = Vector.new (x,y,z,...);
// use `Vector.new` instead of `new Vector`
 * Details: If there is a slot free in the `Vector.deleted` array, recall the constructor function.  If there are no deleted vectors, return a `new Vector`


 * Delete a Vector:
vector_that_is_no_longer_needed.delete ();
// delete all vectors that are no longer being used.

for (var i = 0; i < 10000; i ++) {
    var vector = Vector.new(i,100-i,5*i-100);
    // use the vector
    
    // Even though the vector gets used again, it is recreated and thus needs to be deleted.
    vector.delete (); // failing to delete vectors can result in memory leaks and slowing things down.
}
 * Details: Clears all the attributes and push itself into the `Vector.deleted` array so that it can be reused by the `Vector.new()` function.


 * ATTRIBUTES:
 * Vector.x -> the frist component of the Vector
 * Vector.y -> the second component of the Vector
 * Vector.z -> the third component of the Vector
 * Vector.args -> an array of all the components of the Vector (args is short for arguments)
 
 * METHODS:
 * Vector.unitVector() -> returns a new Vector in the same direction but with the length of 1
 * Vector.add(vector) -> adds two Vectors
 * Vector.sub(vector) -> subtracts two Vectors
 * Vector.mult(scalar) -> multiplies the Vector by a Scalar (number)
 * Vector.div(scalar) -> divides the Vector by a Scalar (number)
 * Vector.getDot(vector) -> returns the dot product of the Vector and another Vector passed as the parameter
 * Vector.getCross(vector) -> returns the cross product of two three-dimentional Vectors
 * Vector.getMagnatude() -> returns the magnatude or length of the vector (from the origin)
 * Vector.get() -> returns an independent copy of the Vector
 * Vector.getMatrix() -> NOT YET IMPLEMENTED -- returns a copy of the Vector as a Matrix object-type
 * Vector.copy(vector) -> copies itself into `vector` (makes `vector` a copy of itself)
 * Vector.print(new_line_type*) -> prints the Vector into the `print` console.  `new_line_type` is the string that gets printed for a new line ("\n" is default. "\t" would separate each component of the Vector with a tab)
 * Vector.rotateZ(theta, origin*) -> rotates the Vector `theta` degrees around the Z axis around the `origin` (default is (0,0,0...))
 * Vector.rotateY(theta, origin*) -> see previous.  Rotates around the Y axis
 * Vector.rotateX(theta, origin*) -> see previous.  Rotates around the X axis
 * Vector.scale(vector, origin*) -> scales the Vector around the `origin` (defalt is (0,0,0...)) by `vector`.  Multiplies each component of the vector along the coorisponding component of the scaling `vector`, also scales along the `origin`
 * Vector.new(x,y*,z*...) -> creates a new Vector (see above)
 * Vector.delete() -> deletes the Vector (see above)
****************************************************/

var Vector = function (components) {
    this.init (components);
    if (this.x === undefined) {this.defineThunk (Vector.thunk[0], 0);}
    if (this.y === undefined) {this.defineThunk (Vector.thunk[1], 1);}
    if (this.z === undefined) {this.defineThunk (Vector.thunk[2], 2);}
};
Vector.thunk = ["x", "y", "z"];
Vector.deleted = [];
Vector.new = function () {
    var v;
    if (Vector.deleted.length > 0) {
        v = Vector.deleted.pop();
        v.init (arguments);
    }
    else {
        v = new Vector(arguments);
    }
    return v;
};
Vector.prototype = {
    delete : function () {
        Vector.deleted.push(this);
    },
    init : function (components) {
        this.args = typeof components[0] === "object" ? components[0] : components;
        this.args = [this.args[0]||0,this.args[1]||0,this.args[2]||0]; // Sets x,y,z to 0 if any of them are undefined
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
        return this;
    },
    add : function (vector) {
        var i;
        var len = min(vector.args.length, this.args.length);
        var abcd = this.args;
        for (i = 0; i < len; i++) {
            this.args[i] = (vector.args[i]||0)+(this.args[i]||0);
        }
        return this;
        
        
    },
    sub : function (vector) {
        var i;
        var len = min(vector.args.length, this.args.length);
        for (i = 0; i < len; i++) {
            this.args[i] = (this.args[i]||0)-(vector.args[i]||0);
        }
        return this;
    },
    mult : function (scalar) {
        scalar = scalar === undefined ? 1 : scalar;
        var i;
        var len = this.args.length;
        for (i = 0; i < len; i++) {
            this.args[i] = (scalar)*(this.args[i]);
        }
        return this;
    },
    div : function (scalar) {
        scalar = scalar === undefined ? 1 : 1/scalar;
        var i;
        var len = this.args.length;
        for (i = 0; i < len; i++) {
            this.args[i] = (scalar)*(this.args[i]);
        }
        return this;
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
        origin = origin || Vector.new (0,0,0);
        
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
        //this.z = nv.z;
        
        // Deletes the old vectors
        origin.delete ();
        nv.delete ();
        
        // Returns the new vector
        return this;
    },
    rotateY : function (thetaY, origin) {
        // Gives origin a default value
        origin = origin || Vector.new (0,0,0);
        
        // Defines some variables
        var nv = Vector.new(0,0,0); // New vector
        var sine = sin(thetaY); // Sine of thetaY
        var cosine = cos(thetaY); // Cosine of thetaY
        
        // Sets the new vector to this vector rotated
        nv.x = cosine * (this.x - origin.x) - sine   * (this.y - origin.y) + origin.x;
        nv.z = sine   * (this.x - origin.x) + cosine * (this.z - origin.z) + origin.z;
        
        // Updates this vector
        this.x = nv.x;
        //this.y = nv.y;
        this.z = nv.z;
        
        // Deletes the old vectors
        origin.delete ();
        nv.delete ();
        
        // Returns the new vector
        return this;
    },
    rotateX : function (thetaX, origin) {
        // Gives origin a default value
        origin = origin || Vector.new (0,0,0);
        
        // Defines some variables
        var nv = Vector.new(0,0,0); // New vector
        var sine = sin(thetaX); // Sine of thetaX
        var cosine = cos(thetaX); // Cosine of thetaX
        
        // Sets the new vector to this vector rotated
        nv.y = cosine * (this.y - origin.y) - sine   * (this.z - origin.z) + origin.y;
        nv.z = sine   * (this.y - origin.y) + cosine * (this.z - origin.z) + origin.z;
        
        // Updates this vector
        //this.x = nv.x;
        this.y = nv.y;
        this.z = nv.z;
        
        // Deletes the old vectors
        origin.delete ();
        nv.delete ();
        
        // Returns the new vector
        return this;
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
        return this;
    },
};
