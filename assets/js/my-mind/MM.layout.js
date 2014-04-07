MM.Layout = Object.create(MM.Repo, {
	ALL: {value: []},
	SPACING_RANK: {value: 4},
	SPACING_CHILD: {value: 4},
});

MM.Layout.getAll = function() {
	return this.ALL;
}

/**
 * Re-draw an item and its children
 */
 MM.Layout.update = function(item) {
 	return this;
 }

/**
 * @param {MM.Item} child Child node (its parent uses this layout)
 */
 MM.Layout.getChildDirection = function(child) {
 	return "";
 }

 MM.Layout.pick = function(item, dir) {
 	var opposite = {
 		left: "right",
 		right: "left",
 		top: "bottom",
 		bottom: "top"
 	}

 	/* direction for a child */
 	if (!item.isCollapsed()) {
 		var children = item.getChildren();
 		for (var i=0;i<children.length;i++) {
 			var child = children[i];
 			if (this.getChildDirection(child) == dir) { return child; }
 		}
 	}

 	if (item.isRoot()) { return item; }

 	var parentLayout = item.getParent().getLayout();
 	var thisChildDirection = parentLayout.getChildDirection(item);
 	if (thisChildDirection == dir) {
 		return item;
 	} else if (thisChildDirection == opposite[dir]) {
 		return item.getParent();
 	} else {
 		return parentLayout.pickSibling(item, (dir == "left" || dir == "top" ? -1 : +1));
 	}
 }

 MM.Layout.pickSibling = function(item, dir) {
 	if (item.isRoot()) { return item; }

 	var children = item.getParent().getChildren();
 	var index = children.indexOf(item);
 	index += dir;
 	index = (index+children.length) % children.length;
 	return children[index];
 }

/**
 * Adjust canvas size and position
 */
 MM.Layout._anchorCanvas = function(item) {
 	var dom = item.getDOM();
 	dom.canvas.width = dom.node.offsetWidth;
 	dom.canvas.height = dom.node.offsetHeight;
 }

 MM.Layout._anchorToggle = function(item, x, y, side) {
 	var node = item.getDOM().toggle;
 	var w = node.offsetWidth;
 	var h = node.offsetHeight;
 	var l = x;
 	var t = y;

 	switch (side) {
 		case "left":
 		t -= h/2;
 		l -= w;
 		break;

 		case "right":
 		t -= h/2;
 		break;

 		case "top":
 		l -= w/2;
 		t -= h;
 		break;

 		case "bottom":
 		l -= w/2;
 		break;
 	}

 	node.style.left = Math.round(l) + "px";
 	node.style.top = Math.round(t) + "px";
 }

 MM.Layout._getChildAnchor = function(item, side) {
 	var dom = item.getDOM();
 	if (side == "left" || side == "right") {
 		var pos = dom.node.offsetLeft + dom.content.offsetLeft;
 		if (side == "left") { pos += dom.content.offsetWidth; }
 	} else {
 		var pos = dom.node.offsetTop + dom.content.offsetTop;
 		if (side == "top") { pos += dom.content.offsetHeight; }
 	}
 	return pos;
 }

 MM.Layout._computeChildrenBBox = function(children, childIndex) {
 	var bbox = [0, 0];
 	var rankIndex = (childIndex+1) % 2;

 	children.forEach(function(child, index) {
 		var node = child.getDOM().node;
 		var childSize = [node.offsetWidth, node.offsetHeight];

 		bbox[rankIndex] = Math.max(bbox[rankIndex], childSize[rankIndex]); /* adjust cardinal size */
 		bbox[childIndex] += childSize[childIndex]; /* adjust orthogonal size */
 	}, this);

 	if (children.length > 1) { bbox[childIndex] += this.SPACING_CHILD * (children.length-1); } /* child separation */

 	return bbox;
 }

 MM.Layout._alignItem = function(item, side) {
 	var dom = item.getDOM();

 	switch (side) {
 		case "left":
 		dom.content.appendChild(dom.value);
 		dom.content.appendChild(dom.status);
 		break;
 		case "right":
 		dom.content.insertBefore(dom.value, dom.content.firstChild);
 		dom.content.insertBefore(dom.status, dom.content.firstChild);
 		break;
 	}
 }
 MM.Layout.Graph = Object.create(MM.Layout, {
 	SPACING_RANK: {value: 16},
 	childDirection: {value: ""}
 });

 MM.Layout.Graph.getChildDirection = function(child) {
 	return this.childDirection;
 }

 MM.Layout.Graph.create = function(direction, id, label) {
 	var layout = Object.create(this, {
 		childDirection: {value:direction},
 		id: {value:id},
 		label: {value:label}
 	});
 	MM.Layout.ALL.push(layout);
 	return layout;
 }

 MM.Layout.Graph.update = function(item) {
 	var side = this.childDirection;
 	if (!item.isRoot()) {
 		side = item.getParent().getLayout().getChildDirection(item);
 	}
 	this._alignItem(item, side);

 	this._layoutItem(item, this.childDirection);

 	if (this.childDirection == "left" || this.childDirection == "right") {
 		this._drawLinesHorizontal(item, this.childDirection);
 	} else {
 		this._drawLinesVertical(item, this.childDirection);
 	}

 	return this;
 }


