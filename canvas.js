  var canvas = this.__canvas = new fabric.Canvas('c', { selection: false });
  fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
  function makeCircle(left, top,line1,line2) {
    var c = new fabric.Circle({
      left: left,
      top: top,
      strokeWidth: 5,
      radius: 12,
      fill: '#fff',
      stroke: '#666'
    });
    c.hasControls = c.hasBorders = false;
    c.line1 = line1;
    c.line2 = line2;
    return c;
  }
  function makeLine(coords,p1,p2) {
    var line = new fabric.Line(coords, {
      fill: 'red',
      stroke: 'red',
      strokeWidth: 5,
      //selectable : false,
      lockMovementX : true,
      lockMovementY : true,
      perPixelTargetFind:true
    });
    line.hasControls = line.hasBorders = false;
    line.p1 = p1;
    line.p2 = p2;
    return line;
  }
  
  var nocircle = true;
  var circle = 0;
  $("canvas").dblclick(function(event){
     if(nocircle==true){
        circle = makeCircle(event.clientX,event.clientY);
        canvas.add(circle);
        nocircle = false;
     }
     else {
       var line = makeLine([ circle.left, circle.top,event.clientX,event.clientY ],circle);
       
       circle.set({ 'line2': line });
       circle = makeCircle(event.clientX,event.clientY,line);
       line.set({'p2' : circle});
        canvas.add(
            line,
            circle
        );
        line.sendToBack();
     }
  })

  canvas.on('mouse:up', function(options) {
    var clickedLine = options.target;
    if (clickedLine && clickedLine.type=="line") {

        var breakPoint = makeCircle(options.e.clientX-9,options.e.clientY-9);
        var firstLine = makeLine([clickedLine.p1.left,clickedLine.p1.top,breakPoint.left,breakPoint.top],clickedLine.p1,breakPoint);
        var secondLine = makeLine([breakPoint.left,breakPoint.top,clickedLine.x2,clickedLine.y2],breakPoint,clickedLine.p2);
        
        clickedLine.p1.set({ 'line2': firstLine});
        clickedLine.p2.set({ 'line1' : secondLine});
        
        breakPoint.set({ 'line1' : firstLine});
        breakPoint.set({ "line2" : secondLine});
        
        canvas.remove(clickedLine);
        canvas.add(breakPoint,firstLine,secondLine);
        firstLine.sendToBack();
        secondLine.sendToBack();
        canvas.renderAll();
    }
    
  });
  
  canvas.on('object:moving', function(e) {
    var p = e.target;
    p.line1 && p.line1.set({ 'x2': p.left, 'y2': p.top });
    p.line2 && p.line2.set({ 'x1': p.left, 'y1': p.top });
    p.line1 && p.line1.setCoords();
    p.line2 && p.line2.setCoords();
    
  });