/**
 * Generic graph child layout routine. Updates item's orthogonal size according to the sum of its children.
 */
 MM.Layout.Graph._layoutItem = function(item, rankDirection) {
 	var sizeProps = ["width", "height"];
 	var posProps = ["left", "top"];
 	var rankIndex = (rankDirection == "left" || rankDirection == "right" ? 0 : 1);
 	var childIndex = (rankIndex+1) % 2;

 	var rankPosProp = posProps[rankIndex];
 	var childPosProp = posProps[childIndex];
 	var rankSizeProp = sizeProps[rankIndex];
 	var childSizeProp = sizeProps[childIndex];

 	var dom = item.getDOM();

 	/* content size */
 	var contentSize = [dom.content.offsetWidth, dom.content.offsetHeight];

 	/* children size */
 	var bbox = this._computeChildrenBBox(item.getChildren(), childIndex);

 	/* node size */
 	var rankSize = contentSize[rankIndex];
 	if (bbox[rankIndex]) { rankSize += bbox[rankIndex] + this.SPACING_RANK; }
 	var childSize = Math.max(bbox[childIndex], contentSize[childIndex]);
 	dom.node.style[rankSizeProp] = rankSize + "px";
 	dom.node.style[childSizeProp] = childSize + "px";

 	var offset = [0, 0];
 	if (rankDirection == "right") { offset[0] = contentSize[0] + this.SPACING_RANK; }
 	if (rankDirection == "bottom") { offset[1] = contentSize[1] + this.SPACING_RANK; }
 	offset[childIndex] = Math.round((childSize - bbox[childIndex])/2);
 	this._layoutChildren(item.getChildren(), rankDirection, offset, bbox);

 	/* label position */
 	var labelPos = 0;
 	if (rankDirection == "left") { labelPos = rankSize - contentSize[0]; }
 	if (rankDirection == "top") { labelPos = rankSize - contentSize[1]; }
 	dom.content.style[childPosProp] = Math.round((childSize - contentSize[childIndex])/2) + "px";
 	dom.content.style[rankPosProp] = labelPos + "px";

 	return this;
 }

 MM.Layout.Graph._layoutChildren = function(children, rankDirection, offset, bbox) {
 	var posProps = ["left", "top"];

 	var rankIndex = (rankDirection == "left" || rankDirection == "right" ? 0 : 1);
 	var childIndex = (rankIndex+1) % 2;
 	var rankPosProp = posProps[rankIndex];
 	var childPosProp = posProps[childIndex];

 	children.forEach(function(child, index) {
 		var node = child.getDOM().node;
 		var childSize = [node.offsetWidth, node.offsetHeight];

 		if (rankDirection == "left") { offset[0] = bbox[0] - childSize[0]; }
 		if (rankDirection == "top") { offset[1] = bbox[1] - childSize[1]; }

 		node.style[childPosProp] = offset[childIndex] + "px";
 		node.style[rankPosProp] = offset[rankIndex] + "px";

 		offset[childIndex] += childSize[childIndex] + this.SPACING_CHILD; /* offset for next child */
 	}, this);

 	return bbox;
 }

 MM.Layout.Graph._drawLinesHorizontal = function(item, side) {
 	this._anchorCanvas(item);
 	this._drawHorizontalConnectors(item, side, item.getChildren());
 }

 MM.Layout.Graph._drawLinesVertical = function(item, side) {
 	this._anchorCanvas(item);
 	this._drawVerticalConnectors(item, side, item.getChildren());
 }

 MM.Layout.Graph._drawHorizontalConnectors = function(item, side, children) {
 	if (children.length == 0) { return; }

 	var dom = item.getDOM();
 	var canvas = dom.canvas;
 	var ctx = canvas.getContext("2d");
 	ctx.strokeStyle = item.getColor();
 	var R = this.SPACING_RANK/2;

 	/* first part */
 	var y1 = item.getShape().getVerticalAnchor(item);
 	if (side == "left") {
 		var x1 = dom.content.offsetLeft - 0.5;
 	} else {
 		var x1 = dom.content.offsetWidth + dom.content.offsetLeft + 0.5;
 	}

 	this._anchorToggle(item, x1, y1, side);
 	if (item.isCollapsed()) { return; }

 	if (children.length == 1) {
 		var child = children[0];
 		var y2 = child.getShape().getVerticalAnchor(child) + child.getDOM().node.offsetTop;
 		var x2 = this._getChildAnchor(child, side);
 		ctx.beginPath();
 		ctx.moveTo(x1, y1);
 		ctx.bezierCurveTo((x1+x2)/2, y1, (x1+x2)/2, y2, x2, y2);
 		ctx.stroke();
 		return;
 	}

 	if (side == "left") {
 		var x2 = x1 - R;
 	} else {
 		var x2 = x1 + R;
 	}

 	ctx.beginPath();
 	ctx.moveTo(x1, y1);
 	ctx.lineTo(x2, y1);
 	ctx.stroke();

 	/* rounded connectors */
 	var c1 = children[0];
 	var c2 = children[children.length-1];
 	var x = x2;
 	var xx = x + (side == "left" ? -R : R);

 	var y1 = c1.getShape().getVerticalAnchor(c1) + c1.getDOM().node.offsetTop;
 	var y2 = c2.getShape().getVerticalAnchor(c2) + c2.getDOM().node.offsetTop;
 	var x1 = this._getChildAnchor(c1, side);
 	var x2 = this._getChildAnchor(c2, side);

 	ctx.beginPath();
 	ctx.moveTo(x1, y1);
 	ctx.lineTo(xx, y1)
 	ctx.arcTo(x, y1, x, y1+R, R);
 	ctx.lineTo(x, y2-R);
 	ctx.arcTo(x, y2, xx, y2, R);
 	ctx.lineTo(x2, y2);

 	for (var i=1; i<children.length-1; i++) {
 		var c = children[i];
 		var y = c.getShape().getVerticalAnchor(c) + c.getDOM().node.offsetTop;
 		ctx.moveTo(x, y);
 		ctx.lineTo(this._getChildAnchor(c, side), y);
 	}
 	ctx.stroke();
 }

 MM.Layout.Graph._drawVerticalConnectors = function(item, side, children) {
 	if (children.length == 0) { return; }

 	var dom = item.getDOM();
 	var canvas = dom.canvas;
 	var ctx = canvas.getContext("2d");
 	ctx.strokeStyle = item.getColor();

 	/* first part */
 	var R = this.SPACING_RANK/2;

 	var x = item.getShape().getHorizontalAnchor(item);
 	var height = (children.length == 1 ? 2*R : R);

 	if (side == "top") {
 		var y1 = canvas.height - dom.content.offsetHeight;
 		var y2 = y1 - height;
 		this._anchorToggle(item, x, y1, side);
 	} else {
 		var y1 = item.getShape().getVerticalAnchor(item);
 		var y2 = dom.content.offsetHeight + height;
 		this._anchorToggle(item, x, dom.content.offsetHeight, side);
 	}

 	ctx.beginPath();
 	ctx.moveTo(x, y1);
 	ctx.lineTo(x, y2);
 	ctx.stroke();


 	if (children.length == 1) { return; }

 	/* rounded connectors */
 	var c1 = children[0];
 	var c2 = children[children.length-1];
 	var offset = dom.content.offsetHeight + height;
 	var y = Math.round(side == "top" ? canvas.height - offset : offset) + 0.5;

 	var x1 = c1.getShape().getHorizontalAnchor(c1) + c1.getDOM().node.offsetLeft;
 	var x2 = c2.getShape().getHorizontalAnchor(c2) + c2.getDOM().node.offsetLeft;
 	var y1 = this._getChildAnchor(c1, side);
 	var y2 = this._getChildAnchor(c2, side);

 	ctx.beginPath();
 	ctx.moveTo(x1, y1);
 	ctx.arcTo(x1, y, x1+R, y, R);
 	ctx.lineTo(x2-R, y);
 	ctx.arcTo(x2, y, x2, y2, R);

 	for (var i=1; i<children.length-1; i++) {
 		var c = children[i];
 		var x = c.getShape().getHorizontalAnchor(c) + c.getDOM().node.offsetLeft;
 		ctx.moveTo(x, y);
 		ctx.lineTo(x, this._getChildAnchor(c, side));
 	}
 	ctx.stroke();
 }


 MM.Layout.Graph.Down = MM.Layout.Graph.create("bottom", "graph-bottom", "Bottom");
 MM.Layout.Graph.Up = MM.Layout.Graph.create("top", "graph-top", "Top");
 MM.Layout.Graph.Left = MM.Layout.Graph.create("left", "graph-left", "Left");
 MM.Layout.Graph.Right = MM.Layout.Graph.create("right", "graph-right", "Right");
 
 MM.Layout.Tree = Object.create(MM.Layout, {
 	SPACING_RANK: {value: 32},
 	childDirection: {value: ""}
 });

 MM.Layout.Tree.getChildDirection = function(child) {
 	return this.childDirection;
 }

 MM.Layout.Tree.create = function(direction, id, label) {
 	var layout = Object.create(this, {
 		childDirection: {value:direction},
 		id: {value:id},
 		label: {value:label}
 	});
 	MM.Layout.ALL.push(layout);
 	return layout;
 }

 MM.Layout.Tree.update = function(item) {
 	var side = this.childDirection;
 	if (!item.isRoot()) {
 		side = item.getParent().getLayout().getChildDirection(item);
 	}
 	this._alignItem(item, side);

 	this._layoutItem(item, this.childDirection);
 	this._anchorCanvas(item);
 	this._drawLines(item, this.childDirection);
 	return this;
 }

/**
 * Generic graph child layout routine. Updates item's orthogonal size according to the sum of its children.
 */
 MM.Layout.Tree._layoutItem = function(item, rankDirection) {
 	var dom = item.getDOM();

 	/* content size */
 	var contentSize = [dom.content.offsetWidth, dom.content.offsetHeight];

 	/* children size */
 	var bbox = this._computeChildrenBBox(item.getChildren(), 1);

 	/* node size */
 	var rankSize = contentSize[0];
 	var childSize = bbox[1] + contentSize[1];
 	if (bbox[0]) { 
 		rankSize = Math.max(rankSize, bbox[0] + this.SPACING_RANK); 
 		childSize += this.SPACING_CHILD;
 	}
 	dom.node.style.width = rankSize + "px";
 	dom.node.style.height = childSize + "px";

 	var offset = [this.SPACING_RANK, contentSize[1]+this.SPACING_CHILD];
 	if (rankDirection == "left") { offset[0] = rankSize - bbox[0] - this.SPACING_RANK; }
 	this._layoutChildren(item.getChildren(), rankDirection, offset, bbox);

 	/* label position */
 	var labelPos = 0;
 	if (rankDirection == "left") { labelPos = rankSize - contentSize[0]; }
 	dom.content.style.left = labelPos + "px";
 	dom.content.style.top = 0;

 	return this;
 }

 MM.Layout.Tree._layoutChildren = function(children, rankDirection, offset, bbox) {
 	children.forEach(function(child, index) {
 		var node = child.getDOM().node;
 		var childSize = [node.offsetWidth, node.offsetHeight];
 		var left = offset[0];
 		if (rankDirection == "left") { left += (bbox[0] - childSize[0]); }

 		node.style.left = left + "px";
 		node.style.top = offset[1] + "px";

 		offset[1] += childSize[1] + this.SPACING_CHILD; /* offset for next child */
 	}, this);

 	return bbox;
 }

 MM.Layout.Tree._drawLines = function(item, side) {
 	var dom = item.getDOM();
 	var canvas = dom.canvas;

 	var R = this.SPACING_RANK/4;
 	var x = (side == "left" ? canvas.width - 2*R : 2*R) + 0.5;
 	this._anchorToggle(item, x, dom.content.offsetHeight, "bottom");

 	var children = item.getChildren();
 	if (children.length == 0 || item.isCollapsed()) { return; }

 	var ctx = canvas.getContext("2d");
 	ctx.strokeStyle = item.getColor();

 	var y1 = item.getShape().getVerticalAnchor(item);
 	var last = children[children.length-1];
 	var y2 = last.getShape().getVerticalAnchor(last) + last.getDOM().node.offsetTop;

 	ctx.beginPath();
 	ctx.moveTo(x, y1);
 	ctx.lineTo(x, y2 - R);

 	/* rounded connectors */
 	for (var i=0; i<children.length; i++) {
 		var c = children[i];
 		var y = c.getShape().getVerticalAnchor(c) + c.getDOM().node.offsetTop;
 		var anchor = this._getChildAnchor(c, side);

 		ctx.moveTo(x, y - R);
 		ctx.arcTo(x, y, anchor, y, R);
 		ctx.lineTo(anchor, y);
 	}
 	ctx.stroke();
 }

 MM.Layout.Tree.Left = MM.Layout.Tree.create("left", "tree-left", "Left");
 MM.Layout.Tree.Right = MM.Layout.Tree.create("right", "tree-right", "Right");

 
 MM.Layout.Map = Object.create(MM.Layout.Graph, {
 	id: {value:"map"},
 	label: {value:"Map"},
 	LINE_THICKNESS: {value:8}
 });
 MM.Layout.ALL.push(MM.Layout.Map);

 MM.Layout.Map.update = function(item) {
 	if (item.isRoot()) {
 		this._layoutRoot(item);
 	} else {
 		var side = this.getChildDirection(item);
 		var name = side.charAt(0).toUpperCase() + side.substring(1);
 		MM.Layout.Graph[name].update(item);
 	}
 }

/**
 * @param {MM.Item} child Child node
 */
 MM.Layout.Map.getChildDirection = function(child) {
 	while (!child.getParent().isRoot()) {
 		child = child.getParent();
 	}
 	/* child is now the sub-root node */

 	var side = child.getSide();
 	if (side) { return side; }

 	var counts = {left:0, right:0};
 	var children = child.getParent().getChildren();
 	for (var i=0;i<children.length;i++) {
 		var side = children[i].getSide();
 		if (!side) {
 			side = (counts.right > counts.left ? "left" : "right");
 			children[i].setSide(side);
 		}
 		counts[side]++;
 	}

 	return child.getSide();
 }

 MM.Layout.Map.pickSibling = function(item, dir) {
 	if (item.isRoot()) { return item; }

 	var parent = item.getParent();
 	var children = parent.getChildren();
 	if (parent.isRoot()) {
 		var side = this.getChildDirection(item);
 		children = children.filter(function(child) {
 			return (this.getChildDirection(child) == side);
 		}, this);
 	}

 	var index = children.indexOf(item);
 	index += dir;
 	index = (index+children.length) % children.length;
 	return children[index];
 }

 MM.Layout.Map._layoutRoot = function(item) {
 	this._alignItem(item, "right");

 	var dom = item.getDOM();

 	var children = item.getChildren();
 	var childrenLeft = [];
 	var childrenRight = [];

 	children.forEach(function(child, index) {
 		var node = child.getDOM().node;
 		var side = this.getChildDirection(child);

 		if (side == "left") {
 			childrenLeft.push(child);
 		} else {
 			childrenRight.push(child);
 		}
 	}, this);

 	var bboxLeft = this._computeChildrenBBox(childrenLeft, 1);
 	var bboxRight = this._computeChildrenBBox(childrenRight, 1);
 	var height = Math.max(bboxLeft[1], bboxRight[1], dom.content.offsetHeight);

 	var left = 0;
 	this._layoutChildren(childrenLeft, "left", [left, Math.round((height-bboxLeft[1])/2)], bboxLeft);
 	left += bboxLeft[0];

 	if (childrenLeft.length) { left += this.SPACING_RANK; }
 	dom.content.style.left = left + "px";
 	left += dom.content.offsetWidth;

 	if (childrenRight.length) { left += this.SPACING_RANK; }
 	this._layoutChildren(childrenRight, "right", [left, Math.round((height-bboxRight[1])/2)], bboxRight);
 	left += bboxRight[0];

 	dom.content.style.top = Math.round((height - dom.content.offsetHeight)/2) + "px";
 	dom.node.style.height = height + "px";
 	dom.node.style.width = left + "px";

 	this._anchorCanvas(item);
 	this._drawRootConnectors(item, "left", childrenLeft);
 	this._drawRootConnectors(item, "right", childrenRight);
 }

 MM.Layout.Map._drawRootConnectors = function(item, side, children) {
 	if (children.length == 0 || item.isCollapsed()) { return; }

 	var dom = item.getDOM();
 	var canvas = dom.canvas;
 	var ctx = canvas.getContext("2d");
 	var R = this.SPACING_RANK/2;

 	var x1 = dom.content.offsetLeft + dom.content.offsetWidth/2;
 	var y1 = item.getShape().getVerticalAnchor(item);
 	var half = this.LINE_THICKNESS/2;

 	for (var i=0;i<children.length;i++) {
 		var child = children[i];

 		var x2 = this._getChildAnchor(child, side);
 		var y2 = child.getShape().getVerticalAnchor(child) + child.getDOM().node.offsetTop;
 		var angle = Math.atan2(y2-y1, x2-x1) + Math.PI/2;
 		var dx = Math.cos(angle) * half;
 		var dy = Math.sin(angle) * half;

 		ctx.fillStyle = ctx.strokeStyle = child.getColor();
 		ctx.beginPath();
 		ctx.moveTo(x1-dx, y1-dy);
 		ctx.quadraticCurveTo((x2+x1)/2, y2, x2, y2);
 		ctx.quadraticCurveTo((x2+x1)/2, y2, x1+dx, y1+dy);
 		ctx.fill();
 		ctx.stroke();
 	}

 }